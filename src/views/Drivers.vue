<template>
  <div class="content-wrapper">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <div class="page-header">
      <h3 class="page-title">
        <router-link to="/drivers" class="nav-link">Drivers</router-link>
      </h3>
      <div class="dropdown">
        <button
          class="btn btn-gradient-info dropdown-toggle"
          type="button"
          v-on:click="clickToViewFilter()"
        >
          Filter
        </button>
      </div>
    </div>
    <div class="row">
      <!-- Drivers table -->
      <div
        class="grid-margin stretch-card"
        v-bind:class="{
          'col-lg-12': isTableVisible,
          'col-lg-9': !isTableVisible,
        }"
      >
        <div class="card" v-if="driversList.length > 0">
          <div class="card-body">
            <h4 class="card-title">Driver List</h4>
            <p class="card-description">{{ this.totalDrivers }} total</p>
            <table class="table ">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PHONE NUMBER</th>
                  <th>VEHICLE ID</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(driver, index) in this.driversList"
                  :key="driver.userId"
                >
                  <td class="text-secondary">{{ page * 15 + index + 1 }}</td>
                  <td>{{ driver.userId }}</td>
                  <td>{{ driver.fullName }}</td>
                  <td>{{ driver.phoneNumber }}</td>
                  <td>
                    <p v-if="driver.vehicleId">
                      {{ driver.vehicleId }}
                    </p>
                    <p v-else>N/A</p>
                  </td>
                  <td>
                    <label
                      class="badge"
                      v-bind:class="{
                        'badge-info': driver.userStatusName === 'Active',
                        'badge-danger': driver.userStatusName === 'Inactive',
                        'badge-warning':
                          driver.userStatusName === 'Pending Approval',
                        'badge-dark': driver.userStatusName === 'Disabled',
                      }"
                      >{{ driver.userStatusName }}</label
                    >
                  </td>
                  <td>
                    <router-link
                      :to="{
                        name: 'DriverDetail',
                        params: { userId: driver.userId },
                      }"
                      >Manage</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="this.totalDrivers > 15">
            <paginate
              v-model="currentPage"
              :page-count="Math.floor(this.totalDrivers / 15) + 1"
              :page-range="3"
              :margin-pages="1"
              :click-handler="clickCallback"
              :first-last-button="true"
              :prev-text="'Prev'"
              :next-text="'Next'"
              :container-class="'pagination'"
              :page-class="'page-item'"
              :next-class="'page-item'"
              :prev-class="'page-item'"
              :active-class="'page-active'"
            >
            </paginate>
          </div>
        </div>
        <!-- Empty list -->
        <div class="card empty-list" v-else-if="!isLoading">
          <i class="mdi mdi-account-off"></i>
          <h1>NOTHING</h1>
          <h3>Your list is empty.</h3>
        </div>
      </div>

      <!-- Filter -->
      <transition name="slide-fade">
        <div class="col-3 card filter" v-if="isFilterVisible">
          <div class="form-group">
            <h4 class="card-title mt-4">Filter</h4>
            <div class="col-sm-12">
              <!-- Search Driver ID -->
              <label>Driver ID</label>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Driver ID"
                v-model="searchDriverID"
                @keypress="isNumber($event)"
                maxlength="12"
              />
            </div>
            <div class="col-12 mt-3">
              <label>Driver Name</label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="searchDriverName"
                placeholder="Driver name"
              />
            </div>
            <!-- Phone number dropdown-->
            <div class="col-12 mt-3">
              <label>Phone Number</label>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Phone Number"
                v-model="searchPhoneNumber"
                @keypress="isNumber($event)"
                maxlength="10"
              />
            </div>
            <!-- Driver status dropdown -->
            <div class="col-12 mt-3">
              <label>Status</label>
              <select
                class="form-control form-control-sm"
                name="status"
                v-model="searchStatusID"
              >
                <option
                  v-for="status in this.statusList"
                  :key="status.userStatusId"
                  :value="status.userStatusId"
                  >{{ status.userStatusName }}</option
                >
              </select>
            </div>

            <br />
            <div class="col-12 mt-3">
              <button
                class="btn btn-outline-info w-100"
                type="button"
                v-on:click="searchDrivers()"
              >
                Filter
              </button>
            </div>
            <div class="col-12 mt-2">
              <button
                class="btn btn-outline-danger w-100"
                type="button"
                v-on:click="clearSearchValue()"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { isNumber } from "../assets/js/input.js";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { RepositoryFactory } from "../repositories/RepositoryFactory";

const DriverRepository = RepositoryFactory.get("drivers");
const UserStatusRepository = RepositoryFactory.get("userStatus");

export default {
  name: "Drivers",
  props: {},
  components: {
    Loading,
  },
  data() {
    return {
      isFilterVisible: false,
      isTableVisible: true,
      statusList: [],
      driversList: [],
      searchPhoneNumber: "",
      searchDriverID: "",
      searchDriverName: "",
      searchStatusID: "",
      isLoading: true,
      totalDrivers: 0,
      page: 0,
      currentPage: 1,
    };
  },
  async mounted() {
    await this.initStatusList();
    await this.initDriversList();
  },
  methods: {
    isNumber(evt) {
      isNumber(evt);
    },
    // pagination handle
    async clickCallback(pageNum) {
      this.isLoading = true;
      this.currentPage = pageNum;
      this.page = pageNum - 1;
      this.driversList = await DriverRepository.get(
        this.page,
        this.searchDriverName,
        this.searchPhoneNumber,
        this.searchStatusID,
        this.searchDriverID
      );
      this.isLoading = false;
    },
    // Init data for Driver Status Dropdown
    async initStatusList() {
      // wait for api
      this.statusList = await UserStatusRepository.get();
      this.statusList.push({
        userStatusId: "",
        userStatusName: "None",
      });
    },
    // Clear search item value
    clearSearchValue() {
      this.searchDriverID = "";
      this.searchDriverName = "";
      this.searchPhoneNumber = "";
      this.searchStatusID = "";
    },
    // Search driver
    async searchDrivers() {
      this.isLoading = true;
      this.page = 0;
      this.currentPage = 1;
      this.driversList = await DriverRepository.get(
        this.page,
        this.searchDriverName,
        this.searchPhoneNumber,
        this.searchStatusID,
        this.searchDriverID
      );
      this.totalDrivers = await DriverRepository.getTotalDriver(
        this.searchDriverName,
        this.searchPhoneNumber,
        this.searchStatusID,
        this.searchDriverID
      );
      this.isLoading = false;
    },
    // Init data for driver list
    async initDriversList() {
      this.driversList = await DriverRepository.get(
        this.page,
        this.searchDriverName,
        this.searchPhoneNumber,
        this.searchStatusID,
        this.searchDriverID
      );
      this.totalDrivers = await DriverRepository.getTotalDriver(
        this.searchDriverName,
        this.searchPhoneNumber,
        this.searchStatusID,
        this.searchDriverID
      );
      this.isLoading = false;
    },
    // Set filter to visible
    clickToViewFilter() {
      if (this.isFilterVisible && !this.isTableVisible) {
        this.isFilterVisible = !this.isFilterVisible;
        setTimeout(() => {
          this.isTableVisible = !this.isTableVisible;
        }, 300);
      } else if (!this.isFilterVisible && this.isTableVisible) {
        this.isTableVisible = !this.isTableVisible;
        setTimeout(() => {
          this.isFilterVisible = !this.isFilterVisible;
        }, 300);
      }
    },
  },
};
</script>
<style>
.filter {
  max-height: 450px !important;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

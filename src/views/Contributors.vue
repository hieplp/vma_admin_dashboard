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
        <router-link to="/contributors" class="nav-link"
          >Contributors</router-link
        >
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
      <!-- Contributors table -->
      <div
        class="grid-margin stretch-card"
        v-bind:class="{
          'col-lg-12': isTableVisible,
          'col-lg-9': !isTableVisible,
        }"
      >
        <div class="card" v-if="contributorsList.length > 0">
          <div class="card-body">
            <h4 class="card-title">Contributor List</h4>
            <p class="card-description">{{ this.totalContributors }} total</p>
            <table class="table ">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PHONE NUMBER</th>
                  <th>TOTAL VEHICLES</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(contributor, index) in this.contributorsList"
                  :key="contributor.userId"
                >
                  <td class="text-secondary">{{ page * 15 + index + 1 }}</td>
                  <td>{{ contributor.userId }}</td>
                  <td>{{ contributor.fullName }}</td>
                  <td>{{ contributor.phoneNumber }}</td>
                  <td>
                    <p v-if="contributor.totalVehicles">
                      {{ contributor.totalVehicles }}
                    </p>
                    <p v-else>N/A</p>
                  </td>
                  <td>
                    <!-- <router-link
                      :to="{
                        name: 'ContributorDetail',
                        params: { userId: contributor.userId },
                      }"
                    >
                      Manage
                    </router-link> -->
                    Manage
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="this.totalContributors > 15">
            <paginate
              v-model="currentPage"
              :page-count="Math.floor(this.totalContributors / 15) + 1"
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
              <!-- Search Contributor ID -->
              <label>Contributor ID</label>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Contributor ID"
                v-model="searchContributorID"
                @keypress="isNumber($event)"
                maxlength="12"
              />
            </div>
            <div class="col-12 mt-3">
              <label>Contributor Name</label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="searchContributorName"
                placeholder="Contributor name"
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
                maxlength="11"
              />
            </div>
            <!-- Total vehicles-->
            <div class="col-12 mt-3">
              <label>Total Vehicles</label>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Total Vehicles"
                v-model="searchTotalVehicles"
                @keypress="isNumber($event)"
              />
            </div>
            <!-- Contributor status dropdown -->
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
            <div class="col-12 mt-3">
              <button
                class="btn btn-outline-info w-100"
                type="button"
                v-on:click="searchContributors()"
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

const ContributorRepository = RepositoryFactory.get("contributors");
const UserStatusRepository = RepositoryFactory.get("userStatus");

export default {
  name: "Contributors",
  props: {},
  components: {
    Loading,
  },
  data() {
    return {
      isFilterVisible: false,
      isTableVisible: true,
      contributorIDs: [],
      vehicleIDs: [],
      statusList: [],
      contributorsList: [],
      searchPhoneNumber: "",
      searchContributorID: "",
      searchContributorName: "",
      searchTotalVehicles: "",
      searchStatusID: "",
      isLoading: true,
      totalContributors: 0,
      page: 0,
      currentPage: 1,
    };
  },
  mounted() {
    this.initContributorIDs();
    this.initVehicleIDs();
    this.initStatusList();
    this.initContributorsList();
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
      this.contributorsList = await ContributorRepository.get(
        this.page,
        this.searchContributorName,
        this.searchPhoneNumber,
        this.searchStatusID,
        this.searchContributorID,
        this.searchTotalVehicles
      );
      this.isLoading = false;
    },
    // Init data for Contributor ID Dropdown
    initContributorIDs() {
      this.contributorIDs = ["D01", "D02", "D03"];
      // wait for api
    },
    // Init data for Vehicle ID Dropdown
    initVehicleIDs() {
      this.vehicleIDs = ["V01", "V02", "V03"];
      // wait for api
    },
    // Init data for Contributor Status Dropdown
    async initStatusList() {
      this.statusList = await UserStatusRepository.get();
      this.statusList.push({
        userStatusId: "",
        userStatusName: "None",
      });
    },
    // Clear search item value
    clearSearchValue() {
      this.searchContributorID = "";
      this.searchContributorName = "";
      this.searchPhoneNumber = "";
      this.searchStatusID = "";
      this.searchTotalVehicles = "";
    },
    // Search contributor
    async searchContributors() {
      this.isLoading = true;
      this.page = 0;

      this.contributorsList = await ContributorRepository.get(
        this.page,
        this.searchContributorName,
        this.searchPhoneNumber,
        this.searchStatusID,
        this.searchContributorID,
        this.searchTotalVehicles
      );

      this.totalContributors = await ContributorRepository.getTotalContributor(
        this.searchContributorName,
        this.searchPhoneNumber,
        this.searchStatusID,
        this.searchContributorID,
        this.searchTotalVehicles
      );

      this.isLoading = false;
    },
    // Init data for contributor list
    async initContributorsList() {
      this.contributorsList = await ContributorRepository.init();

      this.totalContributors = await ContributorRepository.getTotalContributor(
        this.searchContributorName,
        this.searchPhoneNumber,
        this.searchStatusID,
        this.searchContributorID,
        this.searchTotalVehicles
      );

      if (this.contributorsList.length > 0) {
        this.isLoading = false;
      }
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
  max-height: 550px !important;
}
</style>
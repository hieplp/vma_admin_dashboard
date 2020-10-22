<template>
  <div class="content-wrapper">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <!-- Reject confimation -->
    <div
      class="ui basic cus-modal justify-content-center"
      v-if="isRejectConVisible"
    >
      <div class="ui icon header col-12">
        <i class="user times icon mb-3"></i>
        Reject Confirmation
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>
          Do you want to reject registration of driver with id
          {{ this.selectedUserID }}?
        </h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <button
          type="button"
          class="ui blue primary button"
          @click="handleDialog('isRejectConVisible', '')"
        >
          <i class="x icon"></i>
          Cancel
        </button>
        <button
          type="button"
          class="ui red  button"
          @click="updateStatus('4', 'isRejectConVisible')"
        >
          <i class="trash alternate icon"></i>
          Reject
        </button>
      </div>
    </div>

    <!-- Accept confimation -->
    <div
      class="ui basic cus-modal justify-content-center"
      v-if="isAcceptConVisible"
    >
      <div class="ui icon header col-12">
        <i class="user plus icon mb-3"></i>
        Accept Confirmation
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>
          Do you want to accept registration of driver with id
          {{ this.selectedUserID }}?
        </h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <button
          type="button"
          class="ui red  button"
          @click="handleDialog('isAcceptConVisible', '')"
        >
          <i class="x icon"></i>
          Cancel
        </button>
        <button
          type="button"
          class="ui blue button"
          @click="updateStatus('2', 'isAcceptConVisible')"
        >
          <i class="checkmark icon icon"></i>
          Accept
        </button>
      </div>
    </div>

    <!-- Error message -->
    <div class="ui basic cus-modal justify-content-center" v-if="isError">
      <div class="ui icon header col-12">
        <i class="frown outline icon mb-3"></i>
        {{ this.actionName === "2" ? "Accept" : "Reject" }} fail!
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>
          {{ this.errMsg }}
        </h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <button @click="isError = !isError" class="ui blue primary button">
          <i class="checkmark icon"></i>
          Ok
        </button>
      </div>
    </div>

    <!-- Success message -->
    <div class="ui basic cus-modal justify-content-center" v-if="isSuccess">
      <div class="ui icon header col-12">
        <i class="check circle icon mb-3"></i>
        {{ this.actionName === "2" ? "Accept" : "Reject" }} successfully!
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>
          Registration of driver with id {{ this.selectedUserID }} is
          {{ this.actionName === "2" ? "accepted" : "rejected" }} successfully.
        </h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <button
          @click="
            () => {
              isSuccess = !isSuccess;
              this.searchDrivers();
            }
          "
          class="ui blue primary button"
        >
          <i class="checkmark icon"></i>
          Ok
        </button>
      </div>
    </div>

    <div class="page-header">
      <h3 class="page-title">
        <router-link to="/driver-registrations" class="nav-link"
          >Driver Registrations</router-link
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
                  <th class="text-center">ACTION</th>
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

                  <td class="row justify-content-center btn-action">
                    <button
                      class="btn btn-gradient-info btn-rounded btn-icon mr-1"
                      @click="viewDetail(driver.userId)"
                    >
                      <i class="mdi mdi-account-box-outline"></i>
                    </button>
                    <button
                      class="btn btn-gradient-success btn-rounded btn-icon mr-1"
                      @click="handleDialog('isAcceptConVisible', driver.userId)"
                    >
                      <i class="mdi mdi-check"></i>
                    </button>
                    <button
                      class="btn btn-gradient-danger btn-rounded btn-icon mr-1"
                      @click="handleDialog('isRejectConVisible', driver.userId)"
                    >
                      <i class="mdi mdi-close"></i>
                    </button>
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
const UserRepository = RepositoryFactory.get("users");

export default {
  name: "DriverRegistrations",
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
      searchStatusID: "3",
      isLoading: true,
      totalDrivers: 0,
      page: 0,
      currentPage: 1,
      isAcceptConVisible: false,
      isRejectConVisible: false,
      isError: false,
      isSuccess: false,
      errMsg: "",
      selectedUserID: "",
      actionName: 0,
    };
  },
  async mounted() {
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
      this.initDriversList();
      this.isLoading = false;
    },
    // Clear search item value
    clearSearchValue() {
      this.searchDriverID = "";
      this.searchDriverName = "";
      this.searchPhoneNumber = "";
    },
    // Search driver
    async searchDrivers() {
      this.isLoading = true;
      this.page = 0;
      this.currentPage = 1;
      await this.initDriversList();
    },
    // Init data for driver list
    async initDriversList() {
      this.driversList = await DriverRepository.get(
        this.page,
        this.searchDriverName,
        this.searchPhoneNumber,
        this.searchStatusID,
        this.searchDriverID,
        2
      );
      this.totalDrivers = await DriverRepository.getTotalDriver(
        this.searchDriverName,
        this.searchPhoneNumber,
        this.searchStatusID,
        this.searchDriverID,
        2
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
    // View driver detail
    viewDetail(userId) {
      this.$router.push({
        name: "DriverDetail",
        params: { userId: userId },
      });
    },
    // Delete driver
    async updateStatus(userStatus, dialogName) {
      this.handleDialog(dialogName, "");
      this.isLoading = true;
      await UserRepository.updateUserStatusByUserId(
        this.selectedUserID,
        userStatus
      )
        .then((res) => {
          if (res) {
            this.actionName = userStatus;
            this.isSuccess = true;
          }
        })
        .catch((err) => {
          this.isError = !this.isError;
          this.errMsg = err.message;
          console.log(err);
        });
      this.isLoading = false;
    },
    // Close delete driver confimation dialog
    handleDialog(dialogName, userId) {
      if (userId.length !== 0) {
        this.selectedUserID = userId;
      }
      this.$data[dialogName] = !this.$data[dialogName];
    },
  },
};
</script>
<style>
.filter {
  max-height: 450px !important;
}
.label {
  font-size: 13px;
}
.form-control {
  font-size: 13px;
}
.btn-action .btn i {
  font-size: 20px;
}
.cus-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(92, 90, 87, 0.637);
  z-index: 10000;
  width: 100%;
  height: 100%;
  padding-top: 12%;
  color: white;
}
.cus-modal .header {
  color: white;
  font-size: 35px !important;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<template>
  <div class="content-wrapper">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <!-- Delete confimation -->
    <Confirmation
      icon="trash alternate"
      title="Delete Confirmation"
      subTitle="Do you want to delete this feedback?"
      rightBtnTitle="Delete"
      rightBtnIcon="trash alternate"
      rightBtnColor="red"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="blue"
      v-if="isDeleteConVisible"
      :handleLeftBtn="
        () => {
          this.isDeleteConVisible = !this.isDeleteConVisible;
        }
      "
      :handleRightBtn="deleteDriver"
    />
    <!-- Error message -->
    <MessageModal
      title="Delete feedback Fail!"
      icon="frown outline "
      :subTitle="errMsg"
      :proFunc="handleErrorModal"
      v-if="isError"
    />
    <!-- Success message -->
    <MessageModal
      title="Delete feedback Successfully!"
      icon="check circle"
      :subTitle="
        `feedback with id ${this.deleteUserID} is deleted successfully.`
      "
      :proFunc="handleSuccessModal"
      v-if="isSuccess"
    />

    <div class="page-header">
      <h3 class="page-title">
        <router-link to="/feedbackList" class="nav-link">Feedback</router-link>
      </h3>
      <!-- <div class="dropdown">
        <router-link
          to="/create-maintenance"
          class="btn btn-gradient-info btn-icon-text mr-2"
        >
          <i class="mdi mdi-plus-box btn-icon-prepend"></i>
          Create
        </router-link>
        <button
          class="btn btn-gradient-info"
          type="button"
          v-on:click="clickToViewFilter()"
        >
          Filter
        </button>
      </div> -->
    </div>

    <div class="row">
      <!-- feedbackList table -->
      <div
        class="grid-margin stretch-card"
        v-bind:class="{
          'col-lg-12': isTableVisible,
          'col-lg-9': !isTableVisible,
        }"
      >
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">feedbacks List</h4>
            <table class="table " v-if="feedbackList.length > 0">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <!-- <th>ID</th> -->
                  <th>RATE</th>
                  <th>CONTRIBUTOR NAME</th>
                  <th>DRIVER NAME</th>
                  <th>VEHICLE</th>
                  <th>DATE</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(feedback, index) in this.feedbackList"
                  :key="feedback.feedbackId"
                >
                  <td class="text-secondary">{{ page * 15 + index + 1 }}</td>
                  <!-- <td>{{ feedback.maintenanceId }}</td> -->
                  <td>
                    <span v-for="index in feedback.rate" :key="index">
                      <i class="mdi mdi-star"></i>
                    </span>
                  </td>
                  <td>{{ feedback.contributor.userName }}</td>
                  <td>{{ feedback.driver.userName }}</td>
                  <td>{{ feedback.vehicleId }}</td>
                  <td>{{ feedback.createDate }}</td>
                </tr>
              </tbody>
            </table>
            <!-- Empty list -->
            <div class="card empty-list" v-else-if="!isLoading">
              <i class="mdi mdi-account-off"></i>
              <h1>NOTHING</h1>
              <h3>Your list is empty.</h3>
            </div>
          </div>
          <div v-if="this.totalFeebacks > 15">
            <paginate
              v-model="currentPage"
              :page-count="Math.floor(this.totalFeebacks / 15) + 1"
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
      </div>

      <!-- Filter -->
      <transition name="slide-fade">
        <div class="col-3 card filter" v-if="isFilterVisible">
          <div class="form-group">
            <h4 class="card-title mt-4">Filter</h4>
            <div class="col-12 mt-4">
              <label>Vehicle Id</label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="vehicleId"
                placeholder="Vehicle Id"
              />
            </div>
            <!-- Start Date-->
            <div class="col-12 mt-3">
              <label>Start Date</label>
              <input
                type="date"
                class="form-control form-control-sm"
                v-model="startDate"
                placeholder="Duration To"
              />
            </div>
            <!-- End date-->
            <div class="col-12 mt-3">
              <label>End Date</label>
              <input
                type="date"
                class="form-control form-control-sm"
                v-model="endDate"
                placeholder="Duration To"
              />
            </div>
            <!-- Total Cost-->
            <div class="col-12 mt-4">
              <label>Cost</label>
              <div class="row">
                <div class="col-12">
                  <input
                    type="text"
                    class="form-control form-control-sm test"
                    placeholder="Min Price"
                    @keypress="isNumber($event)"
                    v-model="costMin"
                  />
                </div>
                <div class="col-12 text-center">
                  <h1>-</h1>
                </div>
                <div class="col-12">
                  <input
                    type="text"
                    @keypress="isNumber($event)"
                    class="form-control form-control-sm"
                    placeholder="Max Price"
                    v-model="costMax"
                  />
                </div>
              </div>
            </div>

            <br />
            <div class="col-12 mt-4">
              <button
                class="btn btn-outline-info w-100"
                type="button"
                v-on:click="searchMaintenances()"
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
import { mapActions } from "vuex";
import { isNumber } from "../../assets/js/input.js";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import Confirmation from "../../components/Modal/Confirmation";
import MessageModal from "../../components/Modal/MessageModal";

export default {
  name: "Maintenances",
  props: {},
  components: {
    Loading,
    Confirmation,
    MessageModal,
  },
  computed: {},
  data() {
    return {
      isFilterVisible: false,
      isTableVisible: true,
      statusList: [],
      feedbackList: [],
      totalFeebacks: 0,
      // Filter
      driverId: this.$route.params.driverId,
      rateMax: 5,
      rateMin: 0,
      pageNum: "",
      viewOption: "",
      tabValue: "", // current tab
      // Count
      isLoading: true,
      // Pagination
      page: 0,
      currentPage: 1,
      // Delete
      isDeleteConVisible: false,
      // Error and success modal
      isError: false,
      isSuccess: false,
      errMsg: "",
      deleteUserID: "",
    };
  },
  async mounted() {
    // await this.initStatusList();
    if (this.$route.params.status) {
      this.searchStatusID = this.$route.params.status;
    }
    await this.initFeedbacksList();
  },
  methods: {
    // Map actions
    ...mapActions("Feedback", ["_getFeedbacks", "_getFeedbackCount"]),
    // pagination handle
    async clickCallback(pageNum) {
      this.currentPage = pageNum;
      this.page = pageNum - 1;
      this.initFeedbacksList();
    },
    // Init data for feedback Status Dropdown
    async initStatusList() {
      this.statusList = require("../../assets/json/user/driverStatus.json");
    },
    // Clear search item value
    clearSearchValue() {
      this.costMax = "";
      this.costMin = "";
      this.endDate = "";
      this.startDate = "";
      this.vehicleId = "";
    },
    // Init data for feedback list
    async initFeedbacksList() {
      this.isLoading = true;
      this.feedbackList = await this._getFeedbacks({
        driverId: this.driverId,
        pageNum: this.page,
        rateMax: this.rateMax,
        rateMin: this.rateMin,
        viewOption: this.viewOption,
      });
      this.totalFeebacks = await this._getFeedbackCount({
        driverId: this.driverId,
        rateMax: this.rateMax,
        rateMin: this.rateMin,
        viewOption: this.viewOption,
      });
      // await this._getfeedbackListCount({
      //   costMax: this.costMax,
      //   costMin: this.costMin,
      //   endDate: this.endDate,
      //   maintenanceType: this.maintenanceType,
      //   startDate: this.startDate,
      //   vehicleId: this.vehicleId,
      //   viewOption: this.viewOption,
      // });
      this.isLoading = false;
    },
    // Delete feedback
    async deleteDriver() {
      this.handleDialog("isDeleteConVisible", "");
      this.isLoading = true;
      console.log(this.deleteUserID);
      await this._delete(this.deleteUserID)
        .then((res) => {
          if (res) {
            this.isSuccess = true;
          }
        })
        .catch((err) => {
          console.log(
            "🚀 ~ file: Maintenances.vue ~ line 496 ~ deleteDriver ~ err",
            err
          );
          this.isError = !this.isError;
          this.errMsg = err.debugMessage;
        });
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
    // go to promote user lis
    viewPromoteContributor() {
      this.$router.push({
        name: "PromoteDrivers",
        params: { roleId: "2" },
      });
    },
    // View feedback detail
    viewDetail(maintenanceId) {
      this.$router.push({
        name: "MaintenanceDetail",
        params: { maintenanceId: maintenanceId },
      });
    },
    // View feedback detail
    updateDriver(maintenanceId) {
      this.$router.push({
        name: "UpdateMaintenance",
        params: { maintenanceId: maintenanceId },
      });
    },
    isNumber(evt) {
      isNumber(evt);
    },
    // Close Error Modal
    handleErrorModal() {
      this.isError = !this.isError;
    },
    // Close Error Modal
    handleSuccessModal() {
      this.isSuccess = !this.isSuccess;
      this.searchMaintenances();
    },
    // Close delete feedback confimation dialog
    handleDialog(dialogName, maintenanceId) {
      if (maintenanceId.length !== 0) {
        this.deleteUserID = maintenanceId;
      }
      this.$data[dialogName] = !this.$data[dialogName];
    },
  },
};
</script>
<style scoped>
.filter {
  max-height: 550px !important;
}
.label {
  font-size: 13px;
}
.form-control {
  font-size: 13px;
}

/* Tab */
.title {
  color: #000000 !important;
}
.mdi.mdi-star {
  color: rgb(221, 245, 4);
  font-size: 20px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

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
      subTitle="Do you want to delete this maintenace?"
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
      title="Delete maintenace Fail!"
      icon="frown outline "
      :subTitle="errMsg"
      :proFunc="handleErrorModal"
      v-if="isError"
    />
    <!-- Success message -->
    <MessageModal
      title="Delete maintenace Successfully!"
      icon="check circle"
      :subTitle="
        `maintenace with id ${this.deleteUserID} is deleted successfully.`
      "
      :proFunc="handleSuccessModal"
      v-if="isSuccess"
    />

    <div class="page-header">
      <h3 class="page-title">
        <router-link to="/maintenanceList" class="nav-link"
          >Maintenance List</router-link
        >
      </h3>
      <div class="dropdown">
        <!-- Create new maintenace -->
        <router-link
          to="/create-maintenance"
          class="btn btn-gradient-info btn-icon-text mr-2"
        >
          <i class="mdi mdi-plus-box btn-icon-prepend"></i>
          Create
        </router-link>
        <!-- Filter group -->
        <button
          class="btn btn-gradient-info"
          type="button"
          v-on:click="clickToViewFilter()"
        >
          Filter
        </button>
      </div>
    </div>

    <div class="row">
      <!-- maintenanceList table -->
      <div
        class="grid-margin stretch-card"
        v-bind:class="{
          'col-lg-12': isTableVisible,
          'col-lg-9': !isTableVisible,
        }"
      >
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Maintenances List</h4>
            <!-- Tab -->
            <vue-tabs
              class="mb-4"
              active-tab-color="#047edf"
              active-text-color="white"
              @tab-change="handleTabChange"
              v-model="tabValue"
            >
              <v-tab :title="`ALL (${this.allCount})`"> </v-tab>
              <v-tab :title="`PERIODIC MAINTENANCE (${this.periodicCount})`">
              </v-tab>
              <v-tab :title="`REPAIR (${this.repairCount})`"> </v-tab>
              <v-tab :title="`DISABLE (${this.disableCount})`"> </v-tab>
            </vue-tabs>

            <table class="table " v-if="maintenanceList.length > 0">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <!-- <th>ID</th> -->
                  <th>START DATE</th>
                  <th>END DATE</th>
                  <th>COST</th>
                  <th>VEHICLE</th>
                  <th>TYPE</th>
                  <th class="text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(maintenace, index) in this.maintenanceList"
                  :key="maintenace.maintenanceId"
                >
                  <td class="text-secondary">{{ page * 15 + index + 1 }}</td>
                  <!-- <td>{{ maintenace.maintenanceId }}</td> -->
                  <td>{{ maintenace.startDate }}</td>
                  <td>{{ maintenace.endDate }}</td>
                  <td>{{ maintenace.cost }}</td>
                  <td>
                    <p v-if="maintenace.vehicleId">
                      {{ maintenace.vehicleId }}
                    </p>
                    <p v-else>N/A</p>
                  </td>
                  <td>
                    {{ maintenace.maintenanceType }}
                  </td>
                  <td class="row justify-content-center btn-action">
                    <button
                      class="btn btn-gradient-info btn-rounded btn-icon mr-1"
                      @click="viewDetail(maintenace.maintenanceId)"
                    >
                      <i class="mdi mdi-wrench"></i>
                    </button>
                    <button
                      class="btn btn-gradient-warning btn-rounded btn-icon mr-1"
                      :disabled="viewOption === 1"
                      @click="updateDriver(maintenace.maintenanceId)"
                    >
                      <i class="mdi mdi-grease-pencil"></i>
                    </button>
                    <button
                      class="btn btn-gradient-danger btn-rounded btn-icon mr-1"
                      :disabled="viewOption === 1"
                      @click="
                        handleDialog(
                          'isDeleteConVisible',
                          maintenace.maintenanceId
                        )
                      "
                    >
                      <i class="mdi mdi-delete-forever"></i>
                    </button>
                  </td>
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
          <div v-if="this.totalMaintenance > 15">
            <paginate
              v-model="currentPage"
              :page-count="Math.floor(this.totalMaintenance / 15) + 1"
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
import { mapState, mapActions } from "vuex";
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
  computed: {
    // Map state
    ...mapState("Maintenance", ["maintenanceList", "totalMaintenance"]),
  },
  data() {
    return {
      isFilterVisible: false,
      isTableVisible: true,
      statusList: [],
      // Filter
      searchPhoneNumber: "",
      searchDriverID: "",
      searchDriverName: "",
      searchStatusID: "",

      costMax: "",
      costMin: "",
      endDate: "",
      maintenanceType: "",
      pageNum: "",
      startDate: "",
      vehicleId: "",
      viewOption: "",
      tabValue: "", // current tab
      // Count
      allCount: 0,
      periodicCount: 0,
      repairCount: 0,
      disableCount: 0,

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
    await this.initMaintenancesList();
    await this.initCountByType();
  },
  methods: {
    // Map actions
    ...mapActions("Maintenance", [
      "_getMaintenanceList",
      "_getMaintenanceListCount",
      "_getMaintenanceListCountByType",
      "_delete",
    ]),
    // handle Tab Change
    async handleTabChange(tabIndex) {
      switch (tabIndex) {
        case 0:
          this.maintenanceType = "";
          this.viewOption = 0;
          break;
        case 1:
          this.maintenanceType = "PERIODIC_MAINTENANCE";
          this.viewOption = 0;
          break;
        case 2:
          this.maintenanceType = "REPAIR";
          this.viewOption = 0;
          break;
        case 3:
          this.maintenanceType = "";
          this.viewOption = 1;
          break;
      }
      await this.initMaintenancesList();
    },
    // Change tab
    changeTab(tabIndex) {
      switch (tabIndex) {
        case 0:
          this.tabValue = `ALL (${this.allCount})`;
          break;
        case 1:
          this.tabValue = `PERIODIC MAINTENANCE (${this.periodicCount})`;
          break;
        case 2:
          this.tabValue = `REPAIR (${this.repairCount})`;
          break;
        case 3:
          this.tabValue = `DISABLE (${this.disableCount})`;
          break;
      }
    },
    // pagination handle
    async clickCallback(pageNum) {
      this.currentPage = pageNum;
      this.page = pageNum - 1;
      this.initMaintenancesList();
    },
    // Init data for maintenace Status Dropdown
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
    // Search maintenace
    async searchMaintenances() {
      this.page = 0;
      this.currentPage = 1;
      await this.initMaintenancesList();
      await this.initCountByType();
    },
    // Init data for maintenace list
    async initMaintenancesList() {
      this.isLoading = true;
      await this._getMaintenanceList({
        costMax: this.costMax,
        costMin: this.costMin,
        endDate: this.endDate,
        maintenanceType: this.maintenanceType,
        pageNum: this.page,
        startDate: this.startDate,
        vehicleId: this.vehicleId,
        viewOption: this.viewOption,
      });
      await this._getMaintenanceListCount({
        costMax: this.costMax,
        costMin: this.costMin,
        endDate: this.endDate,
        maintenanceType: this.maintenanceType,
        startDate: this.startDate,
        vehicleId: this.vehicleId,
        viewOption: this.viewOption,
      });
      this.isLoading = false;
    },
    // Init maintenace count
    async initCountByType() {
      this.isLoading = true;
      this.allCount = await this._getMaintenanceListCountByType({
        costMax: this.costMax,
        costMin: this.costMin,
        endDate: this.endDate,
        maintenanceType: "",
        startDate: this.startDate,
        vehicleId: this.vehicleId,
        viewOption: 0,
      });
      this.periodicCount = await this._getMaintenanceListCountByType({
        maintenanceType: "PERIODIC_MAINTENANCE",
        costMax: this.costMax,
        costMin: this.costMin,
        endDate: this.endDate,
        startDate: this.startDate,
        vehicleId: this.vehicleId,
        viewOption: 0,
      });
      this.repairCount = await this._getMaintenanceListCountByType({
        maintenanceType: "REPAIR",
        costMax: this.costMax,
        costMin: this.costMin,
        endDate: this.endDate,
        startDate: this.startDate,
        vehicleId: this.vehicleId,
        viewOption: 0,
      });
      this.disableCount = await this._getMaintenanceListCountByType({
        maintenanceType: "",
        costMax: this.costMax,
        costMin: this.costMin,
        endDate: this.endDate,
        startDate: this.startDate,
        vehicleId: this.vehicleId,
        viewOption: 1,
      });
      this.isLoading = false;
    },
    // Delete maintenace
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
    // View maintenace detail
    viewDetail(maintenanceId) {
      this.$router.push({
        name: "MaintenanceDetail",
        params: { maintenanceId: maintenanceId },
      });
    },
    // View maintenace detail
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
    // Close delete maintenace confimation dialog
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
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

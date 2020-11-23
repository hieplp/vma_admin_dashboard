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
        <a class="nav-link">Vehicle Requests</a>
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
      <!-- Vehicle Document Requests table -->
      <div
        class="grid-margin stretch-card"
        v-bind:class="{
          'col-lg-12': isTableVisible,
          'col-lg-9': !isTableVisible,
        }"
      >
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Requests List</h4>
            <!-- Tab -->
            <vue-tabs
              class="mb-4"
              active-tab-color="#047edf"
              active-text-color="white"
              @tab-change="handleTabChange"
              v-model="tabValue"
            >
              <v-tab :title="`ALL (${this.allCount})`"> </v-tab>
              <v-tab :title="`ACCEPT (${this.acceptCount})`"> </v-tab>
              <v-tab :title="`PENDING (${this.pendingCount})`"> </v-tab>
              <v-tab :title="`DENIED (${this.deniedCount})`"> </v-tab>
            </vue-tabs>
            <table class="table" v-if="requests.length > 0">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <th>ID</th>
                  <!-- <th>USER ID</th> -->
                  <th>CREATE DATE</th>
                  <th>TYPE</th>
                  <th>STATUS</th>
                  <th class="text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(request, index) in this.requests"
                  :key="request.requestId"
                >
                  <td class="text-secondary">{{ page * 15 + index + 1 }}</td>
                  <td>{{ request.requestId }}</td>
                  <!-- <td>{{ request.requestId }}</td> -->
                  <td>{{ formatDate(request.createDate) }}</td>
                  <td>
                    <label
                      class="badge"
                      v-bind:class="{
                        'badge-info': request.requestType === 'ADD_NEW_VEHICLE',
                        'badge-danger':
                          request.requestType === 'DELETE_VEHICLE_DOCUMENT',
                        'badge-warning':
                          request.requestType === 'CHANGE_VEHICLE',
                      }"
                      >{{ request.requestType.replaceAll("_", " ") }}</label
                    >
                  </td>
                  <td>
                    <label
                      class="badge"
                      v-bind:class="{
                        'badge-info': request.requestStatus === 'ACCEPTED',
                        'badge-danger': request.requestStatus === 'DENIED',
                        'badge-warning': request.requestStatus === 'PENDING',
                      }"
                      >{{ request.requestStatus }}</label
                    >
                  </td>

                  <td class="row justify-content-center btn-action">
                    <button
                      class="btn btn-gradient-info btn-rounded btn-icon mr-1"
                      @click="viewDetail(request.requestId)"
                    >
                      <i class="mdi mdi-clipboard-text"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Empty list -->
            <div class="card empty-list " v-else-if="!isLoading">
              <div class="mt-5">
                <i class="icon clipboard list ui text-center mt-5"></i>
              </div>
              <h1>NOTHING</h1>
              <h3>Your list is empty.</h3>
            </div>
          </div>
          <div v-if="this.totalRequests > 15">
            <paginate
              v-model="currentPage"
              :page-count="Math.floor(this.totalRequests / 15) + 1"
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
            <!-- From Date -->
            <div class="col-12 mt-3">
              <label>From Date</label>
              <input
                type="date"
                class="form-control form-control-sm"
                v-model="fromDate"
                placeholder="From Date"
              />
            </div>
            <!-- To Date -->
            <div class="col-12 mt-3">
              <label>To Date</label>
              <input
                type="date"
                class="form-control form-control-sm"
                v-model="toDate"
                :min="fromDate"
                :readonly="fromDate.length === 0"
                placeholder="From Date"
              />
            </div>

            <!-- Vehicle status dropdown -->
            <div class="col-12 mt-3">
              <label>Type</label>
              <select
                class="form-control form-control-sm"
                name="status"
                v-model="requestType"
              >
                <option
                  v-for="requestType in this.requestTypes"
                  :key="requestType"
                  :value="requestType"
                  >{{ requestType.replaceAll("_", " ") }}</option
                >
              </select>
            </div>
            <br />
            <div class="col-12 mt-3">
              <button
                class="btn btn-outline-info w-100"
                type="button"
                v-on:click="searchRequests()"
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
import moment from "moment";

export default {
  name: "VehicleDocumentRequests",
  props: {
    handleDelBtnVisible: Function,
  },
  components: {
    Loading,
  },
  data() {
    return {
      isFilterVisible: false,
      isTableVisible: true,
      statusList: [],

      requestsList: [],
      requests: [],
      // Filter
      ownerId: "",

      // Filter
      fromDate: "",
      requestType: "CHANGE_VEHICLE",
      toDate: "",
      userId: "",
      requestStatus: "",

      isLoading: true,
      totalRequests: 0,
      page: 0,
      currentPage: 1,
      isRejectConVisible: false,
      isAcceptConVisible: false,
      // Error modal
      isError: false,
      errTitle: "",
      errMsg: "",
      // Success modal
      isSuccess: false,
      successSubTitle: "",
      successTitle: "",

      requestTypes: [],

      tabValue: "", // current tab
      // Count
      allCount: 0,
      acceptCount: 0,
      pendingCount: 0,
      deniedCount: 0,
    };
  },
  async mounted() {
    if (this.$route.params.ownerId) {
      this.ownerId = this.$route.params.ownerId;
    }
    this.initTypes();
    this.initStatusList();
    await this.initRequests();
    await this.initCountByStatus();
  },
  methods: {
    // Map actions
    ...mapActions("Request", ["_getRequest", "_getRequestCount"]),
    // format date
    formatDate(date) {
      return moment(date).format("YYYY-MM-DD HH:MM:SS");
    },
    // Init count by status
    async initCountByStatus() {
      this.allCount = await this._getRequestCount({
        fromDate: this.fromDate,
        toDate: this.toDate,
        requestType: this.requestType,
        userId: this.userId,
        requestStatus: "",
      });
      this.acceptCount = await this._getRequestCount({
        fromDate: this.fromDate,
        toDate: this.toDate,
        requestType: this.requestType,
        userId: this.userId,
        requestStatus: "ACCEPTED",
      });
      this.pendingCount = await this._getRequestCount({
        fromDate: this.fromDate,
        toDate: this.toDate,
        requestType: this.requestType,
        userId: this.userId,
        requestStatus: "PENDING",
      });
      this.deniedCount = await this._getRequestCount({
        fromDate: this.fromDate,
        toDate: this.toDate,
        requestType: this.requestType,
        userId: this.userId,
        requestStatus: "DENIED",
      });
    },
    // handle Tab Change
    async handleTabChange(tabIndex) {
      switch (tabIndex) {
        case 0:
          this.requestStatus = "";
          break;
        case 1:
          this.requestStatus = "ACCEPTED";
          break;
        case 2:
          this.requestStatus = "PENDING";
          break;
        case 3:
          this.requestStatus = "DENIED";
          break;
      }
      await this.initRequests();
    },
    isNumber(evt) {
      isNumber(evt);
    },
    // pagination handle
    async clickCallback(page) {
      this.currentPage = page;
      this.page = page - 1;
      await this.initRequests();
    },
    // Init data for Vehicle Status Dropdown
    async initStatusList() {
      this.statusList = require("../../assets/json/request/vehicleDocument.json");
    },
    // Clear search item value
    clearSearchValue() {
      this.fromDate = "";
      this.requestType = "CHANGE_VEHICLE";
      this.toDate = "";
    },
    // Search request
    async searchRequests() {
      this.page = 0;
      this.currentPage = 1;
      await this.initRequests();
      await this.initCountByStatus();
    },
    // Get request list
    async initRequests() {
      this.isLoading = true;
      await this._getRequest({
        fromDate: this.fromDate,
        toDate: this.toDate,
        requestType: this.requestType,
        userId: this.userId,
        page: this.page,
        requestStatus: this.requestStatus,
      }).then((res) => {
        this.requests = res;
      });
      await this._getRequestCount({
        fromDate: this.fromDate,
        toDate: this.toDate,
        requestType: this.requestType,
        userId: this.userId,
        requestStatus: this.requestStatus,
      }).then((res) => {
        this.totalRequests = res;
      });
      this.isLoading = false;
    },
    // Init types
    initTypes() {
      this.requestTypes = [
        "CHANGE_VEHICLE",
        "VEHICLE_NEEDS_REPAIRED",
        "NEED_BACKUP_VEHICLE",
        "ADD_NEW_VEHICLE",
        "WITHDRAWAL_VEHICLE",
      ];
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
    // View request detail
    viewDetail(requestId) {
      this.$router.push({
        name: "ChangeVehicleRequest",
        params: { requestId: requestId },
      });
    },
  },
};
</script>
<style scoped>
.filter {
  max-height: 750px !important;
}
.label {
  font-size: 13px;
}
.form-control {
  font-size: 13px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

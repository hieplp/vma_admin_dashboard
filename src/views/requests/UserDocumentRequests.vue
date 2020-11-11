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
    <Confirmation
      icon="x"
      title="Deny Confirmation"
      subTitle="Do you want to deny this request?"
      rightBtnTitle="Deny"
      rightBtnIcon="trash alternate"
      rightBtnColor="red"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="blue"
      v-if="isRejectConVisible"
      :handleLeftBtn="
        () => {
          this.isRejectConVisible = !this.isRejectConVisible;
        }
      "
      :handleRightBtn="
        () => {
          this.updateRequestStatus('DENIED');
        }
      "
    />
    <!-- Accept confimation -->
    <Confirmation
      icon="clipboard check"
      title="Accept Confirmation"
      subTitle="Do you want to accept this request?"
      rightBtnTitle="Accept"
      rightBtnIcon="check"
      rightBtnColor="blue"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="red"
      v-if="isAcceptConVisible"
      :handleLeftBtn="
        () => {
          this.isAcceptConVisible = !this.isAcceptConVisible;
        }
      "
      :handleRightBtn="
        () => {
          this.updateRequestStatus('ACCEPTED');
        }
      "
    />

    <!-- Error message -->
    <MessageModal
      :title="errTitle"
      icon="frown outline "
      :subTitle="errMsg"
      :proFunc="
        () => {
          this.isError = !this.isError;
        }
      "
      v-if="isError"
    />
    <!-- Success message -->
    <MessageModal
      :title="successTitle"
      icon="check circle"
      :subTitle="successSubTitle"
      :proFunc="
        () => {
          this.isSuccess = !this.isSuccess;
          this.searchRequests();
        }
      "
      v-if="isSuccess"
    />

    <div class="page-header">
      <h3 class="page-title">
        <a class="nav-link">
          User Document Requests
        </a>
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
        <div class="card" v-if="requests.length > 0">
          <div class="card-body">
            <h4 class="card-title">Requests List</h4>
            <p class="card-description">{{ this.totalRequests }} total</p>
            <table class="table ">
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
                  <!-- <td>{{ request.userId }}</td> -->
                  <td>{{ formatDate(request.createDate) }}</td>
                  <td>
                    <label
                      class="badge"
                      v-bind:class="{
                        'badge-info': request.requestType === 'NEW_DOCUMENT',
                        'badge-danger':
                          request.requestType === 'DELETE_DOCUMENT',
                        'badge-warning':
                          request.requestType === 'UPDATE_DOCUMENT',
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
                    <!-- <router-link
                      :to="{
                        name: 'VehicleDetail',
                        params: { requestId: request.requestId },
                      }"
                      >Manage</router-link
                    > -->
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
        <!-- Empty list -->
        <div class="card empty-list " v-else-if="!isLoading">
          <div class="mt-5">
            <i class="icon clipboard list ui text-center mt-5"></i>
          </div>
          <h1>NOTHING</h1>
          <h3>Your list is empty.</h3>
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
            <!-- Vehicle status dropdown -->
            <div class="col-12 mt-3">
              <label>Status</label>
              <select
                class="form-control form-control-sm"
                name="status"
                v-model="requestStatus"
              >
                <option :value="''">
                  Select request type
                </option>
                <option
                  v-for="status in this.statusList"
                  :key="status"
                  :value="status"
                >
                  {{ status }}
                </option>
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
import { isNumber } from "../../assets/js/input.js";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { RepositoryFactory } from "../../repositories/RepositoryFactory";
import Confirmation from "../../components/Modal/Confirmation";
import MessageModal from "../../components/Modal/MessageModal";
import moment from "moment";

const RequestRepository = RepositoryFactory.get("requests");

export default {
  name: "VehicleDocumentRequests",
  props: {
    handleDelBtnVisible: Function,
  },
  components: {
    Loading,
    Confirmation,
    MessageModal,
  },
  data() {
    return {
      isFilterVisible: false,
      isTableVisible: true,
      statusList: [],

      requestsList: [],
      requests: [],

      // Filter
      fromDate: "",
      requestType: "NEW_DOCUMENT",
      toDate: "",
      requestId: "",
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

      selectedReqId: "",
      requestTypes: [],
      searchTotalDistance: ["", ""],
    };
  },
  async mounted() {
    if (this.$route.params.ownerId) {
      this.ownerId = this.$route.params.ownerId;
    }
    this.initTypes();
    this.initStatusList();
    await this.initRequests();
  },
  methods: {
    // format date
    formatDate(date) {
      return moment(date).format("YYYY-MM-DD HH:MM:SS");
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
      this.requestType = "NEW_VEHICLE_DOCUMENT";
      this.toDate = "";
      this.requestStatus = "";
    },
    // Search request
    async searchRequests() {
      this.isLoading = true;
      this.page = 0;
      this.currentPage = 1;
      await this.initRequests();
    },
    // Get request list
    async initRequests() {
      this.isLoading = true;
      await RequestRepository.getRequests(
        this.fromDate,
        this.toDate,
        this.requestType,
        this.requestId,
        this.page,
        this.requestStatus
      ).then((res) => {
        this.requests = res;
      });
      await RequestRepository.getRequestsCount(
        this.fromDate,
        this.toDate,
        this.requestType,
        this.requestId,
        this.requestStatus
      ).then((res) => {
        this.totalRequests = res;
      });
      this.isLoading = false;
    },
    // Init types
    initTypes() {
      this.requestTypes = [
        "NEW_DOCUMENT",
        "UPDATE_DOCUMENT",
        "DELETE_DOCUMENT",
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
        name: "UseDocumentRequestDetail",
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
/* .form-control {
  border-color: rgb(187, 181, 181) !important;
} */
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

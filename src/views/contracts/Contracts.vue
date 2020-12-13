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
      subTitle="Do you want to delete this contract?"
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
      :handleRightBtn="deleteContract"
    />
    <!-- Error message -->
    <MessageModal
      title="Delete contract Fail!"
      icon="frown outline "
      :subTitle="errMsg"
      :proFunc="handleErrorModal"
      v-if="isError"
    />
    <!-- Success message -->
    <MessageModal
      title="Delete contract Successfully!"
      icon="check circle"
      :subTitle="
        `contract with id ${this.deleteContractId} is deleted successfully.`
      "
      :proFunc="handleSuccessModal"
      v-if="isSuccess"
    />

    <div class="page-header">
      <h3 class="page-title">
        <router-link to="/contracts" class="nav-link">Contracts</router-link>
      </h3>
      <div class="dropdown">
        <router-link
          to="/create-contract"
          class="btn btn-gradient-info btn-icon-text mr-2"
          type="button"
        >
          <!-- <i class="mdi mdi-account-plus btn-icon-prepend"></i> -->
          Create
        </router-link>
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
      <!-- Contracts table -->
      <div
        class="grid-margin stretch-card"
        v-bind:class="{
          'col-lg-12': isTableVisible,
          'col-lg-9': !isTableVisible,
        }"
      >
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Contract List</h4>
            <!-- Tab -->
            <vue-tabs
              class="mb-4"
              active-tab-color="#047edf"
              active-text-color="white"
              @tab-change="handleTabChange"
              v-model="tabValue"
            >
              <v-tab :title="`NOT STARTED (${this.notStartedCount})`"> </v-tab>
              <v-tab :title="`IN PROGRESS (${this.inProgressCount})`"> </v-tab>
              <v-tab :title="`FINISHED (${this.finishedCount})`"> </v-tab>
              <v-tab :title="`CANCELLED (${this.cancelledCount})`"> </v-tab>
            </vue-tabs>
            <div>
              <table class="table" v-if="contracts.length > 0">
                <thead>
                  <tr class="">
                    <th>NO.</th>
                    <!-- <th>ID</th> -->
                    <!-- <th>DEPARTURE LOCATION</th>
                    <th>DEPARTURE TIME</th>
                    <th>DESTINATION LOCATION</th>
                    <th>DESTINATION TIME</th> -->
                    <th>DURATION FROM</th>
                    <th>DURATION TO</th>
                    <th>TOTAL PRICE</th>
                    <th>STATUS</th>
                    <th class="text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody style="">
                  <tr
                    v-for="(contract, index) in this.contracts"
                    :key="contract.contractId"
                  >
                    <td class="text-secondary">{{ page * 15 + index + 1 }}</td>

                    <!-- <td>{{ contract.departureLocation }}</td>
                    <td>{{ contract.departureTime }}</td>
                    <td>{{ contract.destinationLocation }}</td>
                    <td>{{ contract.destinationTime }}</td> -->
                    <!-- <td>{{ contract.contractId }}</td> -->
                    <td>{{ contract.durationFrom }}</td>
                    <td>{{ contract.durationTo }}</td>
                    <td>{{ contract.totalPrice }}</td>
                    <td>
                      <label
                        class="badge"
                        v-bind:class="{
                          'badge-info': contract.contractStatus === 'FINISHED',
                          'badge-success':
                            contract.contractStatus === 'IN_PROGRESS',
                          'badge-warning':
                            contract.contractStatus === 'NOT_STARTED',
                          'badge-danger':
                            contract.contractStatus === 'UNFINISHED',
                          'badge-dark': contract.contractStatus === 'CANCELLED',
                        }"
                        >{{ contract.contractStatus }}</label
                      >
                    </td>
                    <td class="row justify-content-center btn-action">
                      <button
                        class="btn btn-gradient-info btn-rounded btn-icon mr-1 mt-1"
                        @click="viewContract(contract.contractId)"
                      >
                        <i class="mdi mdi-file-document"></i>
                      </button>
                      <button
                        class="btn btn-gradient-warning btn-rounded btn-icon mr-1 mt-1"
                        :disabled="contract.contractStatus !== 'NOT_STARTED'"
                        @click="updateContract(contract.contractId)"
                      >
                        <i class="mdi mdi-grease-pencil"></i>
                      </button>
                      <button
                        class="btn btn-gradient-danger btn-rounded btn-icon mr-1 mt-1"
                        :disabled="contract.contractStatus !== 'NOT_STARTED'"
                        @click="
                          handleDialog(
                            'isDeleteConVisible',
                            contract.contractId
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
                <i class="mdi mdi-flag-checkered"></i>
                <h1>NOTHING</h1>
                <h3>Your list is empty.</h3>
              </div>
            </div>
          </div>
          <div v-if="this.totalContracts > 15">
            <paginate
              v-model="currentPage"
              :page-count="Math.floor(this.totalContracts / 15) + 1"
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
            <!-- Departure Location -->
            <!-- <div class="col-sm-12">
              <label>Departure Location</label>
              <textarea
                type="text"
                rows="3"
                class="form-control form-control-sm"
                placeholder="Departure Location"
                v-model="departureLocation"
              />
            </div> -->
            <!-- Destination Location -->
            <!-- <div class="col-sm-12 mt-3">
              <label>Destination Location</label>
              <textarea
                type="text"
                rows="3"
                class="form-control form-control-sm"
                placeholder="Destination Location"
                v-model="destinationLocation"
              />
            </div> -->
            <!-- Departure Time -->
            <!-- <div class="col-12 mt-3">
              <label>Departure Time</label>
              <input
                type="date"
                class="form-control form-control-sm"
                v-model="departureTime"
                placeholder="Departure Time"
              />
            </div> -->
            <!-- Destination Time -->
            <!-- <div class="col-12 mt-3">
              <label>Departure Time</label>
              <input
                type="date"
                class="form-control form-control-sm"
                v-model="destinationTime"
                placeholder="Destination Time"
              />
            </div> -->
            <!-- Duration From-->
            <div class="col-12 mt-3">
              <label>Duration From</label>
              <input
                type="date"
                class="form-control form-control-sm"
                v-model="durationFrom"
                placeholder="Duration From"
              />
            </div>
            <!-- Duration To-->
            <div class="col-12 mt-3">
              <label>Duration To</label>
              <input
                type="date"
                class="form-control form-control-sm"
                v-model="durationTo"
                placeholder="Duration To"
              />
            </div>
            <!-- Total vehicles-->
            <div class="col-12 mt-4">
              <label>Total Price</label>
              <div class="row">
                <div class="col-12">
                  <input
                    type="text"
                    class="form-control form-control-sm test"
                    placeholder="Min Price"
                    @keypress="isNumber($event)"
                    v-model="totalPriceMin"
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
                    v-model="totalPriceMax"
                  />
                </div>
              </div>
            </div>
            <!-- Contract status dropdown -->
            <!-- <div class="col-12 mt-3">
              <label>Status</label>
              <select
                class="form-control form-control-sm"
                name="status"
                v-model="contractStatus"
              >
                <option value="" selected>NONE</option>
                <option
                  v-for="status in this.statusList"
                  :key="status"
                  :value="status"
                  >{{ status }}</option
                >
              </select>
            </div> -->

            <br />
            <div class="col-12 mt-3">
              <button
                class="btn btn-outline-info w-100"
                type="button"
                v-on:click="searchContracts()"
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
  name: "Contracts",
  props: {},
  components: {
    Loading,
    Confirmation,
    MessageModal,
  },
  data() {
    return {
      isFilterVisible: false,
      isTableVisible: true,
      // Filter
      statusList: [],
      contractStatus: "NOT_STARTED",
      departureLocation: "",
      departureTime: "",
      destinationLocation: "",
      destinationTime: "",
      durationFrom: "",
      durationTo: "",
      pageNum: "",
      totalPriceMax: "",
      totalPriceMin: "",
      viewOption: 1,
      // End of filter
      isLoading: false,
      totalContracts: 0,
      page: 0,
      currentPage: 1,
      isDeleteConVisible: false,
      isError: false,
      isSuccess: false,
      errMsg: "",
      deleteContractId: "",
      contracts: [],
      // Count
      notStartedCount: 0,
      inProgressCount: 0,
      finishedCount: 0,
      cancelledCount: 0,
      tabValue: "",
    };
  },
  async mounted() {
    this.isLoading = true;
    await this.initStatusList();
    await this.initContracts();
    await this.initCountByStatus();
    this.isLoading = false;
  },
  methods: {
    // Map actions
    ...mapActions("Contract", [
      "_getContracts",
      "_getContractsCount",
      "_updateContractStatus",
    ]),
    // Init count by status
    async initCountByStatus() {
      this.notStartedCount = await this.getCountByStatus("NOT_STARTED");
      this.inProgressCount = await this.getCountByStatus("IN_PROGRESS");
      this.finishedCount = await this.getCountByStatus("FINISHED");
      this.cancelledCount = await this.getCountByStatus("CANCELLED");
    },
    // Get count by status
    async getCountByStatus(status) {
      let result = 0;
      await this._getContractsCount({
        contractStatus: status,
        departureLocation: this.departureLocation,
        departureTime: this.departureTime,
        destinationLocation: this.destinationLocation,
        destinationTime: this.destinationTime,
        durationFrom: this.durationFrom,
        durationTo: this.durationTo,
        totalPriceMax: this.totalPriceMax,
        totalPriceMin: this.totalPriceMin,
        viewOption: 1,
      }).then((res) => {
        result = res;
      });
      return result;
    },
    // Init contract
    async initContracts() {
      // this.viewOption = this.contractStatus !== "" ? 0 : 1;
      // Get contracts
      await this._getContracts({
        contractStatus: this.contractStatus,
        departureLocation: this.departureLocation,
        departureTime: this.departureTime,
        destinationLocation: this.destinationLocation,
        destinationTime: this.destinationTime,
        durationFrom: this.durationFrom,
        durationTo: this.durationTo,
        pageNum: this.page,
        totalPriceMax: this.totalPriceMax,
        totalPriceMin: this.totalPriceMin,
        viewOption: 1,
      }).then((res) => {
        this.contracts = res;
      });
      // Get contracts count
      await this._getContractsCount({
        contractStatus: this.contractStatus,
        departureLocation: this.departureLocation,
        departureTime: this.departureTime,
        destinationLocation: this.destinationLocation,
        destinationTime: this.destinationTime,
        durationFrom: this.durationFrom,
        durationTo: this.durationTo,
        totalPriceMax: this.totalPriceMax,
        totalPriceMin: this.totalPriceMin,
        viewOption: this.viewOption,
      }).then((res) => {
        this.totalContracts = res;
      });
    },
    // Init data for contract Status Dropdown
    async initStatusList() {
      this.statusList = ["NOT_STARTED", "IN_PROGRESS", "FINISHED", "CANCELLED"];
    },
    // Search vehicle
    async searchContracts() {
      this.isLoading = true;
      this.page = 0;
      this.currentPage = 1;
      await this.initContracts();
      await this.initCountByStatus();
      this.isLoading = false;
    },
    // Clear seach value
    clearSearchValue() {
      this.contractStatus = "";
      this.departureLocation = "";
      this.departureTime = "";
      this.destinationLocation = "";
      this.destinationTime = "";
      this.durationFrom = "";
      this.durationTo = "";
      this.page = "";
      this.totalPriceMax = "";
      this.totalPriceMin = "";
      this.viewOption = "";
    },
    // pagination handle
    async clickCallback(page) {
      this.isLoading = true;
      this.currentPage = page;
      this.page = page - 1;
      this.initContracts();
      this.isLoading = false;
    },
    // Update vehicle detail
    updateContract(contractId) {
      this.$router.push({
        name: "UpdateContract",
        params: { contractId: contractId },
      });
    },
    // view vehicle detail
    viewContract(contractId) {
      this.$router.push({
        name: "ContractDetail",
        params: { contractId: contractId },
      });
    },
    // Delete contract
    async deleteContract() {
      this.handleDialog("isDeleteConVisible", "");
      this.isLoading = true;
      await this._updateContractStatus({
        contractId: this.deleteContractId,
        contractStatus: "CANCELLED",
      })
        .then((res) => {
          if (res) {
            this.isSuccess = true;
          }
        })
        .catch((err) => {
          this.isError = !this.isError;
          this.errMsg = err.debugMessage;
        });
      this.isLoading = false;
    },
    // Close delete contract confimation dialog
    handleDialog(dialogName, contractId) {
      if (contractId.length !== 0) {
        this.deleteContractId = contractId;
      }
      this.$data[dialogName] = !this.$data[dialogName];
    },
    // Close Error Modal
    handleErrorModal() {
      this.isError = !this.isError;
    },
    // Close Error Modal
    handleSuccessModal() {
      this.isSuccess = !this.isSuccess;
      this.initContracts();
    },
    // handle Tab Change
    async handleTabChange(tabIndex) {
      this.isLoading = true;
      switch (tabIndex) {
        case 0:
          this.contractStatus = "NOT_STARTED";
          break;
        case 1:
          this.contractStatus = "IN_PROGRESS";
          break;
        case 2:
          this.contractStatus = "FINISHED";
          break;
        case 3:
          this.contractStatus = "CANCELLED";
          break;
      }
      console.log(this.contractStatus);
      await this.initContracts();
      this.isLoading = false;
    },
    isNumber(evt) {
      isNumber(evt);
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
<style scoped>
.filter {
  max-height: 460px !important;
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
td {
  white-space: initial !important;
}
.table-scroll {
  max-height: 550px;
  overflow: auto;
  widows: 100%;
  /* overflow-y: hidden; */
}
.table-scroll thead th {
  position: sticky;
  top: 0;
  background-color: #fff;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

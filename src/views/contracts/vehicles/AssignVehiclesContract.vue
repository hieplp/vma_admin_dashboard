<template>
  <div class="content-wrapper">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <!-- Assign confimation -->
    <Confirmation
      icon="check circle"
      title="Assign Confirmation"
      subTitle="Do you want to assign this vehicle?"
      rightBtnTitle="Assign"
      rightBtnIcon="check circle"
      rightBtnColor="blue"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="red"
      v-if="isDeleteConVisible"
      :handleLeftBtn="
        () => {
          this.isDeleteConVisible = !this.isDeleteConVisible;
        }
      "
      :handleRightBtn="updateVehicle"
    />

    <!-- Error message -->
    <MessageModal
      title="Delete Vehicle Fail!"
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
      title="Assign Vehicle Successfully!"
      icon="check circle"
      :subTitle="
        `Vehicle with id ${this.deleteVehicleId} is assigned successfully.`
      "
      :proFunc="
        () => {
          this.isSuccess = !this.isSuccess;
          this.$router.push({
            name: 'ContractDetail',
            params: {
              contractId: this.$route.params.contractId,
            },
          });
        }
      "
      v-if="isSuccess"
    />

    <div class="page-header">
      <h3 class="page-title">
        <router-link to="/contracts"> Contracts </router-link>
        <span class="text-secondary"> / </span>
        <router-link :to="`/contracts/${this.$route.params.contractId}`">
          {{ this.$route.params.contractId }}
        </router-link>
        <span class="text-secondary"> / </span>
        <span>
          Assign Vehicle
        </span>
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
      <!-- Vehicles table -->
      <div
        class="grid-margin stretch-card"
        v-bind:class="{
          'col-lg-12': isTableVisible,
          'col-lg-9': !isTableVisible,
        }"
      >
        <div class="card" v-if="vehiclesList.length > 0 && contractVehicles">
          <div class="card-body">
            <h4 class="card-title">Vehicle List</h4>
            <p class="card-description">{{ this.totalVehicles }} total</p>
            <table class="table ">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <th>ID</th>
                  <th>MODEL</th>
                  <th>SEAT</th>
                  <th>TYPE</th>
                  <!-- <th>STATUS</th> -->
                  <!-- <th>TOTAL DISTANCE</th> -->
                  <th class="text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(vehicle, index) in this.vehiclesList"
                  :key="vehicle.vehicleId"
                >
                  <td class="text-secondary">{{ page * 15 + index + 1 }}</td>
                  <td>{{ vehicle.vehicleId }}</td>
                  <td>{{ vehicle.model }}</td>
                  <td>{{ vehicle.seats }}</td>
                  <td>{{ vehicle.vehicleType.vehicleTypeName }}</td>

                  <td class="row justify-content-center btn-action">
                    <button
                      class="btn btn-gradient-info btn-rounded btn-icon mr-1"
                      @click="viewDetail(vehicle.vehicleId)"
                    >
                      <i class="mdi mdi-train"></i>
                    </button>
                    <button
                      class="btn btn-gradient-success btn-rounded btn-icon mr-1"
                      @click="
                        handleDialog('isDeleteConVisible', vehicle.vehicleId)
                      "
                    >
                      <i class="mdi mdi-check"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="this.totalVehicles > 15">
            <paginate
              v-model="currentPage"
              :page-count="Math.floor(this.totalVehicles / 15) + 1"
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
            <i class="icon bus ui text-center mt-5"></i>
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
            <!-- Start Time -->
            <div class="col-sm-12">
              <label>Start Time</label>
              <input
                type="datetime-local"
                class="form-control form-control-sm"
                placeholder="Vehicle ID"
                :min="minTime"
                v-model="startDate"
              />
            </div>
            <!-- Start Time -->
            <div class="col-sm-12 mt-3">
              <label>End Time</label>
              <input
                type="datetime-local"
                class="form-control form-control-sm"
                placeholder="Vehicle ID"
                :min="startDate"
                v-model="endDate"
              />
            </div>

            <!--Total seat-->
            <div class="col-12 mt-3">
              <label>Total Seats</label>
              <div class="row">
                <div class="col-5">
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    @keypress="isNumber($event)"
                    v-model="vehicleMinSeat"
                  />
                </div>
                <div class="col-2">
                  <h1>-</h1>
                </div>
                <div class="col-5">
                  <input
                    type="text"
                    @keypress="isNumber($event)"
                    class="form-control form-control-sm"
                    v-model="vehicleMaxSeat"
                  />
                </div>
              </div>
            </div>

            <!-- Vehicle status dropdown -->
            <div class="col-12 mt-3">
              <label>Vehicle Type</label>
              <select
                class="form-control form-control-sm"
                name="status"
                v-model="searchType"
              >
                <option :value="''">
                  Select vehicle type
                </option>
                <option
                  v-for="vehicleType in this.vehicleTypes"
                  :key="vehicleType.vehicleTypeId"
                  :value="vehicleType.vehicleTypeId"
                  >{{ vehicleType.vehicleTypeName }}</option
                >
              </select>
            </div>

            <br />
            <div class="col-12 mt-3">
              <button
                class="btn btn-outline-info w-100"
                type="button"
                v-on:click="searchVehicles()"
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
import { isNumber } from "../../../assets/js/input.js";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { RepositoryFactory } from "../../../repositories/RepositoryFactory";
import Confirmation from "../../../components/Modal/Confirmation";
import MessageModal from "../../../components/Modal/MessageModal";
const VehicleRepository = RepositoryFactory.get("vehicles");
import moment from "moment";
export default {
  name: "Vehicles",
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

      vehiclesList: [],
      // Filter
      searchPhoneNumber: "",
      searchVehicleID: "",
      searchModel: "",
      searchStatusID: "AVAILABLE",
      searchType: "",
      vehicleMaxDis: "",
      vehicleMinDis: "",
      vehicleMaxSeat: "",
      vehicleMinSeat: "",
      startDate: "",
      endDate: "",
      ownerId: "",

      isLoading: true,
      totalVehicles: 0,
      page: 0,
      currentPage: 1,
      isDeleteConVisible: false,
      isError: false,
      isSuccess: false,
      errMsg: "",
      deleteVehicleId: "",
      viewOption: 0,

      vehicleTypes: [],

      selectedVehicleList: this.$route.params.selectedVehicleList,

      contractDetailId: this.$route.params.contractDetailId,
      contractVehicles: [],

      minTime: "",
    };
  },
  async mounted() {
    this.startDate = moment(new Date()).format("YYYY-MM-DDTkk:mm");
    this.minTime = this.startDate;
    this.endDate = moment(new Date())
      .add(6, "h")
      .format("YYYY-MM-DDTkk:mm");

    await this.initVehiclesList();
    await this.initTypes();
  },
  methods: {
    // Map state
    ...mapActions("Contract", [
      "_assignVehicleForContract",
      "_getVehicleRecommendations",
      "_getVehicleRecommendationsCount",
      "_getContractVehicle",
    ]),
    isNumber(evt) {
      isNumber(evt);
    },
    // pagination handle
    async clickCallback(page) {
      this.currentPage = page;
      this.page = page - 1;
      this.initVehiclesList();
    },
    // Init data for Vehicle Status Dropdown
    async initStatusList() {
      this.statusList = require("../../../assets/json/vehicle/status.json");
    },
    // Init data for vehicle contract list
    async initContractVehiclesList() {
      this.isLoading = true;
      this.contractVehicles = await this._getContractVehicle(this.contractId);
      this.isLoading = false;
    },
    // Is vehicle selected
    isSelected(vehicleId) {
      this.contractVehicles.forEach((vehicle) => {
        if (vehicle.vehicleId == vehicleId) {
          return true;
        }
      });
      return false;
    },

    // Clear search item value
    clearSearchValue() {
      this.searchVehicleID = "";
      this.searchModel = "";
      this.searchPhoneNumber = "";
      this.searchStatusID = "";
      this.vehicleMinSeat = "";
      this.vehicleMaxSeat = "";
      this.searchType = "";
      this.vehicleMinDis = "";
      this.vehicleMaxDis = "";
    },
    // Search vehicle
    async searchVehicles() {
      this.isLoading = true;
      this.page = 0;
      this.currentPage = 1;
      await this.initVehiclesList();
    },
    // Init data for vehicle list
    async initVehiclesList() {
      console.log(this.startDate);
      this.isLoading = true;
      this.vehiclesList = await this._getVehicleRecommendations({
        startDate: moment(this.startDate).format("YYYY-MM-DD HH:mm:ss"),
        endDate: moment(this.endDate).format("YYYY-MM-DD HH:mm:ss"),
        seatsMin: this.vehicleMinSeat,
        seatsMax: this.vehicleMaxSeat,
        vehicleTypeId: this.searchType,
        viewOption: 0,
      });
      this.totalVehicles = await this._getVehicleRecommendationsCount({
        startDate: moment(this.startDate).format("YYYY-MM-DD HH:mm:ss"),
        endDate: moment(this.endDate).format("YYYY-MM-DD HH:mm:ss"),
        seatsMin: this.vehicleMinSeat,
        seatsMax: this.vehicleMaxSeat,
        vehicleTypeId: this.searchType,
        viewOption: 0,
      });
      this.selectedVehicleList.forEach((vehicle) => {
        for (let index = 0; index < this.vehiclesList.length; index++) {
          if (vehicle.vehicleId === this.vehiclesList[index].vehicleId) {
            this.$delete(this.vehiclesList, index);
            this.totalVehicles--;
          }
        }
      });
      this.isLoading = false;
    },
    // Init types
    async initTypes() {
      await VehicleRepository.getVehicleType().then((res) => {
        this.vehicleTypes = res;
      });
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
    // View vehicle detail
    viewDetail(vehicleId) {
      this.$router.push({
        name: "VehicleDetail",
        params: { vehicleId: vehicleId },
      });
    },
    // View vehicle detail
    async updateVehicle() {
      this.isLoading = true;
      this.handleDialog("isDeleteConVisible", "");
      let contract = {
        contractDetailId: this.contractDetailId,
        vehicleId: this.deleteVehicleId,
      };
      await this._assignVehicleForContract(contract)
        .then((res) => {
          if (res) {
            this.isSuccess = true;
          }
        })
        .catch((err) => {
          this.isError = !this.isError;
          this.errMsg = err.debugMessage;
          console.log(err);
        });
      this.isLoading = false;
    },
    // Delete vehicle
    async deleteVehicle() {
      this.handleDialog("isDeleteConVisible", "");
      this.isLoading = true;
      await VehicleRepository.delete(this.deleteVehicleId)
        .then((res) => {
          if (res) {
            this.isSuccess = true;
          }
        })
        .catch((err) => {
          this.isError = !this.isError;
          this.errMsg = err.debugMessage;
          console.log(err);
        });
      this.isLoading = false;
    },
    // Close delete vehicle confimation dialog
    handleDialog(dialogName, userId) {
      if (userId.length !== 0) {
        this.deleteVehicleId = userId;
      }
      this.$data[dialogName] = !this.$data[dialogName];
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

/* .form-control {
  border-color: rgb(187, 181, 181) !important;
} */

.icon.bus.ui {
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

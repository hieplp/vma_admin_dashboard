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
      icon="bus"
      title="Assign Vehicle Confirmation"
      :subTitle="
        `Do you want to assign ${this.driver.fullName} to vehicle with id: ${this.selectedVehicleId}?`
      "
      rightBtnTitle="Assign"
      rightBtnIcon="check"
      rightBtnColor="blue"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="red"
      v-if="isConVisible"
      :handleLeftBtn="
        () => {
          this.isConVisible = !this.isConVisible;
        }
      "
      :handleRightBtn="assignVehicle"
    />
    <!-- Error message -->
    <MessageModal
      title="Assign Vehicle Fail!"
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
        `Vehicle with id ${this.selectedVehicleId} is assigned successfully！`
      "
      :proFunc="
        () => {
          this.isSuccess = !this.isSuccess;
          this.$router.go(-1);
        }
      "
      v-if="isSuccess"
    />

    <div class="page-header">
      <h3 class="page-title">
        <router-link to="/vehicles" class="nav-link"
          >Assign Vehicles</router-link
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
      <!-- Vehicles table -->
      <div
        class="grid-margin stretch-card"
        v-bind:class="{
          'col-lg-12': isTableVisible,
          'col-lg-9': !isTableVisible,
        }"
      >
        <div class="card" v-if="vehiclesList.length > 0">
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
                  <th>STATUS</th>
                  <th>TOTAL DISTANCE</th>
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
                  <td>{{ vehicle.seatsModel.seats }}</td>
                  <td>{{ vehicle.vehicleType.vehicleTypeName }}</td>

                  <td>
                    <label
                      class="badge"
                      v-bind:class="{
                        'badge-info': vehicle.vehicleStatus === 'AVAILABLE',
                        'badge-danger': vehicle.vehicleStatus === 'MAINTENANCE',
                        'badge-primary': vehicle.vehicleStatus === 'ON_ROUTE',
                        'badge-success':
                          vehicle.vehicleStatus === 'AVAILABLE_NO_DRIVER',
                        'badge-warning':
                          vehicle.vehicleStatus === 'PENDING_APPROVAL',
                        'badge-dark': vehicle.vehicleStatus === 'DELETED',
                      }"
                      >{{ vehicle.vehicleStatus.replaceAll("_", " ") }}</label
                    >
                  </td>
                  <td>{{ vehicle.vehicleDistance }}</td>
                  <td class="row justify-content-center btn-action">
                    <!-- <router-link
                      :to="{
                        name: 'VehicleDetail',
                        params: { vehicleId: vehicle.vehicleId },
                      }"
                      >Manage</router-link
                    > -->
                    <button
                      class="btn btn-gradient-info btn-rounded btn-icon mr-1"
                      @click="viewDetail(vehicle.vehicleId)"
                    >
                      <i class="mdi mdi-train"></i>
                    </button>
                    <button
                      class="btn btn-gradient-success btn-rounded btn-icon mr-1"
                      @click="handleDialog('isConVisible', vehicle.vehicleId)"
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
            <!-- Search Vehicle ID -->
            <div class="col-sm-12">
              <label>Vehicle ID</label>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Vehicle ID"
                v-model="searchVehicleID"
                @keypress="isNumber($event)"
                maxlength="12"
              />
            </div>
            <!-- Model -->
            <div class="col-12 mt-3">
              <label>Model</label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="searchModel"
                placeholder="Vehicle model"
              />
            </div>

            <!-- Total vehicles-->
            <div class="col-12 mt-4">
              <label>Total Distance</label>
              <div class="row">
                <div class="col-12">
                  <input
                    type="text"
                    class="form-control form-control-sm test"
                    placeholder="Min distance"
                    @keypress="isNumber($event)"
                    v-model="vehicleMinDis"
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
                    placeholder="Max distance"
                    v-model="vehicleMaxDis"
                  />
                </div>
              </div>
            </div>

            <!--Total seat-->
            <!-- <div class="col-12 mt-3">
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
            </div> -->
            <!-- Vehicle Type dropdown -->
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
import { isNumber } from "../../../assets/js/input.js";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { RepositoryFactory } from "../../../repositories/RepositoryFactory";
import Confirmation from "../../../components/Modal/Confirmation";
import MessageModal from "../../../components/Modal/MessageModal";

const VehicleRepository = RepositoryFactory.get("vehicles");
const VehicleAssignmentRepository = RepositoryFactory.get("assignVehicle");

export default {
  name: "AssignedVehicles",
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
      statusList: [],

      vehiclesList: [],
      // Filter
      searchVehicleID: "",
      searchModel: "",
      searchStatusID: "AVAILABLE_NO_DRIVER",
      vehicleMaxSeat: "",
      vehicleMinSeat: "",
      searchType: "",
      vehicleMaxDis: "",
      vehicleMinDis: "",

      isLoading: true,
      totalVehicles: 0,
      page: 0,
      currentPage: 1,
      isConVisible: false,
      isError: false,
      isSuccess: false,
      errMsg: "",
      selectedVehicleId: "",
      // Seat
      totalSeats: [],

      viewOption: 1,

      vehicleTypes: [],
      searchTotalDistance: ["", ""],

      driver: {
        userId: "",
        fullName: "",
      },
      licenseClass: "",
    };
  },
  async mounted() {
    await this.intiDriver();
    await this.initVehiclesList();
    await this.initTypes();
    this.totalSeats = require("../../../assets/json/vehicle/totalSeat.json");
    let drivingLicenseClasses = require("../../../assets/json/indentify/type.json");
    this.licenseClass = drivingLicenseClasses[this.$route.params.licenseClass];
  },
  methods: {
    isNumber(evt) {
      isNumber(evt);
    },
    // pagination handle
    async clickCallback(page) {
      this.currentPage = page;
      this.page = page - 1;
      this.initVehiclesList();
    },
    // Init data for driver
    async intiDriver() {
      if (this.$route.params.driver) {
        localStorage.setItem(
          "assignDriver",
          JSON.stringify(this.$route.params.driver)
        );
      }

      if (localStorage.getItem("assignDriver")) {
        this.driver = JSON.parse(localStorage.getItem("assignDriver"));
      }
      if (this.$route.params.licenseClass) {
        let drivingLicenseClasses = require("../../../assets/json/indentify/type.json");
        let licenseClass =
          drivingLicenseClasses[this.$route.params.licenseClass];
        localStorage.setItem("licenseClass", JSON.stringify(licenseClass));
      }
      if (localStorage.getItem("licenseClass")) {
        this.licenseClass = JSON.parse(localStorage.getItem("licenseClass"));
      }
    },
    // Clear search item value
    clearSearchValue() {
      this.searchVehicleID = "";
      this.searchModel = "";
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
      this.isLoading = true;
      if (
        this.vehicleMinDis.length > 0 &&
        this.vehicleMaxDis.length > 0 &&
        this.vehicleMinDis > this.vehicleMaxDis
      ) {
        let temp = this.vehicleMinDis;
        this.vehicleMinDis = this.vehicleMaxDis;
        this.vehicleMaxDis = temp;
      }

      if (
        this.vehicleMaxSeat.length > 0 &&
        this.vehicleMinSeat.length > 0 &&
        this.vehicleMinSeat > this.vehicleMaxSeat
      ) {
        let temp = this.vehicleMinSeat;
        this.vehicleMinSeat = this.vehicleMaxSeat;
        this.vehicleMaxSeat = temp;
      }

      this.viewOption = this.searchStatusID !== "" ? 1 : 0;

      this.vehiclesList = await VehicleRepository.get(
        this.page,
        this.searchModel,
        this.searchVehicleID,
        this.vehicleMinDis,
        this.vehicleMaxDis,
        this.searchStatusID,
        this.searchType,
        this.vehicleMinSeat,
        this.licenseClass.seat,
        this.viewOption,
        ""
      );
      this.totalVehicles = await VehicleRepository.getTotalVehicle(
        this.searchModel,
        this.searchVehicleID,
        this.vehicleMinDis,
        this.vehicleMaxDis,
        this.searchStatusID,
        this.searchType,
        this.vehicleMinSeat,
        this.licenseClass.seat,
        this.viewOption,
        ""
      );
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
    // Assign vehicle
    async assignVehicle() {
      this.handleDialog("isConVisible", "");
      this.isLoading = true;
      await VehicleAssignmentRepository.assignVehicle(
        this.selectedVehicleId,
        this.driver.userId
      )
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
    // Close delete vehicle confimation dialog
    handleDialog(dialogName, vehicleId) {
      if (vehicleId.length !== 0) {
        this.selectedVehicleId = vehicleId;
      }
      this.$data[dialogName] = !this.$data[dialogName];
    },
  },
};
</script>
<style scoped>
.filter {
  max-height: 650px !important;
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
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

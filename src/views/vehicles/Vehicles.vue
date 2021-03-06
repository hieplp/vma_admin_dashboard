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
      subTitle="Do you want to delete this vehicle?"
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
      :handleRightBtn="deleteVehicle"
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
      title="Delete Driver Successfully!"
      icon="check circle"
      :subTitle="
        `Vehicle with id ${this.deleteVehicleId} is deleted successfully.`
      "
      :proFunc="
        () => {
          this.isSuccess = !this.isSuccess;
          this.searchVehicles();
        }
      "
      v-if="isSuccess"
    />

    <div class="page-header">
      <h3 class="page-title">
        <router-link to="/vehicles" class="nav-link">Vehicles</router-link>
      </h3>
      <div class="dropdown">
        <router-link
          to="/create-vehicle"
          class="btn btn-gradient-info btn-icon-text mr-2"
          type="button"
        >
          <i class="mdi mdi-plus-box btn-icon-prepend"></i>
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
                  <td>{{ vehicle.seatsModel.seats }}</td>
                  <td>{{ vehicle.vehicleType.vehicleTypeName }}</td>

                  <td>
                    <label
                      class="badge"
                      v-bind:class="{
                        'badge-info': vehicle.vehicleStatus === 'AVAILABLE',
                        'badge-danger':
                          vehicle.vehicleStatus === 'MAINTENANCE' ||
                          vehicle.vehicleStatus === 'REPAIRING' ||
                          vehicle.vehicleStatus === 'NEED_REPAIR',
                        'badge-primary': vehicle.vehicleStatus === 'ON_ROUTE',
                        'badge-success':
                          vehicle.vehicleStatus === 'AVAILABLE_NO_DRIVER',
                        'badge-warning':
                          vehicle.vehicleStatus === 'PENDING_APPROVAL',
                        'badge-dark':
                          vehicle.vehicleStatus === 'DELETED' ||
                          vehicle.vehicleStatus === 'REJECTED',
                      }"
                      >{{ vehicle.vehicleStatus.replaceAll("_", " ") }}</label
                    >
                  </td>
                  <!-- <td>{{ vehicle.vehicleDistance }}</td> -->
                  <td class="row justify-content-center btn-action">
                    <button
                      class="btn btn-gradient-info btn-rounded btn-icon mr-1"
                      @click="viewDetail(vehicle.vehicleId)"
                    >
                      <i class="mdi mdi-train"></i>
                    </button>
                    <button
                      class="btn btn-gradient-warning btn-rounded btn-icon mr-1"
                      @click="updateVehicle(vehicle.vehicleId)"
                      :disabled="
                        vehicle.vehicleStatus === 'PENDING_APPROVAL' ||
                          vehicle.vehicleStatus === 'DELETED' ||
                          vehicle.vehicleStatus === 'REJECTED'
                      "
                    >
                      <i class="mdi mdi-grease-pencil"></i>
                    </button>
                    <button
                      class="btn btn-gradient-danger btn-rounded btn-icon mr-1"
                      :disabled="
                        vehicle.vehicleStatus === 'PENDING_APPROVAL' ||
                          vehicle.vehicleStatus === 'DELETED' ||
                          vehicle.vehicleStatus === 'REJECTED'
                      "
                      @click="
                        handleDialog('isDeleteConVisible', vehicle.vehicleId)
                      "
                    >
                      <i class="mdi mdi-delete-forever"></i>
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
              <label>Status</label>

              <select
                class="form-control form-control-sm"
                name="status"
                v-model="searchStatusID"
              >
                <option :value="''">
                  Select vehicle status
                </option>
                <option
                  v-for="status in this.statusList"
                  :key="status"
                  :value="status"
                  >{{ status.replaceAll("_", " ") }}</option
                >
              </select>
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
import { isNumber } from "../../assets/js/input.js";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { RepositoryFactory } from "../../repositories/RepositoryFactory";
import Confirmation from "../../components/Modal/Confirmation";
import MessageModal from "../../components/Modal/MessageModal";
const VehicleRepository = RepositoryFactory.get("vehicles");

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
      searchStatusID: "",
      searchType: "0",
      vehicleMaxDis: "0",
      vehicleMinDis: "0",
      vehicleMaxSeat: "0",
      vehicleMinSeat: "0",
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
      // Seat
      totalSeats: [],

      viewOption: 0,

      vehicleTypes: [],
      searchTotalDistance: ["", ""],
    };
  },
  async mounted() {
    if (this.$route.params.ownerId) {
      this.ownerId = this.$route.params.ownerId;
    }
    if (this.$route.params.status) {
      this.viewOption = 1;
      this.searchStatusID = this.$route.params.status;
    }
    await this.initStatusList();
    await this.initVehiclesList();
    await this.initTypes();
    this.totalSeats = require("../../assets/json/vehicle/totalSeat.json");
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
    // Init data for Vehicle Status Dropdown
    async initStatusList() {
      this.statusList = require("../../assets/json/vehicle/status.json");
    },
    // Clear search item value
    clearSearchValue() {
      this.searchVehicleID = "";
      this.searchModel = "";
      this.searchPhoneNumber = "";
      this.searchStatusID = "";
      this.vehicleMinSeat = "0";
      this.vehicleMaxSeat = "0";
      this.searchType = "";
      this.vehicleMinDis = "0";
      this.vehicleMaxDis = "0";
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
        this.vehicleMaxSeat,
        this.viewOption,
        this.ownerId
      );
      this.totalVehicles = await VehicleRepository.getTotalVehicle(
        this.searchModel,
        this.searchVehicleID,
        this.vehicleMinDis,
        this.vehicleMaxDis,
        this.searchStatusID,
        this.searchType,
        this.vehicleMinSeat,
        this.vehicleMaxSeat,
        this.viewOption,
        this.ownerId
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
    // View vehicle detail
    updateVehicle(vehicleId) {
      this.$router.push({
        name: "UpdateVehicle",
        params: { vehicleId: vehicleId },
      });
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

<template>
  <div>
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
      <h3 class="page-title"></h3>
      <div class="dropdown">
        <button
          @click="
            () => {
              let endDate = '';
              if (this.contract.roundTrip) {
                endDate = this.contract.trips[1]['destinationTime'];
              } else {
                endDate = this.contract.trips[0]['destinationTime'];
              }
              this.$router.push({
                name: 'AssignVehiclesContract',
                params: {
                  contractId: this.contractId,
                  startDate: this.contract.trips[0]['departureTime'],
                  endDate: endDate,
                },
              });
            }
          "
          class="btn btn-gradient-info btn-icon-text mr-2"
          type="button"
        >
          <i class="mdi mdi-plus-box btn-icon-prepend"></i>
          Assign
        </button>
      </div>
    </div>
    <div class="row">
      <!-- Vehicles table -->
      <div
        class="col-12 grid-margin stretch-card"
        v-bind:class="{
          'col-lg-12': isTableVisible,
          'col-lg-9': !isTableVisible,
        }"
      >
        <div class="card" v-if="vehiclesList.length > 0">
          <div class="card-body">
            <h4 class="card-title">Vehicle List</h4>
            <!-- <p class="card-description">{{ this.totalVehicles }} total</p> -->
            <table class="table ">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <th>ID</th>
                  <!-- <th>MODEL</th> -->
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
                  <!-- <td>{{ vehicle.model }}</td> -->
                  <td>{{ vehicle.seats }}</td>
                  <td>{{ vehicle.vehicleType.vehicleTypeName }}</td>

                  <!-- <td>
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
                        'badge-dark':
                          vehicle.vehicleStatus === 'DELETED' ||
                          vehicle.vehicleStatus === 'REJECTED',
                      }"
                      >{{ vehicle.vehicleStatus.replaceAll("_", " ") }}</label
                    >
                  </td> -->
                  <td class="row justify-content-center btn-action">
                    <!-- <router-link
                      :to="{
                        name: 'VehicleDetail',
                        params: { userId: vehicle.userId },
                      }"
                      >Manage</router-link
                    > -->
                    <button
                      class="btn btn-gradient-success btn-rounded btn-icon mr-1"
                      @click="viewPassenger(vehicle.contractVehicleId)"
                    >
                      <i class="mdi mdi-account-multiple-outline"></i>
                    </button>
                    <button
                      class="btn btn-gradient-info btn-rounded btn-icon mr-1"
                      @click="viewDetail(vehicle.vehicleId)"
                    >
                      <i class="mdi mdi-train"></i>
                    </button>

                    <!-- <button
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
                    </button> -->
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
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
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
    contractId: Number,
    contract: Object,
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
      searchType: "",
      vehicleMaxDis: "",
      vehicleMinDis: "",
      vehicleMaxSeat: "",
      vehicleMinSeat: "",
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
    // Map state
    ...mapActions("Contract", ["_getContractVehicle"]),
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
      this.isLoading = true;
      this.vehiclesList = await this._getContractVehicle(this.contractId);
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
    viewPassenger(contractVehicleId) {
      this.$router.push({
        name: "PassengerList",
        params: { contractVehicleId: contractVehicleId },
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

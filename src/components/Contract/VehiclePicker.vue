<template>
  <div class="col-12 grid-margin stretch-card">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <RecVehiclesModal
      ref="vehicleModal"
      v-if="isVehicleModalVisible"
      :cancelFunction="handleVehicleModal"
      :doneFunction="getVehicle"
    />

    <!-- Vehicles table -->
    <div class="card">
      <div class="card">
        <div class="card-body">
          <h4 class="ui dividing header">VEHICLES</h4>
          <!-- <p class="card-description">{{ this.totalVehicles }} total</p> -->
          <table class="table" v-if="vehiclesList.length > 0">
            <thead>
              <tr class="">
                <th>NO.</th>
                <th>ID</th>
                <th>SEAT</th>
                <th>TYPE</th>
                <th class="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(vehicle, index) in this.vehiclesList"
                :key="vehicle.vehicleId"
              >
                <td class="text-secondary">
                  {{ page * 15 + index + 1 }}
                </td>
                <td>{{ vehicle.vehicleId }}</td>
                <td>{{ vehicle.seats }}</td>
                <td>{{ vehicle.vehicleType.vehicleTypeName }}</td>
                <td class="row justify-content-center btn-action">
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
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Empty list -->
          <!-- <div class="card empty-list ">
                <div class="mt-5">
                  <i class="icon bus ui text-center mt-5"></i>
                </div>
                <h1>NOTHING</h1>
                <h3>Your list is empty.</h3>
              </div> -->
          <!-- Add vehicle button -->
          <div
            class="row address mt-5 justify-content-center add-location"
            @click="handleVehicleModal"
          >
            <i class="icon plus circle"></i>
            <span>
              Add a vehicle
            </span>
          </div>
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
import RecVehiclesModal from "../../components/Modal/RecVehiclesModal";
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
    RecVehiclesModal,
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

      isLoading: false,
      isVehicleModalVisible: false,
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

      //
      startDate: "",
      endDate: "",
    };
  },
  async mounted() {
    // if (this.$route.params.ownerId) {
    //   this.ownerId = this.$route.params.ownerId;
    // }
    // if (this.$route.params.status) {
    //   this.viewOption = 1;
    //   this.searchStatusID = this.$route.params.status;
    // }
    // await this.initStatusList();
    // await this.initVehiclesList();
    // await this.initTypes();
    // this.totalSeats = require("../../assets/json/vehicle/totalSeat.json");
  },
  methods: {
    // Map state
    ...mapActions("Contract", ["_getContractVehicle"]),
    isNumber(evt) {
      isNumber(evt);
    },
    // Handle vehicle modal
    handleVehicleModal() {
      this.isVehicleModalVisible = !this.isVehicleModalVisible;
      // this.$refs.vehicleModal.startDate = this.
    },
    // Get vehicle
    getVehicle() {
      this.handleVehicleModal();
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
.add-location:hover {
  cursor: pointer;
  color: rgb(29, 73, 216);
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

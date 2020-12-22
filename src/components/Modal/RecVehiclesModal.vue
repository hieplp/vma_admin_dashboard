<template>
  <div class="con-modal">
    <div class="ui form">
      <div class="three fields mt-4">
        <!-- Total Seats (Min) -->
        <div class="field">
          <label>Total Seats (Min)</label>
          <div class="ui corner labeled input">
            <input
              v-model="searchVehicleId"
              type="number"
              max="10"
              placeholder="Total Seats (Min)"
              @blur="initVehiclesList"
            />
          </div>
        </div>
        <!-- Total Seats (Max) -->
        <div class="field">
          <label>Total Seats (Max)</label>
          <div class="ui corner labeled input">
            <input
              v-model="maxSeat"
              type="number"
              max="10"
              placeholder="Total Seats (Max)"
              @blur="initVehiclesList"
            />
          </div>
        </div>

        <!--Type -->
        <div class="field">
          <label>Type</label>
          <div class="ui corner labeled input">
            <select
              class="form-control form-control-sm"
              name="status"
              v-model="vehicleType"
              @change="initVehiclesList"
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
        </div>
        <!-- Status -->
        <div class="field">
          <label>Status</label>
          <div class="ui corner labeled input">
            <select
              class="form-control form-control-sm"
              name="status"
              v-model="viewOption"
              @change="initVehiclesList"
            >
              <option :value="0">
                Get avaible vehicles based on value
              </option>
              <option :value="1">
                Get all available vehicles
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <table class="table tableBodyScroll" v-if="!isLoading">
      <thead>
        <tr class="">
          <th>NO.</th>
          <th>ID</th>
          <th>MODEL</th>
          <th>SEAT</th>
          <th>TYPE</th>
          <th>EXPECTED VALUE</th>
          <th>EARNED VALUE</th>
          <!-- <th>STATUS</th> -->
          <th class="text-center">ACTION</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(vehicle, index) in this.vehicles" :key="vehicle.vehicleId">
          <td class="text-secondary">{{ page * 15 + index + 1 }}</td>
          <td>{{ vehicle.vehicleId }}</td>
          <td>{{ vehicle.model }}</td>
          <td>{{ vehicle.seats }}</td>
          <td>{{ vehicle.vehicleType.vehicleTypeName }}</td>
          <td>{{ vehicle.expectedValue }}</td>
          <td>{{ vehicle.currentEarnedValue }}</td>

          <td class="row justify-content-center btn-action">
            <button
              class="btn btn-outline-info btn-rounded btn-icon mr-1"
              :class="
                selectedVehicle.vehicleId !== vehicle.vehicleId
                  ? 'btn-outline-info'
                  : 'btn-gradient-info'
              "
              @click="select(vehicle)"
            >
              <i class="mdi mdi-account-check"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4" v-if="this.totalVehicles > 15">
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
    <div class="row justify-content-center btn-group ml-3">
      <div class="col-4">
        <button
          class="btn btn-gradient-danger btn-fw"
          type="button"
          @click="cancelFunction()"
        >
          Cancel
        </button>
        <button
          class="btn btn-gradient-info btn-fw ml-2"
          type="button"
          v-on:click="doneFunction()"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { isNumber } from "../../assets/js/input.js";
export default {
  props: {
    cancelFunction: Function,
    doneFunction: Function,
    vehicleId: String,
    propStatus: String,
    selectedVehicleList: Array,
    startDate: String,
    endDate: String,
    propMaxSeat: String,
  },
  data() {
    return {
      statusList: [],
      searchVehicleId: "",
      vehicleType: "",
      searchStatusID: "",
      isLoading: true,
      page: 0,
      currentPage: 1,
      vehicleTypes: [],
      selectedVehicle: "",
      // startDate: "",
      // endDate: "",
      vehicles: [],
      totalVehicles: 0,
      maxSeat: 0,
      viewOption: 0,
    };
  },
  computed: {
    // Map state
    // ...mapState("Vehicle", ["vehicles", "totalVehicles"]),
  },
  async mounted() {
    if (this.propStatus) {
      this.searchStatusID = this.propStatus;
    }
    this.maxSeat = this.propMaxSeat <= 0 ? "" : this.propMaxSeat;
    await this.initVehiclesList();
    this.initTypes();
    // this.initStatusList();
    if (this.vehicleId) {
      this.selectedVehicle = this.vehicleId;
      this.searchVehicleId = this.vehicleId;
    }
  },
  methods: {
    // Map actions
    ...mapActions("Vehicle", [
      "_getVehiclesWithIdAndType",
      "_getVehicleType",
      "_getVehiclesWithIdAndTypeCount",
    ]),
    ...mapActions("Contract", [
      "_getVehicleRecommendations",
      "_getVehicleRecommendationsCount",
    ]),
    // pagination handle
    async clickCallback(pageNum) {
      this.isLoading = true;
      this.currentPage = pageNum;
      this.page = pageNum - 1;
      this.initVehiclesList();
      this.isLoading = false;
    },
    // Init data for vehicle list
    async initVehiclesList() {
      this.isLoading = true;
      this.vehicles = await this._getVehicleRecommendations({
        startDate: this.startDate,
        endDate: this.endDate,
        seatsMin: "",
        seatsMax: this.maxSeat,
        vehicleTypeId: this.vehicleType,
        viewOption: this.viewOption,
      });
      this.totalVehicles = await this._getVehicleRecommendationsCount({
        startDate: this.startDate,
        endDate: this.endDate,
        seatsMin: "",
        seatsMax: this.maxSeat,
        vehicleTypeId: this.vehicleType,
        viewOption: this.viewOption,
      });

      this.selectedVehicleList.forEach((vehicle) => {
        for (let index = 0; index < this.vehicles.length; index++) {
          if (vehicle.vehicleId === this.vehicles[index].vehicleId) {
            this.$delete(this.vehicles, index);
            this.totalVehicles--;
          }
        }
      });
      this.isLoading = false;
    },
    // Init types
    async initTypes() {
      await this._getVehicleType().then((res) => {
        this.vehicleTypes = res;
      });
    },
    // Init data for Vehicle Status Dropdown
    async initStatusList() {
      this.statusList = require("../../assets/json/vehicle/status.json");
    },
    // Select vehicle
    select(vehicle) {
      if (this.selectedVehicle.vehicleId === vehicle.vehicleId) {
        this.selectedVehicle = { vehicleId: "" };
      } else {
        this.selectedVehicle = vehicle;
      }
    },
    // Return select vehicle
    getSelectedVehicle() {
      return this.selectedVehicle;
    },
    isNumber(evt) {
      isNumber(evt);
    },
  },
};
</script>

<style scoped>
.con-modal {
  position: fixed;
  padding-top: 0% !important;
  padding-left: 1%;
  padding-right: 1%;
  border-radius: 1%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(255, 255, 255);
  z-index: 10000;
  width: 85%;
  height: 90%;
  max-height: 700px;
  padding-top: 12%;
  box-shadow: 2px 2px 15px 7px rgba(0, 0, 0, 0.34);
  color: black;
}
.con-modal .header {
  color: white;
  font-size: 35px !important;
}
.table {
  overflow: hidden !important;
  border-bottom: 1px solid rgb(206, 194, 194);
}
table.tableBodyScroll tbody {
  display: block;
  height: 420px;
  overflow-y: scroll;
}

table.tableBodyScroll thead,
table.tableBodyScroll tbody tr {
  display: table;
  width: 98%;
  table-layout: fixed;
}
.btn-group {
  position: absolute;
  bottom: 2%;
  width: 100%;
}

@import "../../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>

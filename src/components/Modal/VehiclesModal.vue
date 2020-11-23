<template>
  <div class="con-modal">
    <div class="ui form">
      <div class="three fields mt-4">
        <!--Vehicle Id -->
        <div class="field">
          <label>Vehicle Id</label>
          <div class="ui corner labeled input">
            <input
              v-model="searchVehicleId"
              type="text"
              placeholder="Vehicle Id"
              @blur="initVehicles"
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
              @change="initVehicles"
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
              v-model="searchStatusID"
              @change="initVehicles"
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
        </div>
      </div>
    </div>

    <table class="table tableBodyScroll">
      <thead>
        <tr class="">
          <th>NO.</th>
          <th>ID</th>
          <th>MODEL</th>
          <th>TYPE</th>
          <th>STATUS</th>
          <th class="text-center">ACTION</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(vehicle, index) in this.vehicles" :key="vehicle.vehicleId">
          <td class="text-secondary">{{ page * 15 + index + 1 }}</td>
          <td>{{ vehicle.vehicleId }}</td>
          <td>{{ vehicle.model }}</td>
          <td>{{ vehicle.vehicleTypeName }}</td>
          <td>
            <label
              class="badge"
              v-bind:class="{
                'badge-info': vehicle.vehicleStatus === 'AVAILABLE',
                'badge-danger': vehicle.vehicleStatus === 'MAINTENANCE',
                'badge-primary': vehicle.vehicleStatus === 'ON_ROUTE',
                'badge-success':
                  vehicle.vehicleStatus === 'AVAILABLE_NO_DRIVER',
                'badge-warning': vehicle.vehicleStatus === 'PENDING_APPROVAL',
                'badge-dark':
                  vehicle.vehicleStatus === 'DELETED' ||
                  vehicle.vehicleStatus === 'REJECTED',
              }"
              >{{ vehicle.vehicleStatus.replaceAll("_", " ") }}</label
            >
          </td>
          <td class="row justify-content-center btn-action">
            <button
              class="btn btn-outline-info btn-rounded btn-icon mr-1"
              :class="
                selectedVehicle !== vehicle.vehicleId
                  ? 'btn-outline-info'
                  : 'btn-gradient-info'
              "
              @click="select(vehicle.vehicleId)"
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
import { mapState, mapActions } from "vuex";
import { isNumber } from "../../assets/js/input.js";
export default {
  props: {
    cancelFunction: Function,
    doneFunction: Function,
    vehicleId: String,
  },
  data() {
    return {
      statusList: [],
      searchVehicleId: "",
      vehicleType: "",
      searchStatusID: "",
      isLoading: false,
      page: 0,
      currentPage: 1,
      vehicleTypes: [],
      selectedVehicle: "",
    };
  },
  computed: {
    // Map state
    ...mapState("Vehicle", ["vehicles", "totalVehicles"]),
  },
  async mounted() {
    await this.initVehicles();
    this.initTypes();
    this.initStatusList();
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
    // pagination handle
    async clickCallback(pageNum) {
      this.isLoading = true;
      this.currentPage = pageNum;
      this.page = pageNum - 1;
      this.initVehicles();
      this.isLoading = false;
    },
    async initVehicles() {
      await this._getVehiclesWithIdAndType({
        pageNum: this.page,
        vehicleId: this.searchVehicleId,
        viewOption: this.searchStatusID !== "" ? 1 : 0,
        vehicleStatus: this.searchStatusID,
        vehicleType: this.vehicleType,
      });
      await this._getVehiclesWithIdAndTypeCount({
        vehicleId: this.searchVehicleId,
        viewOption: this.searchStatusID !== "" ? 1 : 0,
        vehicleStatus: this.searchStatusID,
        vehicleType: this.vehicleType,
      });
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
    select(vehicleId) {
      if (this.selectedVehicle === vehicleId) {
        this.selectedVehicle = "";
      } else {
        this.selectedVehicle = vehicleId;
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

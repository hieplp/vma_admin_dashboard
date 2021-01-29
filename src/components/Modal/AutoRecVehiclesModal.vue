<template>
  <div class="con-modal">
    <div class="ui form">
      <div class="three fields mt-4">
        <div class="field">
          <label>Vehicle Count</label>
          <div class="ui corner labeled input">
            <input v-model="vehicleCount" readonly />
          </div>
        </div>

        <div class="field">
          <label>Passenger Count</label>
          <div class="ui corner labeled input">
            <input v-model="passengerCount" readonly />
          </div>
        </div>

        <!-- Status -->
        <div class="field">
          <label>Ignore Sleeper Bus</label>
          <div class="ui corner labeled input">
            <select
              class="form-control form-control-sm"
              name="status"
              v-model="ignoreSleeperBus"
              @change="initVehiclesList"
            >
              <option :value="true">
                True
              </option>
              <option :value="false">
                False
              </option>
            </select>
          </div>
        </div>
        <!-- Status -->
        <div class="field">
          <label>Combinations</label>
          <div class="ui corner labeled input">
            <select
              class="form-control form-control-sm"
              name="status"
              v-model="selectCombination"
              @change="handleCombinationsChange"
            >
              <option
                v-for="(combination, index) in combinations"
                :key="index"
                :value="combination"
              >
                {{ combination }}
              </option>
            </select>
          </div>
        </div>
        <!-- Status -->
        <div class="field">
          <label>Display All</label>
          <div class="ui corner labeled input">
            <select
              class="form-control form-control-sm"
              name="status"
              v-model="displayAll"
              @change="initVehiclesList"
            >
              <option :value="0">False</option>
              <option :value="1">True</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <vue-tabs
      class="mb-4"
      active-tab-color="#047edf"
      active-text-color="white"
      v-model="tabValue"
      @tab-change="handleTabChange"
    >
      <v-tab
        v-for="(combination, index) in selectCombination"
        :key="index"
        :title="'#' + Number(index + 1) + ' - ' + combination + ' seat(s)'"
      >
      </v-tab>
    </vue-tabs>
    <div v-if="isVehicleErr">
      Please select {{ this.vehicleCount }} vehicle(s).
    </div>
    <table
      class="table tableBodyScroll"
      v-if="!isLoading && selectCombination && isVehicleLoading"
    >
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
              @click="select(vehicle)"
              :class="
                selectedVehicles[tabIndex] &&
                selectedVehicles[tabIndex].vehicleId === vehicle.vehicleId
                  ? 'btn-gradient-info'
                  : 'btn-outline-info'
              "
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
    propStatus: String,
    selectedVehicleList: Array,
    startDate: String,
    endDate: String,
    vehicleCount: String,
    passengerCount: String,
    config: Object,
  },
  data() {
    return {
      statusList: [],
      searchVehicleId: "",
      vehicleType: "",
      searchStatusID: "",
      isLoading: true,
      page: 0,
      currentPage: 0,
      vehicleTypes: [],
      selectedVehicles: [],
      tabValue: "", // current tab
      vehicles: [],
      totalVehicles: 0,
      maxSeat: 0,
      viewOption: 0,
      combinations: [],
      selectCombination: null,
      ignoreSleeperBus: true,
      tabIndex: 0,
      seat: 0,
      displayAll: 0,
      isVehicleLoading: false,
      isVehicleErr: false,
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
    // this.initStatusList();
    if (this.selectedVehicleList) {
      this.selectedVehicles = this.selectedVehicleList;
    }
    await this.initCombination();
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
      "_getAvailableVehiclesAuto",
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
    async initCombination() {
      this.isLoading = true;
      await this._getAvailableVehiclesAuto({
        startDate: this.startDate,
        endDate: this.endDate,
        bufferPre: this.config.contractPreBreakTime,
        bufferPost: this.config.contractPostBreakTime,
        passengerCount: this.passengerCount,
        vehicleCount: this.vehicleCount,
        ignoreSleeperBus: this.ignoreSleeperBus,
      }).then((res) => {
        this.combinations = res.combinations;
        this.selectCombination = this.combinations[
          Object.keys(this.combinations)[0]
        ];
      });
      await this.handleCombinationsChange();
      this.isLoading = false;
    },
    // Handle combinations dropdown change
    async handleCombinationsChange() {
      if (this.selectCombination) {
        this.seat = this.selectCombination[0];
        await this.initVehiclesList();
      }
    },
    // Init data for vehicle list
    async initVehiclesList() {
      this.isVehicleLoading = false;
      await this._getVehicleRecommendations({
        startDate: this.startDate,
        endDate: this.endDate,
        seatsMin: this.seat,
        seatsMax: this.seat,
        vehicleTypeId: "",
        viewOption: 0,
        bufferPre: this.config.contractPreBreakTime,
        bufferPost: this.config.contractPostBreakTime,
        pageNum: this.currentPage,
        displayAll: this.displayAll,
      }).then(async (res) => {
        this.vehicles = res;
      });

      this.totalVehicles = await this._getVehicleRecommendationsCount({
        startDate: this.startDate,
        endDate: this.endDate,
        seatsMin: this.seat,
        seatsMax: this.seat,
        vehicleTypeId: "",
        viewOption: 0,
        bufferPre: this.config.contractPreBreakTime,
        bufferPost: this.config.contractPostBreakTime,
        displayAll: this.displayAll,
      });

      // Remove selected vehicles
      this.selectedVehicles.forEach((vehicle) => {
        let index = this.isVehicleSelected(
          vehicle.vehicleId,
          this.selectedVehicles[this.tabIndex]
            ? this.selectedVehicles[this.tabIndex].vehicleId
            : ""
        );

        if (index > -1) {
          this.$delete(this.vehicles, index);
        }
      });
      this.isVehicleLoading = true;
    },

    async handleTabChange(tabIndex) {
      this.tabIndex = tabIndex;
      this.seat = this.selectCombination[tabIndex];
      await this.initVehiclesList();
    },
    // Select vehicle
    select(vehicle) {
      if (
        this.selectedVehicles.length === 0 ||
        !this.selectedVehicles[this.tabIndex]
      ) {
        this.selectedVehicles.push(vehicle);
      } else {
        this.$delete(this.selectedVehicles, this.tabIndex);
      }
    },
    isVehicleSelected(vehicleId, notVehicleId) {
      let index = -1;
      for (let i = 0; i < this.vehicles.length; i++) {
        if (
          vehicleId === this.vehicles[i].vehicleId &&
          notVehicleId !== this.vehicles[i].vehicleId
        ) {
          index = i;
        }
      }
      return index;
    },
    getSelectedVehicles() {
      if (
        this.selectedVehicles &&
        this.selectedVehicles.length == this.vehicleCount
      ) {
        return this.selectedVehicles;
      } else {
        this.isVehicleErr = true;
      }
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

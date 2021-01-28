/* eslint-disable vue/no-use-v-if-with-v-for */
<template>
  <div class="con-modal pb-2" v-if="contract">
    <div class="ui form">
      <div class="field mt-4">
        <label class="trip-header">BASIC INFORMATION</label>
      </div>
      <div class="two fields">
        <!-- Duration From -->
        <div class="field">
          <label>Duration From</label>
          <div class="ui corner labeled input">
            <input
              v-model="contract.durationFrom"
              type="text"
              placeholder="Duration From"
              readonly
            />
          </div>
        </div>
        <!-- Duration To -->
        <div class="field">
          <label>Duration To</label>
          <div class="ui corner labeled input">
            <input
              v-model="contract.durationTo"
              type="text"
              placeholder="Duration To"
              readonly
            />
          </div>
        </div>
      </div>

      <div class="two fields mt-4">
        <!-- Signed Date -->
        <div class="field">
          <label>Signed Date</label>
          <div class="ui corner labeled input">
            <input
              v-model="contract.signedDate"
              type="text"
              placeholder="Duration From"
              readonly
            />
          </div>
        </div>
        <!-- Owner -->
        <div class="field">
          <label>Owner</label>
          <div class="ui corner labeled input">
            <input
              v-model="contract.contractOwnerId"
              type="text"
              placeholder="Duration To"
              readonly
            />
          </div>
        </div>
      </div>

      <div class="two fields mt-4">
        <!-- Vehicle Count -->
        <div class="field">
          <label>Vehicle Count</label>
          <div class="ui corner labeled input">
            <input
              v-model="contract.vehicleCount"
              type="text"
              placeholder="Vehicle Count"
              readonly
            />
          </div>
        </div>
        <!-- Passenger Count -->
        <div class="field">
          <label>Passenger Count</label>
          <div class="ui corner labeled input">
            <input
              v-model="contract.passengerCount"
              type="text"
              placeholder="Passenger Count"
              readonly
            />
          </div>
        </div>
      </div>

      <!-- Signed Location -->
      <div class="field">
        <label>Signed Location</label>
        <div class="ui corner labeled input">
          <input
            v-model="contract.signedLocation"
            type="text"
            placeholder="Signed Location"
            readonly
          />
        </div>
      </div>

      <!-- Description -->
      <div class="field">
        <label>Description</label>
        <div class="ui corner labeled input">
          <textarea
            v-model="contract.otherInformation"
            type="text"
            placeholder="Description"
            rows="3"
            readonly
          />
        </div>
      </div>
    </div>
    <ConfirmTrip
      ref="firstTrip"
      v-if="contract.trips[0]"
      :trip="contract.trips[0]"
      :priceChange="priceChange"
      :isUpdate="true"
    />
    <ConfirmTrip
      ref="returnTrip"
      v-if="contract.trips[1]"
      :trip="contract.trips[1]"
      :priceChange="priceChange"
      :isUpdate="true"
    />

    <div class="ui form mt-3" v-if="isRender">
      <div class="field">
        <label>Total Price</label>
        <div class="ui corner labeled input">
          <input
            v-model="contract.totalPrice"
            type="text"
            placeholder="Total Price"
            readonly
          />
        </div>
      </div>
    </div>

    <div class="row justify-content-center  mt-2">
      <button
        class="btn btn-gradient-danger btn-fw"
        type="button"
        @click="cancel"
      >
        Cancel
      </button>
      <button
        class="btn btn-gradient-info btn-fw ml-2"
        type="button"
        @click="createContract"
      >
        Done
      </button>
    </div>
  </div>
</template>

<script>
import ConfirmTrip from "./ConfirmTrip";
import { mapActions } from "vuex";
import { isNumber } from "../../assets/js/input.js";
export default {
  components: {
    ConfirmTrip,
  },
  props: {
    propContract: Object,
    create: Function,
    cancel: Function,
    isUpdate: Boolean,
  },
  data() {
    return {
      contract: {
        contractId: 0,
        contractOwnerId: "string",
        durationFrom: "yyyy-MM-dd",
        durationTo: "yyyy-MM-dd",
        otherInformation: "string",
        passengerCount: 0,
        roundTrip: true,
        signedDate: "yyyy-MM-dd",
        signedLocation: "string",
        totalPrice: 0,
        trips: [],
        vehicleCount: 0,
      },
      statusList: [],
      searchVehicleId: "",
      vehicleType: "",
      searchStatusID: "",
      isLoading: true,
      page: 0,
      currentPage: 0,
      vehicleTypes: [],
      selectedVehicle: "",
      // startDate: "",
      // endDate: "",
      vehicles: [],
      totalVehicles: 0,
      maxSeat: 0,
      viewOption: 0,

      firstConPrice: 0,
      returnConPrice: 0,

      contractPrices: [0, 0],
      tripPrices: [null, null],
      isRender: false,
    };
  },
  computed: {
    // Map state
    // ...mapState("Vehicle", ["vehicles", "totalVehicles"]),
  },
  mounted() {
    if (this.propContract) {
      this.contract = this.propContract;
      this.isRender = true;
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
      "_getAvailableVehiclesAuto",
    ]),

    priceChange() {
      let price = 0;
      price += this.$refs.firstTrip ? this.$refs.firstTrip.contractPrice : 0;
      price +=
        this.contract.trips[1] && this.$refs.returnTrip
          ? this.$refs.returnTrip.contractPrice
          : 0;
      this.contract.totalPrice = price;
    },

    async createContract() {
      this.contract.trips[0].assignedVehicles = this.formatVehicles(
        this.contract.trips[0].assignedVehicles
      );
      if (this.contract.roundTrip) {
        this.contract.trips[1].assignedVehicles = this.formatVehicles(
          this.contract.trips[1].assignedVehicles
        );
      }
      // console.log(this.contract);
      await this.create(this.contract);
    },
    // Format vehicle
    formatVehicles(vehicles) {
      let formattedVehicles = [];
      vehicles.forEach((vehicle) => {
        formattedVehicles.push(vehicle.vehicleId);
      });
      return formattedVehicles;
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
  /* border-radius: 1%; */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(255, 255, 255);
  z-index: 10000;
  width: auto;
  height: 100%;
  min-width: 45%;
  max-height: 90%;
  padding-top: 12%;
  box-shadow: 2px 2px 15px 7px rgba(0, 0, 0, 0.34);
  color: black;
  overflow-y: auto;
  overflow-x: hidden;
}
.con-modal .header {
  color: white;
  font-size: 35px !important;
}
.btn-group {
  position: absolute;
  bottom: 2%;
  width: 100%;
}
/* width */
::-webkit-scrollbar {
  width: 5px;
}

.trip-header {
  color: rgb(61, 61, 245) !important;
}
@import "../../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>

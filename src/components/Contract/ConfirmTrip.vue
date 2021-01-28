<template>
  <div class="ui form" v-if="isRender">
    <div class="field mt-4 ">
      <label class="trip-header">TRIP</label>
    </div>
    <div class="two fields">
      <!-- Departure Time -->
      <div class="field">
        <label>Departure Time</label>
        <div class="ui corner labeled input">
          <input
            v-model="trip.departureTime"
            type="text"
            placeholder="Departure Time"
            readonly
          />
        </div>
      </div>
      <!-- Destination Time -->
      <div class="field">
        <label>Destination Time</label>
        <div class="ui corner labeled input">
          <input
            v-model="trip.destinationTime"
            type="text"
            placeholder="Destination Time"
            readonly
          />
        </div>
      </div>
    </div>

    <!-- Departure Location -->
    <div class="field">
      <label>Departure Location</label>
      <div class="ui corner labeled input">
        <input
          v-model="trip.departureLocation"
          type="text"
          placeholder="Departure Location"
          readonly
        />
      </div>
    </div>
    <!-- Departure Location -->
    <div class="field" v-if="trip.locations">
      <label>Locations</label>
      <div class="ui corner labeled input">
        <textarea
          :value="generateLocation(trip.locations)"
          type="text"
          rows="3"
          placeholder="Departure Location"
          readonly
        />
      </div>
    </div>

    <!-- Destination Location -->
    <div class="field ">
      <label>Destination Location</label>
      <div class="ui corner labeled input">
        <input
          v-model="trip.destinationLocation"
          type="text"
          placeholder="Destination Location"
          readonly
        />
      </div>
    </div>

    <!-- Assigned Vehicles -->
    <div class="field" v-if="trip.assignedVehicles">
      <label>Assigned Vehicles</label>
      <div class="ui corner labeled input">
        <textarea
          :value="generateVehicles(trip.assignedVehicles)"
          type="text"
          rows="3"
          placeholder="Assigned Vehicles"
          readonly
        />
      </div>
    </div>

    <div class="two fields mt-4">
      <!-- Trip Complete Time -->
      <div class="field">
        <label>Total Complete Time</label>
        <div class="ui corner labeled input">
          <input
            v-model="trip.totalTime"
            type="text"
            placeholder="Vehicle Count"
            readonly
          />
        </div>
      </div>
      <!-- Passenger Count -->
      <div class="field">
        <label>Total Distance</label>
        <div class="ui corner labeled input">
          <input
            v-model="trip.totalDistance"
            type="text"
            placeholder="Passenger Count"
            readonly
          />
        </div>
      </div>
    </div>
    <!-- Trip Price -->
    <div class="field">
      <label>Trip Price</label>
      <div class="ui corner labeled input">
        <!-- Return trip -->
        <select
          v-model="contractPrice"
          placeholder="Destination Location"
          @change="priceChange"
        >
          <option
            v-for="(price, i) in tripPrices"
            :value="price.price"
            :key="i"
          >
            {{ price.title }} - {{ price.price }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    trip: Object,
    priceChange: Function,
    isUpdate: Boolean,
  },
  data() {
    return {
      contractPrice: 0,
      tripPrices: null,
      isRender: false,
      vehicleSeats: [],
    };
  },
  async mounted() {
    if (this.isUpdate) {
      await this.initVehicleSeats();
      await this.initVehicles();
    }
    this.tripPrices = this.generateTripPrice(
      this.trip.assignedVehicles,
      this.trip.totalDistance,
      this.trip.totalTime
    );
    this.contractPrice = this.tripPrices[0].price;
    this.$parent.priceChange();
    this.isRender = true;
  },
  methods: {
    // Map state
    ...mapActions("Vehicle", ["_getDetailVehicle"]),
    ...mapActions("Vehicle", ["_getVehicleSeats"]),

    // Init data for vehicleSeat list
    async initVehicleSeats() {
      this.vehicleSeats = await this._getVehicleSeats();
    },

    findVehicleSeatById(seatsId) {
      for (const vehicleSeat of this.vehicleSeats) {
        if (vehicleSeat.seatsId === seatsId) {
          return vehicleSeat;
        }
      }
    },
    async initVehicles() {
      let vehicles = Object.assign([], this.trip.assignedVehicles);

      let newVehicles = [];
      for (const vehicle of vehicles) {
        let vehicleDetail = vehicle;
        if (!vehicle.prices) {
          await this._getDetailVehicle(vehicle.vehicleId).then((res) => {
            vehicleDetail = res;
            let price = this.findVehicleSeatById(
              vehicleDetail.seatsModel.seatsId
            );

            let prices = [];
            prices.push({
              pricePerDay: price.pricePerDay,
              pricePerDistance: price.pricePerDistance,
              pricePerHour: price.pricePerHour,
            });
            vehicleDetail.prices = prices;
          });
        }
        newVehicles.push(vehicleDetail);
      }
      this.trip.assignedVehicles = newVehicles;
    },
    async getVehicleDetail(vehicleId) {
      await this._getDetailVehicle(vehicleId).then((res) => {
        return res;
      });
    },
    generateVehicles(vehicles) {
      let text = "";
      for (let i = 0; i < vehicles.length; i++) {
        text +=
          Number(i + 1) +
          " - " +
          (vehicles[i].vehicleId ? vehicles[i].vehicleId : vehicles[i]) +
          "\n";
      }
      return text;
    },
    generateLocation(locations) {
      let text = "";
      for (let i = 0; i < locations.length; i++) {
        text += i + 1 + " - " + locations[i].location + "\n";
      }
      return text;
    },
    generateTripPrice(vehicles, totalDistance, totalTime) {
      let totalPriceByDistance = 0;
      let totalPriceByHour = 0;
      let totalPriceByDay = 0;

      let days =
        Math.floor(totalTime / (60 * 60 * 24)) < 1
          ? 1
          : Math.floor(totalTime / (60 * 60 * 24));

      let hours =
        Math.floor(totalTime / (60 * 60)) < 1
          ? 1
          : Math.floor(totalTime / (60 * 60)) + 1;
      // Price by distance
      vehicles.forEach((vehicle) => {
        totalPriceByDistance +=
          (vehicle.prices[0].pricePerDistance / 1000) * totalDistance;
        totalPriceByHour += vehicle.prices[0].pricePerHour * hours;
        totalPriceByDay += vehicle.prices[0].pricePerDay * days;
      });
      let prices = [
        {
          title: "Total Price (Distance)",
          price: Math.floor(totalPriceByDistance),
        },
        {
          title: "Total Price (Hour)",
          price: Math.floor(totalPriceByHour),
        },
        {
          title: "Total Price (Day)",
          price: Math.floor(totalPriceByDay),
        },
      ];
      // this.contractPrices[index] = prices[0].price;

      return prices;
    },
  },
};
</script>

<style scoped>
.trip-header {
  color: rgb(61, 61, 245) !important;
}
</style>

<template>
  <div>
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

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
            <h4 class="card-title">{{ this.title }}</h4>
            <!-- <p class="card-description">{{ this.totalVehicles }} total</p> -->
            <table class="table ">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <th>ID</th>
                  <!-- <th>MODEL</th> -->
                  <!-- <th>SEAT</th>
                  <th>TYPE</th> -->
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
                  <td>{{ vehicle }}</td>
                  <!-- <td>{{ vehicle.vehicleId }}</td> -->
                  <!-- <td>{{ vehicle.model }}</td> -->
                  <!-- <td>{{ vehicle.seats }}</td>
                  <td>{{ vehicle.vehicleType.vehicleTypeName }}</td> -->

                  <td class="row justify-content-center btn-action">
                    <button
                      class="btn btn-gradient-success btn-rounded btn-icon mr-1"
                      @click="viewPassenger(vehicle.contractVehicleId)"
                    >
                      <i class="mdi mdi-account-multiple-outline"></i>
                    </button>
                    <button
                      class="btn btn-gradient-info btn-rounded btn-icon mr-1"
                      @click="viewDetail(vehicle)"
                    >
                      <i class="mdi mdi-train"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
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
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "Vehicles",
  props: {
    handleDelBtnVisible: Function,
    contractId: Number,
    title: String,
    contract: Object,
    vehicles: Array,
  },
  components: {
    Loading,
  },
  data() {
    return {
      isTableVisible: true,

      vehiclesList: [],

      isLoading: false,
      totalVehicles: 0,
      page: 0,
      currentPage: 1,
    };
  },
  async mounted() {
    // await this.initVehiclesList();
    this.vehiclesList = this.vehicles;
  },
  methods: {
    // Map state
    ...mapActions("Contract", ["_getContractVehicle"]),

    // Init data for Vehicle Status Dropdown
    async initStatusList() {
      this.statusList = require("../../assets/json/vehicle/status.json");
    },

    // Init data for vehicle list
    async initVehiclesList() {
      this.isLoading = true;
      this.vehiclesList = await this._getContractVehicle(this.contractId);
      this.isLoading = false;
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
  },
};
</script>
<style scoped>
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

<template>
  <div class="content-wrapper">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <div class="page-header">
      <h3 class="page-title">
        <router-link to="/drivers">Drivers</router-link>
        <span class="text-secondary"> / </span>
        <router-link :to="`/drivers/${this.$route.params.driverId}`">
          {{ this.$route.params.driverId }}
        </router-link>
        <span class="text-secondary"> / </span>
        <span>
          Vehicles
        </span>
      </h3>
    </div>

    <div class="row">
      <!-- Drivers table -->
      <div
        class="grid-margin stretch-card"
        v-bind:class="{
          'col-lg-12': isTableVisible,
          'col-lg-9': !isTableVisible,
        }"
      >
        <div class="card" v-if="assignedDrivers.length > 0">
          <div class="card-body">
            <h4 class="card-title">Vehicles List</h4>
            <table class="table ">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <!-- <th>ID</th> -->
                  <th>ID</th>
                  <th>ISSUED DATE</th>
                  <th>RETURNED DATE</th>
                  <th class="text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(vehicle, index) in this.assignedDrivers"
                  :key="vehicle.issuedVehicleId"
                >
                  <td class="text-secondary">{{ page * 15 + index + 1 }}</td>
                  <!-- <td>{{ vehicle.userId }}</td> -->
                  <td>{{ vehicle.vehicleId }}</td>
                  <!-- <td>{{ vehicle.userName }}</td> -->
                  <td>{{ vehicle.issuedDate }}</td>
                  <td>
                    <label
                      class="badge"
                      v-bind:class="{
                        'badge-info': vehicle.returnedDate === null,
                      }"
                    >
                      {{
                        vehicle.returnedDate ? vehicle.returnedDate : "ACTIVE"
                      }}
                    </label>
                  </td>

                  <td class="row justify-content-center btn-action">
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
          </div>
        </div>
        <!-- Empty list -->
        <div class="card empty-list" v-else-if="!isLoading">
          <i class="mdi mdi-account-off"></i>
          <h1>NOTHING</h1>
          <h3>Your list is empty.</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { isNumber } from "../../../assets/js/input.js";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "Drivers",
  props: {},
  components: {
    Loading,
  },
  computed: {
    // Map state
    ...mapState("Vehicle", ["assignedDrivers"]),
  },
  data() {
    return {
      isFilterVisible: false,
      isTableVisible: true,
      statusList: [],
      // Filter
      searchPhoneNumber: "",
      searchDriverID: "",
      searchDriverName: "",
      searchStatusID: "",
      isLoading: true,
      // Pagination
      page: 0,
      currentPage: 1,
      // Delete
      isDeleteConVisible: false,
      // Error and success modal
      isError: false,
      isSuccess: false,
      errMsg: "",
      deleteUserID: "",

      driverId: this.$route.params.driverId,
    };
  },
  async mounted() {
    // await this.initStatusList();
    if (this.$route.params.status) {
      this.searchStatusID = this.$route.params.status;
    }
    await this.initDriversList();
  },
  methods: {
    // Map actions
    ...mapActions("Vehicle", ["_getVehicleHistoryByDriverId"]),
    // Init data for vehicle list
    async initDriversList() {
      this.isLoading = true;
      await this._getVehicleHistoryByDriverId(this.driverId);
      this.isLoading = false;
    },

    // View vehicle detail
    viewDetail(vehicleId) {
      this.$router.push({
        name: "VehicleDetail",
        params: { vehicleId: vehicleId },
      });
    },

    isNumber(evt) {
      isNumber(evt);
    },
    // Close Error Modal
    handleErrorModal() {
      this.isError = !this.isError;
    },
    // Close Error Modal
    handleSuccessModal() {
      this.isSuccess = !this.isSuccess;
      this.searchDrivers();
    },
    // Close delete vehicle confimation dialog
    handleDialog(dialogName, userId) {
      if (userId.length !== 0) {
        this.deleteUserID = userId;
      }
      this.$data[dialogName] = !this.$data[dialogName];
    },
  },
};
</script>
<style scoped>
.filter {
  max-height: 420px !important;
}
.label {
  font-size: 13px;
}
.form-control {
  font-size: 13px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

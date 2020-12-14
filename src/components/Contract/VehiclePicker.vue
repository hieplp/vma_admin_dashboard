<template>
  <div class="row">
    <div class="col-12 grid-margin stretch-card">
      <!-- Vehicles table -->
      <div class="card">
        <div class="card-body">
          <h4 class="ui dividing header">{{ this.title }}</h4>
          <table class="table" v-if="vehiclesList.length > 0">
            <thead>
              <tr class="">
                <th>NO.</th>
                <th>ID</th>
                <!-- <th>SEAT</th>
                <th>TYPE</th> -->
                <th class="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(vehicle, index) in this.vehiclesList"
                :key="vehicle.vehicleId"
              >
                <td class="text-secondary">
                  {{ index + 1 }}
                </td>
                <td>{{ vehicle }}</td>
                <!-- <td>{{ vehicle.seats }}</td> -->
                <!-- <td>{{ vehicle.vehicleTypeName }}</td> -->
                <td class="row justify-content-center btn-action">
                  <button
                    class="btn btn-gradient-danger btn-rounded btn-icon mr-1"
                    @click="removeVehicle(index)"
                  >
                    <i class="mdi mdi-delete-forever"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div
            class="row address mt-5 justify-content-center add-location"
            @click="handleVehicleModal"
          >
            <i class="icon plus circle"></i>
            <span>
              Add a vehicle
            </span>
          </div>
          <div class="row justify-content-center">
            <div class="ui pointing red basic label" v-if="isErr">
              Departure and destination locations are required!
            </div>
          </div>
        </div>
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
          :selectedVehicleList="vehiclesList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import RecVehiclesModal from "../../components/Modal/RecVehiclesModal";

export default {
  name: "Vehicles",
  props: {
    handleDelBtnVisible: Function,
    contractId: Number,
    contract: Object,
    title: String,
    isDetail: Boolean,
    vehicles: Array,
  },
  components: {
    Loading,
    RecVehiclesModal,
  },
  data() {
    return {
      isErr: false,
      vehiclesList: [],
      isLoading: false,
      isVehicleModalVisible: false,

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
    if (this.vehicles) {
      this.vehiclesList = this.vehicles;
    }
  },
  methods: {
    // Map state
    ...mapActions("Contract", ["_getContractVehicle"]),

    // Handle vehicle modal
    handleVehicleModal() {
      this.isVehicleModalVisible = !this.isVehicleModalVisible;
      // this.$refs.vehicleModal.startDate = this.
    },
    // Get vehicle
    getVehicle() {
      this.vehiclesList.push(
        this.$refs.vehicleModal.getSelectedVehicle().vehicleId
      );
      this.handleVehicleModal();
    },
    // Remove vehicle
    removeVehicle(index) {
      this.$delete(this.vehiclesList, index);
    },
    // return data to parent
    getData() {
      this.isErr = this.vehiclesList.length === 0;
      if (!this.isErr) {
        // let vehicles = [];
        // this.vehiclesList.forEach((vehicle) => {
        //   vehicles.push(vehicle);
        // });
        return this.vehiclesList;
      }
      return null;
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

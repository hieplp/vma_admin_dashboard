<template>
  <div class="row">
    <!-- Update Confirmation -->
    <Confirmation
      icon="edit outline"
      title="Total Seats Confirmation"
      subTitle="Total seats are enough. Do you want to add another vehicle?"
      rightBtnTitle="Add"
      rightBtnIcon="check"
      rightBtnColor="blue"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="red"
      v-if="isOverPassVisible"
      :handleLeftBtn="
        () => {
          this.isOverPassVisible = !this.isOverPassVisible;
        }
      "
      :handleRightBtn="
        () => {
          this.isVehicleModalVisible = !this.isVehicleModalVisible;
          this.isOverPassVisible = !this.isOverPassVisible;
        }
      "
    />

    <div class="col-12 grid-margin stretch-card">
      <!-- Vehicles table -->
      <div class="card">
        <div class="card-body">
          <h4 class="ui dividing header">{{ this.title }}</h4>

          <table class="table" v-if="vehiclesList.length > 0 && isRender">
            <thead>
              <tr class="">
                <th>NO.</th>
                <th>ID</th>
                <th>SEAT</th>
                <th>TYPE</th>
                <!-- <th class="text-center">ACTION</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vehicle, index) in this.vehiclesList" :key="index">
                <td class="text-secondary">
                  {{ index + 1 }}
                </td>
                <td>{{ vehicle.vehicleId }}</td>
                <td>{{ vehicle.seats }}</td>
                <td>{{ vehicle.vehicleType.vehicleTypeName }}</td>
                <!-- <td class="row justify-content-center btn-action">
                  <button
                    class="btn btn-gradient-danger btn-rounded btn-icon mr-1"
                    @click="removeVehicle(index)"
                  >
                    <i class="mdi mdi-delete-forever"></i>
                  </button>
                </td> -->
              </tr>
            </tbody>
          </table>

          <div
            class="row address mt-5 justify-content-center add-location"
            @click="handleVehicleModal(1)"
          >
            <i class="icon plus circle"></i>
            <span>
              Add a vehicle
            </span>
          </div>
          <div class="row justify-content-center">
            <div class="ui pointing red basic label" v-if="isErr">
              Trip is requires {{ this.vehicleCount }} vehicle(s).
            </div>
          </div>
        </div>
        <!-- <loading
          :active.sync="isLoading"
          :can-cancel="false"
          :loader="'dots'"
          :is-full-page="false"
          :color="'#2e5bff'"
        ></loading> -->

        <RecVehiclesModal
          ref="vehicleModal"
          v-if="isVehicleModalVisible"
          :config="config"
          :cancelFunction="handleVehicleModal"
          :doneFunction="getSelectedVehicles"
          :startDate="startDate"
          :endDate="endDate"
          :vehicleCount="vehicleCount + ''"
          :passengerCount="passengerCount + ''"
          :selectedVehicleList="vehiclesList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
// import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import RecVehiclesModal from "../../components/Modal/AutoRecVehiclesModal";
import Confirmation from "../../components/Modal/Confirmation";

export default {
  name: "Vehicles",
  props: {
    handleDelBtnVisible: Function,
    contractId: Number,
    contract: Object,
    title: String,
    isDetail: Boolean,
    vehicles: Array,
    contractDetailId: Number,
    propsTotalPassengers: String,
    config: Object,
  },
  components: {
    // Loading,
    RecVehiclesModal,
    Confirmation,
  },
  data() {
    return {
      isErr: false,
      vehiclesList: [],
      isLoading: false,
      isVehicleModalVisible: false,
      isOverPassVisible: false,

      // Seat
      totalSeats: [],

      viewOption: 0,

      vehicleTypes: [],
      searchTotalDistance: ["", ""],

      oldVehicles: [],

      //
      startDate: "",
      endDate: "",
      vehicleCount: 0,
      passengerCount: 0,
      isRender: false,
    };
  },
  async mounted() {
    // this.isLoading = false;
    if (this.contractDetailId) {
      await this.initVehiclesList();
    }
    this.isRender = true;
    // this.isLoading = false;
  },
  methods: {
    // Map action
    ...mapActions("Contract", ["_getContractVehicle", "_getContractVehicle"]),

    // Handle vehicle modal
    handleVehicleModal(type) {
      if (type === 1) {
        let newPass = this.oldTotalPassengers;
        this.vehiclesList.forEach((vehicle) => {
          newPass -= vehicle.seats;
        });
        this.totalPassengers = newPass;

        if (this.totalPassengers <= 0) {
          this.isOverPassVisible = true;
        } else {
          this.isVehicleModalVisible = true;
        }
      } else {
        this.isVehicleModalVisible = !this.isVehicleModalVisible;
      }

      // this.$refs.vehicleModal.startDate = this.
    },
    // Init vehicle list
    async initVehiclesList() {
      this.isLoading = true;
      this.vehiclesList = await this._getContractVehicle(this.contractDetailId);
      // this.oldVehicles = Object.assign([], this.vehicles);
      this.isLoading = false;
    },
    // Get vehicle
    getSelectedVehicles() {
      let vehiclesList = this.$refs.vehicleModal.getSelectedVehicles();

      if (vehiclesList) {
        this.vehiclesList = vehiclesList;

        this.isVehicleModalVisible = false;
        // this.handleVehicleModal();
      }
    },
    // Remove vehicle
    removeVehicle(index) {
      this.$delete(this.vehiclesList, index);
    },
    // return data to parent
    getData() {
      this.isErr = this.vehiclesList.length != this.vehicleCount;
      if (!this.isErr) {
        return this.vehiclesList;
      }
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

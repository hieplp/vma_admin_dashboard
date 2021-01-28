<template>
  <div class="content-wrapper">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <!-- Create vehicle seat -->
    <VehicleSeat
      ref="vehicleSeatModal"
      :create="createVehicleSeat"
      :update="updateVehicleSeat"
    />

    <!-- Delete confimation -->
    <Confirmation
      icon="trash alternate"
      title="Delete Confirmation"
      subTitle="Do you want to delete this vehicleSeat?"
      rightBtnTitle="Delete"
      rightBtnIcon="trash alternate"
      rightBtnColor="red"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="blue"
      v-if="isDeleteConVisible"
      :handleLeftBtn="
        () => {
          this.isDeleteConVisible = !this.isDeleteConVisible;
        }
      "
      :handleRightBtn="deletevehicleSeat"
    />

    <!-- Error message -->
    <MessageModal
      :title="errTitle"
      icon="frown outline "
      :subTitle="errMsg"
      :proFunc="
        () => {
          this.isError = !this.isError;
          this.$modal.show('example');
        }
      "
      v-if="isError"
    />
    <!-- Success message -->
    <MessageModal
      :title="successTitle"
      icon="check circle"
      :subTitle="successMsg"
      :proFunc="
        () => {
          this.isSuccess = !this.isSuccess;
          this.initVehicleSeats();
        }
      "
      v-if="isSuccess"
    />

    <div class="page-header">
      <h3 class="page-title">
        <a class="nav-link">Vehicle Seats</a>
      </h3>
      <div class="dropdown">
        <button
          class="btn btn-gradient-info btn-icon-text mr-2"
          type="button"
          @click="
            () => {
              this.$refs.vehicleSeatModal.clearAllValue();
              this.$refs.vehicleSeatModal.isUpdate = false;
              this.$modal.show('seatCreateModal');
            }
          "
        >
          <i class="mdi mdi-plus-box btn-icon-prepend"></i>
          Create
        </button>
      </div>
    </div>
    <div class="row">
      <!-- vehicleSeats table -->
      <div
        class="grid-margin stretch-card"
        v-bind:class="{
          'col-lg-12': isTableVisible,
          'col-lg-9': !isTableVisible,
        }"
      >
        <div class="card" v-if="vehicleSeats.length > 0">
          <div class="card-body">
            <h4 class="card-title">Vehicle Seat List</h4>
            <p class="card-description">{{ this.vehicleSeats.length }} total</p>
            <table class="table ">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <!-- <th>ID</th> -->
                  <th>SEATS</th>
                  <th>GROUP NAME</th>
                  <th>PRICE PER DAY</th>
                  <th>PRICE PER DISTANCE</th>
                  <th>PRICE PER HOUR</th>
                  <!-- <th>TOTAL DISTANCE</th> -->
                  <th class="text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(vehicleSeat, index) in this.vehicleSeats"
                  :key="vehicleSeat.vehicleSeatId"
                >
                  <td class="text-secondary">{{ index + 1 }}</td>
                  <td>{{ vehicleSeat.seats }}</td>
                  <td>{{ vehicleSeat.seatsGroupName }}</td>
                  <td>{{ moneyFormat(vehicleSeat.pricePerDay) }}</td>
                  <td>{{ moneyFormat(vehicleSeat.pricePerDistance) }}</td>
                  <td>{{ moneyFormat(vehicleSeat.pricePerHour) }}</td>

                  <td class="row justify-content-center btn-action">
                    <button
                      class="btn btn-gradient-warning btn-rounded btn-icon mr-1"
                      @click="handleUpdate(vehicleSeat)"
                    >
                      <i class="mdi mdi-grease-pencil"></i>
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
import { isNumber } from "../../assets/js/input.js";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import Confirmation from "../../components/Modal/Confirmation";
import MessageModal from "../../components/Modal/MessageModal";
import VehicleSeat from "../../components/Vehicle Seat/VehicleSeat";

export default {
  name: "vehicleSeats",
  props: {
    handleDelBtnVisible: Function,
  },
  components: {
    Loading,
    Confirmation,
    MessageModal,
    VehicleSeat,
  },
  data() {
    return {
      isTableVisible: true,
      statusList: [],

      vehicleSeats: [],

      isLoading: true,
      page: 0,
      isDeleteConVisible: false,
      isCreateModalVisible: false,
      isError: false,
      isSuccess: false,
      errMsg: "",
      errTitle: "",
      successTitle: "",
      successMsg: "",
      deletevehicleSeatId: "",
    };
  },
  async mounted() {
    await this.initVehicleSeats();
  },
  methods: {
    // Map actions
    ...mapActions("Vehicle", [
      "_getVehicleSeats",
      "_createVehicleSeat",
      "_updateVehicleSeat",
    ]),

    isNumber(evt) {
      isNumber(evt);
    },

    // Init data for vehicleSeat list
    async initVehicleSeats() {
      this.isLoading = true;
      this.vehicleSeats = await this._getVehicleSeats();
      this.isLoading = false;
    },

    // Create vehicle seat
    createVehicleSeat(vehicleSeat) {
      this.isLoading = true;
      this.$modal.hide("seatCreateModal");
      this._createVehicleSeat(vehicleSeat)
        .then((res) => {
          if (res) {
            this.$modal.hide("seatCreateModal");
            this.successTitle = "Create Successfully!";
            this.successMsg = "Vehicle seat is created successfully!";
            this.isSuccess = true;
          }
        })
        .catch((err) => {
          if (err) {
            this.successTitle = "Create Fail!";
            this.successMsg = "Vehicle seat is failed to create!";
            this.isError = true;
          }
        });
      this.isLoading = false;
    },
    // Update vehicle seat
    updateVehicleSeat(vehicleSeat) {
      this.isLoading = true;

      this._updateVehicleSeat(vehicleSeat)
        .then((res) => {
          if (res) {
            this.$modal.hide("seatCreateModal");
            this.successTitle = "Update Successfully!";
            this.successMsg = "Vehicle seat is updated successfully!";
            this.isSuccess = true;
          }
        })
        .catch((err) => {
          if (err) {
            this.successTitle = "Update Fail!";
            this.successMsg = "Vehicle seat is failed to update!";
            this.isError = true;
          }
        });
      this.isLoading = false;
    },
    // Handle update
    handleUpdate(seat) {
      this.$refs.vehicleSeatModal.isUpdate = true;
      this.$refs.vehicleSeatModal.seat = Object.assign({}, seat);
      this.$refs.vehicleSeatModal.initData();
      this.$modal.show("seatCreateModal");
    },

    // Close delete vehicleSeat confimation dialog
    handleDialog(dialogName, userId) {
      if (userId.length !== 0) {
        this.deletevehicleSeatId = userId;
      }
      this.$data[dialogName] = !this.$data[dialogName];
    },
    // Money format
    moneyFormat(str) {
      return str
        .toString()
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
</style>

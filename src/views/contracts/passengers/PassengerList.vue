<template>
  <div class="content-wrapper">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <!-- Assign confimation -->
    <Confirmation
      icon="check circle"
      title="Assign Confirmation"
      subTitle="Do you want to assign this passenger?"
      rightBtnTitle="Assign"
      rightBtnIcon="check circle"
      rightBtnColor="blue"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="red"
      v-if="isDeleteConVisible"
      :handleLeftBtn="
        () => {
          this.isDeleteConVisible = !this.isDeleteConVisible;
        }
      "
      :handleRightBtn="updateVehicle"
    />

    <!-- Error message -->
    <MessageModal
      title="Delete Vehicle Fail!"
      icon="frown outline "
      :subTitle="errMsg"
      :proFunc="
        () => {
          this.isError = !this.isError;
        }
      "
      v-if="isError"
    />
    <!-- Success message -->
    <MessageModal
      title="Assign Vehicle Successfully!"
      icon="check circle"
      :subTitle="
        `Vehicle with id ${this.deleteVehicleId} is assigned successfully.`
      "
      :proFunc="
        () => {
          this.isSuccess = !this.isSuccess;
          this.searchVehicles();
        }
      "
      v-if="isSuccess"
    />

    <div class="page-header">
      <h3 class="page-title">
        <router-link to="/passengers" class="nav-link">Passengers</router-link>
      </h3>
    </div>
    <div class="row">
      <!-- Vehicles table -->
      <div
        class="grid-margin stretch-card"
        v-bind:class="{
          'col-lg-12': isTableVisible,
          'col-lg-9': !isTableVisible,
        }"
      >
        <div class="card" v-if="passengerList.length > 0">
          <div class="card-body">
            <h4 class="card-title">Passengers List</h4>
            <!-- <p class="card-description">{{ this.totalVehicles }} total</p> -->
            <table class="table ">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <th>FULL NAME</th>
                  <th>PHONE NUMBER</th>
                  <th>DATE OF BIRTH</th>
                  <th>ADDRESS</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(passenger, index) in this.passengerList"
                  :key="passenger.passengerId"
                >
                  <td class="text-secondary">{{ page * 15 + index + 1 }}</td>
                  <td>{{ passenger.fullName }}</td>
                  <td>{{ passenger.phoneNumber }}</td>
                  <td>{{ passenger.dateOfBirth }}</td>
                  <td>{{ passenger.address }}</td>
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
import Confirmation from "../../../components/Modal/Confirmation";
import MessageModal from "../../../components/Modal/MessageModal";

export default {
  name: "Vehicles",
  props: {
    handleDelBtnVisible: Function,
  },
  components: {
    Loading,
    Confirmation,
    MessageModal,
  },
  data() {
    return {
      isFilterVisible: false,
      isTableVisible: true,
      statusList: [],

      passengerList: [],
      // Filter
      searchPhoneNumber: "",
      searchVehicleID: "",
      searchModel: "",
      searchStatusID: "AVAILABLE",
      searchType: "",
      passengerMaxDis: "",
      passengerMinDis: "",
      passengerMaxSeat: "",
      passengerMinSeat: "",
      startDate: this.$route.params.startDate,
      endDate: this.$route.params.endDate,
      ownerId: "",

      isLoading: true,
      totalVehicles: 0,
      page: 0,
      currentPage: 1,
      isDeleteConVisible: false,
      isError: false,
      isSuccess: false,
      errMsg: "",
      deleteVehicleId: "",
      // Seat
      totalSeats: [],

      viewOption: 0,

      passengerTypes: [],
      searchTotalDistance: ["", ""],

      contractId: this.$route.params.contractId,
      contractVehicleId: this.$route.params.contractVehicleId,
      contractVehicles: [],
    };
  },
  async mounted() {
    await this.initPassengerList();
  },
  methods: {
    // Map state
    ...mapActions("Contract", ["_getPassengerList"]),
    // Init data for passenger list
    async initPassengerList() {
      this.isLoading = true;
      this.passengerList = await this._getPassengerList(this.contractVehicleId);
      this.isLoading = false;
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

/* .form-control {
  border-color: rgb(187, 181, 181) !important;
} */

.icon.bus.ui {
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

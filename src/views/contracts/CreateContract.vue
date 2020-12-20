<template>
  <div class="content-wrapper" ref="container">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <div class="page-header">
      <h3 class="page-title test">
        <router-link to="/contracts">
          Contracts
        </router-link>
        <span class="text-secondary">/</span>
        <span>
          Create Contract
        </span>
      </h3>
    </div>

    <!-- Error message -->
    <MessageModal
      title=" Create Contract Fail!"
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
      title="Create Contract Successfully!"
      icon="check circle"
      :subTitle="`Contract is created successfully!`"
      :proFunc="
        () => {
          this.isCreatedSuccessfully = !this.isCreatedSuccessfully;
          this.$router.push({
            name: 'Contracts',
          });
        }
      "
      v-if="isCreatedSuccessfully"
    />

    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui three steps">
              <button
                class="step"
                v-on:click="changeTab('isContractVisible')"
                v-bind:class="{ active: isContractVisible }"
              >
                <i class="mdi mdi-file-document icon"></i>
                <div class="content">
                  <div class="title">CONTRACT</div>
                </div>
              </button>
              <button
                class="step"
                v-on:click="changeTab('isTripVisible')"
                v-bind:class="{ active: isTripVisible }"
              >
                <i class="newspaper outline icon"></i>
                <div class="content">
                  <div class="title">TRIP</div>
                </div>
              </button>
              <button
                class="step"
                v-on:click="changeTab('isVehicleVisible')"
                v-bind:class="{ active: isVehicleVisible }"
              >
                <i class="car icon"></i>
                <div class="content">
                  <div class="title">VEHICLES</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ContractInformation
      :isCreate="true"
      ref="contract"
      v-show="isContractVisible"
    />

    <div class="row" v-show="isContractVisible">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <!-- Button group -->
              <div class="row justify-content-center">
                <button
                  class="btn btn-gradient-info btn-fw ml-2"
                  type="button"
                  v-on:click="changeTab('isTripVisible')"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- FIRST TRIP -->
    <TripPicker
      title="FIRST TRIP"
      ref="firstTrip"
      v-show="isTripVisible"
      :isUpdate="true"
      :endDateChange="
        () => {
          this.handleFirstTripDateChange();
        }
      "
    />
    <!-- RETURN TRIP -->
    <TripPicker
      title="RETURN TRIP"
      ref="returnTrip"
      v-show="isTripVisible && contract.roundTrip"
      :endDateChange="
        () => {
          this.handleTripTimeChange(2);
        }
      "
      :importLocation="
        () => {
          // Reverse locations arrays
          this.$refs.returnTrip.firstLocations = this.$refs.firstTrip.firstLocations;
          this.$refs.returnTrip.firstLocations = []
            .concat(this.$refs.returnTrip.firstLocations)
            .reverse();
        }
      "
    />
    <div class="row" v-show="isTripVisible">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <!-- Button group -->
              <div class="row justify-content-center">
                <button
                  class="btn btn-gradient-info btn-fw ml-2"
                  type="button"
                  v-on:click="changeTab('isVehicleVisible')"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Vehicle picker -->
    <VehiclePicker
      ref="firstVehiclePicker"
      title="FIRST TRIP VEHICLES"
      v-show="isVehicleVisible"
    />
    <!-- Vehicle picker  -->
    <VehiclePicker
      ref="returnVehiclePicker"
      title="RETURN TRIP VEHICLES"
      v-show="isVehicleVisible && contract.roundTrip"
    />
    <!-- User document -->
    <div class="row" v-if="isVehicleVisible">
      <!-- Confirm Group -->
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <!-- Button group -->
              <div class="row justify-content-center ">
                <div class="col-4">
                  <button
                    class="btn btn-gradient-danger btn-fw"
                    type="button"
                    v-on:click="changeTab('isContractVisible')"
                  >
                    Back
                  </button>
                  <button
                    class="btn btn-gradient-info btn-fw ml-2"
                    type="button"
                    v-on:click="create()"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import MessageModal from "../../components/Modal/MessageModal";
import Loading from "vue-loading-overlay";
import ContractInformation from "../../components/Contract/ContractInformation";
import TripPicker from "../../components/TripPicker";
import VehiclePicker from "../../components/Contract/VehiclePicker";
import moment from "moment";
import DirectionsRenderer from "../../components/Google/DirectionsRenderer";
export default {
  name: "CreateContract",
  components: {
    Loading,
    ContractInformation,
    TripPicker,
    MessageModal,
    // eslint-disable-next-line vue/no-unused-components
    DirectionsRenderer,
    VehiclePicker,
  },
  data() {
    return {
      isLoading: false,
      isCreatedSuccessfully: false,
      isError: false,
      errMsg: "",
      contract: "",
      documentExpiryDate: [],
      isContractVisible: true,
      isTripVisible: false,
      isVehicleVisible: false,

      isAddressModalVisible: false,
    };
  },
  mounted() {},
  methods: {
    // Map state
    ...mapActions("Contract", ["_create"]),
    async create() {
      this.isLoading = true;
      let isValid = false;
      // Get first trip
      let firstVehicles = this.$refs.firstVehiclePicker.getData();
      isValid = firstVehicles !== null && firstVehicles !== undefined;
      // If is round-trip
      if (this.contract.roundTrip) {
        let returnVehicles = this.$refs.returnVehiclePicker.getData();
        this.contract.trips[1].assignedVehicles = returnVehicles;
        isValid = returnVehicles !== null && firstVehicles !== undefined;
      }

      if (isValid) {
        this.contract.trips[0].assignedVehicles = firstVehicles;
        await this._create(this.contract)
          .then((res) => {
            if (res) {
              this.isCreatedSuccessfully = true;
            }
          })
          .catch((ex) => {
            if (ex.debugMessage) {
              this.isError = true;
              this.errMsg = ex.debugMessage;
            }
          });
        console.log(this.contract);
      }
      this.isLoading = false;
    },
    changeTab(step) {
      let isValid = this.$refs.contract.checkBasicInformation();
      // let isValid = false;
      if (!isValid) {
        document.getElementById("app").scrollIntoView();
        if (this.isContractVisible) {
          this.contract = this.$refs.contract.getData();
        }
        // Set max date for duration
        let currentDate = new Date();
        let durationFrom = new Date(this.contract.durationFrom);
        if (
          currentDate.getFullYear() === durationFrom.getFullYear() &&
          currentDate.getMonth() === durationFrom.getMonth() &&
          currentDate.getDate() === durationFrom.getDate()
        ) {
          this.$refs.firstTrip.minDateFrom = moment(currentDate).format(
            "YYYY-MM-DDTkk:mm"
          );
        } else {
          this.$refs.firstTrip.minDateFrom = moment(durationFrom).format(
            "YYYY-MM-DDTkk:mm"
          );
        }

        this.$refs.firstTrip.maxDateFrom = moment(
          new Date(this.contract.durationTo)
        ).format("YYYY-MM-DDTkk:mm");

        this.isContractVisible = step === "isContractVisible" ? true : false;
        this.isTripVisible = step === "isTripVisible" ? true : false;
        // Check contract trip
        if (step === "isVehicleVisible") {
          this.contract.trips = [];
          // Get first trip
          let firstTrip = this.$refs.firstTrip.getData();
          isValid = firstTrip !== null && firstTrip !== undefined;
          // If is round-trip
          if (this.contract.roundTrip) {
            let returnTrip = this.$refs.returnTrip.getData();
            isValid = returnTrip !== null && returnTrip !== undefined;
            if (isValid) {
              this.contract.trips.push(returnTrip);
            }
          }
          // isValid = false;
          if (isValid) {
            this.contract.trips.push(firstTrip);

            // Set min and max date for first trip vehicle picker
            this.$refs.firstVehiclePicker.startDate = this.contract.trips[0].departureTime;
            this.$refs.firstVehiclePicker.endDate = this.contract.trips[0].destinationTime;
            this.$refs.firstVehiclePicker.oldTotalPassengers = this.contract.estimatedPassengerCount;
            // -----------------------------------

            if (this.contract.roundTrip) {
              // Set min and max date for return trip vehicle picker
              this.$refs.returnVehiclePicker.startDate = this.contract.trips[1].departureTime;
              this.$refs.returnVehiclePicker.endDate = this.contract.trips[1].destinationTime;
              this.$refs.returnVehiclePicker.oldTotalPassengers = this.contract.estimatedPassengerCount;
              // -----------------------------------
            }

            this.isVehicleVisible = true;
          } else {
            this.isTripVisible = true;
          }
        } else {
          this.isVehicleVisible = false;
        }
      }
    },
    // first trip change
    handleFirstTripDateChange() {
      if (this.contract.roundTrip) {
        let firstTripDestinationTime = this.$refs.firstTrip.trip
          .destinationTime;
        this.$refs.returnTrip.trip.departureTime = "";
        // Set max date for duration
        this.$refs.returnTrip.minDateFrom = firstTripDestinationTime;
        this.$refs.returnTrip.maxDateFrom = moment(
          new Date(this.contract.durationTo)
        ).format("YYYY-MM-DDTkk:mm");
      }
      this.handleTripTimeChange(1);
    },
    // Handle trip time change
    handleTripTimeChange(trip) {
      if (trip === 1) {
        if (this.contract && this.contract.trips && this.contract.trips[0]) {
          if (
            this.contract.trips[0].destinationTime !==
            this.$refs.firstTrip.trip.destinationTime
          ) {
            this.$refs.firstVehiclePicker.vehiclesList = [];
          }
        }
      } else {
        if (this.contract && this.contract.trips && this.contract.trips[1]) {
          if (
            this.contract.trips[0].destinationTime !==
            this.$refs.returnVehiclePicker.trip.destinationTime
          ) {
            this.$refs.returnVehiclePicker.vehiclesList = [];
          }
        }
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.field label {
  margin-top: 10px !important;
}
.asterisk.icon {
  color: red;
}
.step i {
  color: #047edf !important;
}

.cus-select {
  padding-left: 26px !important;
}
.cus-disable {
  background-color: #858585 !important;
  color: white;
}
.ui.right.labeled {
  background-color: #3497e9;
  color: rgb(255, 255, 255);
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

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
          {{ this.$route.params.contractId }}
        </span>
      </h3>
    </div>
    <!-- Update Confirmation -->
    <Confirmation
      icon="edit outline"
      title="Update Confirmation"
      subTitle="Do you want to update this contract?"
      rightBtnTitle="Update"
      rightBtnIcon="check"
      rightBtnColor="blue"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="red"
      v-if="isUpdConVisible"
      :handleLeftBtn="
        () => {
          this.isUpdConVisible = !this.isUpdConVisible;
        }
      "
      :handleRightBtn="updateContract"
    />
    <!-- Error message -->
    <MessageModal
      title="Update Contract Fail!"
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
      title="Update Contract Successfully!"
      icon="check circle"
      :subTitle="`Contract is updated successfully!`"
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
    <div v-if="isUserLoading">
      <ContractInformation
        :propContract="contract"
        ref="contract"
        v-show="isContractVisible && contract"
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
    </div>

    <div v-if="isUserLoading">
      <!-- FIRST TRIP -->
      <TripPicker
        title="FIRST TRIP"
        ref="firstTrip"
        :isUpdate="true"
        :propTrip="contract.trips[0]"
        v-show="isTripVisible"
        :endDateChange="
          () => {
            this.handleFirstTripDateChange();
          }
        "
      />
      <div v-if="contract.roundTrip">
        <!-- RETURN TRIP -->
        <TripPicker
          title="RETURN TRIP"
          :isUpdate="true"
          ref="returnTrip"
          v-show="isTripVisible && contract.roundTrip"
          :propTrip="contract.trips[1]"
          :endDateChange="() => {}"
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
      </div>
    </div>
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
      :vehicles="contract.trips[0].assignedVehicles"
      v-if="isVehicleVisible"
    />
    <!-- Vehicle picker  -->
    <VehiclePicker
      ref="returnVehiclePicker"
      title="RETURN TRIP VEHICLES"
      :vehicles="contract.trips[1].assignedVehicles"
      v-if="isVehicleVisible && contract.roundTrip"
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
                    v-on:click="
                      () => {
                        this.isUpdConVisible = true;
                      }
                    "
                  >
                    Update
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
import Confirmation from "../../components/Modal/Confirmation";
import Loading from "vue-loading-overlay";
import ContractInformation from "../../components/Contract/ContractInformation";
import TripPicker from "../../components/TripPicker";
import VehiclePicker from "../../components/Contract/VehiclePicker";
import moment from "moment";
export default {
  name: "CreateContract",
  components: {
    Loading,
    ContractInformation,
    TripPicker,
    MessageModal,
    VehiclePicker,
    Confirmation,
  },
  data() {
    return {
      isLoading: false,
      isCreatedSuccessfully: false,
      isUpdConVisible: false,
      isUserLoading: false,
      isError: false,
      errMsg: "",
      contract: null,
      documentExpiryDate: [],
      isContractVisible: true,
      isTripVisible: false,
      isVehicleVisible: false,

      isAddressModalVisible: false,
    };
  },
  async mounted() {
    this.isLoading = true;
    await this.initContract();
    this.isUserLoading = true;
    this.isLoading = false;
  },
  methods: {
    // Map state
    ...mapActions("Contract", [
      "_create",
      "_getContractDetail",
      "_updateContract",
    ]),
    // Init contract
    async initContract() {
      await this._getContractDetail(this.$route.params.contractId).then(
        (res) => {
          this.contract = res;
        }
      );
    },
    async updateContract() {
      this.isLoading = true;
      this.isUpdConVisible = false;
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

        await this._updateContract(this.contract)
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
            console.error(ex);
          });
      }
      this.isLoading = false;
    },
    changeTab(step) {
      let isValid = this.$refs.contract.checkBasicInformation();
      // let isValid = false;
      if (!isValid) {
        this.contract = this.$refs.contract.getData();
        document.getElementById("app").scrollIntoView();
        this.isContractVisible = step === "isContractVisible" ? true : false;
        this.isTripVisible = step === "isTripVisible" ? true : false;
        // Set max date for duration
        this.$refs.firstTrip.minDateFrom = moment(
          new Date(this.contract.durationFrom)
        ).format("YYYY-MM-DDTkk:mm");
        this.$refs.firstTrip.maxDateFrom = moment(
          new Date(this.contract.durationTo)
        ).format("YYYY-MM-DDTkk:mm");
        // - - - - - - - - - - - - -
        if (this.$refs.contract.isChange) {
          this.$refs.firstTrip.trip.departureTime = "";
        }

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
            this.isVehicleVisible = true;
            console.log(this.contract);
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

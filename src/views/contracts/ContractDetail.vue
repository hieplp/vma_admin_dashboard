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
          Contract Detail
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
      :subTitle="`Contract is updated successfully!`"
      :proFunc="
        () => {
          this.isCreatedSuccessfully = !this.isCreatedSuccessfully;
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
    </div>

    <div v-if="isUserLoading">
      <!-- FIRST TRIP -->
      <TripPicker
        title="FIRST TRIP"
        ref="firstTrip"
        :propTrip="contract.trips[0]"
        v-show="isTripVisible"
        :endDateChange="
          () => {
            this.$refs.returnTrip.trip.departureTime = '';
            this.$refs.returnTrip.trip.destinationTime = '';
            this.$refs.returnTrip.maxDate = this.$refs.firstTrip.trip.destinationTime;
          }
        "
      />
      <div v-if="contract.trips.length == 2">
        <!-- RETURN TRIP -->
        <TripPicker
          title="RETURN TRIP"
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

    <Vehicles
      :contractId="contract.contractId"
      :contract="contract"
      v-if="isVehicleVisible && contract && contract.contractId"
    />

    <!-- User document -->
    <div class="row" v-show="isTripVisible">
      <!-- Confirm Group -->
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <!-- Button group -->
              <div class="row justify-content-center mt-5">
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
import { isNumber } from "../../assets/js/input.js";
import MessageModal from "../../components/Modal/MessageModal";
import Confirmation from "../../components/Modal/Confirmation";
import Loading from "vue-loading-overlay";
import ContractInformation from "../../components/Contract/ReadonlyContractInformation";
import TripPicker from "../../components/TripPicker";
import Vehicles from "../../components/Contract/Vehicles";

export default {
  name: "CreateContract",
  components: {
    Loading,
    ContractInformation,
    TripPicker,
    MessageModal,
    Confirmation,
    Vehicles,
  },
  data() {
    return {
      isLoading: false,
      isCreatedSuccessfully: false,
      isError: false,
      errMsg: "",
      contract: null,
      documentExpiryDate: [],
      isContractVisible: true,
      isTripVisible: false,
      isUpdConVisible: false,
      isVehicleVisible: false,

      isUserLoading: false,

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
    ...mapActions("Contract", ["_updateContract", "_getContractDetail"]),
    // Init contract
    async initContract() {
      await this._getContractDetail(this.$route.params.contractId).then(
        (res) => {
          this.contract = res;
        }
      );
    },
    //
    // Update
    cancelUpdate() {
      this.$refs.contract.initContract();
    },
    async updateContract() {
      this.isLoading = true;
      this.isUpdConVisible = false;
      let isValid = this.$refs.contract.checkBasicInformation();
      // let isValid = false;
      // this.contract.trips = [];
      // // Get first trip
      // let firstTrip = this.$refs.firstTrip.getData();
      // this.contract.trips.push(firstTrip);
      // isValid = firstTrip !== null;
      // // If is round-trip
      // if (this.contract.roundTrip) {
      //   let returnTrip = this.$refs.returnTrip.getData();
      //   this.contract.trips.push(returnTrip);
      //   isValid = returnTrip !== null;
      // }
      if (!isValid) {
        this.contract = this.$refs.contract.getData();
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
      // let isValid = false;
      document.getElementById("app").scrollIntoView();
      this.isContractVisible = step === "isContractVisible" ? true : false;
      this.isTripVisible = step === "isTripVisible" ? true : false;
      this.isVehicleVisible = step === "isVehicleVisible" ? true : false;
    },

    // Vehicle Owner
    handleVehicleOwnerModal() {
      this.isOwnerModalVisible = !this.isOwnerModalVisible;
    },
    // Get vehicle owner
    getVehicleOwner() {
      this.owner = this.$refs.ownerModal.getSelectedCustomer();
      this.handleVehicleOwnerModal();
    },

    isNumber(evt) {
      isNumber(evt);
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

.upload-photo {
  opacity: 0;
  position: absolute;
  z-index: -1;
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

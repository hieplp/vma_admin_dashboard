<template>
  <div>
    <CustomersModal
      v-show="isOwnerModalVisible"
      :cancelFunction="handleVehicleOwnerModal"
      :doneFunction="getVehicleOwner"
      :userId="owner.userId"
      ref="ownerModal"
    />
    <div class="row" v-if="isLoading">
      <!-- BASIC INFORMAION -->
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <h4 class="ui dividing header">BASIC INFORMAION</h4>

              <div class="two fields">
                <!-- Duration From -->
                <div class="field">
                  <label>Duration From</label>
                  <div class="ui corner labeled input">
                    <input
                      type="date"
                      v-model="contract.durationFrom"
                      :min="currentDate"
                      @change="durationToChange"
                      placeholder="Duration From"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="durationFromErr"
                  >
                    Duration from is required!
                  </div>
                </div>
                <!-- Duration To-->
                <div class="field">
                  <label>Duration To</label>
                  <div class="ui corner labeled input">
                    <input
                      type="date"
                      v-model="contract.durationTo"
                      :min="maxDurationTo"
                      :readonly="!contract.durationFrom"
                      placeholder="Duration To"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div class="ui pointing red basic label" v-if="durationToErr">
                    Duration to is required!
                  </div>
                </div>
                <!-- Signed Date-->
                <div class="field">
                  <label>Signed Date</label>
                  <div class="ui corner labeled input">
                    <input
                      type="date"
                      v-model="contract.signedDate"
                      :max="maxDate"
                      placeholder="Signed Date"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div class="ui pointing red basic label" v-if="signedDateErr">
                    Signed date is required!
                  </div>
                </div>
              </div>
              <div class="two fields">
                <!-- Estimated Passenger Count -->
                <div class="field">
                  <label>Passenger Count</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="contract.passengerCount"
                      placeholder="Estimated Passenger Count"
                      @keypress="isNumber($event)"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="passengerCountErr"
                  >
                    Passenger Count is required!
                  </div>
                </div>
                <!-- Vehicle Count -->
                <div class="field">
                  <label>Vehicle Count</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="contract.vehicleCount"
                      placeholder="Estimated Vehicle Count"
                      @keypress="isNumber($event)"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="vehicleCountErr"
                  >
                    Vehicle Count is required!
                  </div>
                </div>
                <!-- Trip type -->
                <div class="field">
                  <label>Type</label>
                  <div class="ui corner labeled input ">
                    <select v-model="contract.roundTrip" class="cus-select">
                      <option :value="false">One-way</option>
                      <option :value="true">Round-trip</option>
                    </select>
                    <div class="ui corner left label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                </div>
                <!-- Owner-->
                <div class="field">
                  <label>Owner</label>
                  <div class="ui action input">
                    <input
                      v-model="owner.fullName"
                      type="text"
                      readonly
                      placeholder="Pick an owner"
                    />
                    <button
                      class="ui right labeled icon button"
                      @click="handleVehicleOwnerModal"
                    >
                      <i class="users icon"></i>
                      Pick
                    </button>
                  </div>
                  <div class="ui pointing red basic label" v-if="ownerErr">
                    Owner is required!
                  </div>
                </div>
              </div>

              <!-- Description-->
              <div class="field">
                <label>Description</label>
                <div class="ui corner labeled input">
                  <textarea
                    type="text"
                    v-model="contract.otherInformation"
                    placeholder="Description"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Address
      title="SIGNED LOCATION"
      :propAddress="contract.signedLocation"
      v-if="contract.signedLocation || isCreate"
      ref="signedLocation"
    />
  </div>
</template>

<script>
import { isNumber } from "../../assets/js/input.js";
import Address from "../Address";
import CustomersModal from "../../components/Modal/CustomersModal";
import moment from "moment";

export default {
  props: {
    propContract: Object,
    isCreate: Boolean,
    changeDurationFrom: Function,
    changeDurationTo: Function,
  },
  components: {
    Address,
    CustomersModal,
  },
  data() {
    return {
      contract: {
        contractId: "",
        contractOwnerId: "",
        durationFrom: "",
        durationTo: "",
        otherInformation: "",
        signedDate: "",
        signedLocation: "",
        totalPrice: "",
        passengerCount: "",
        vehicleCount: "",
        roundTrip: false,
        trips: [],
        contractOwner: "",
      },

      // Basic Information Error
      ownerErr: false,
      departureTimeErr: false,
      destinationTimeErr: false,
      durationFromErr: false,
      durationToErr: false,
      otherInformationErr: false,
      signedDateErr: false,
      totalPriceErr: false,
      passengerCountErr: false,
      vehicleCountErr: false,

      isLoading: false,
      isCreatedSuccessfully: false,
      isError: false,
      errMsg: "",

      // Vehicle Owner
      isOwnerModalVisible: false,
      // Owner
      owner: {
        userId: "",
        fullName: "",
      },
      currentDate: "",
      maxDate: "",
      currentDateTime: "",
      isChange: false,
    };
  },
  mounted() {
    this.currentDate = moment(new Date()).format("YYYY-MM-DD");
    if (this.propContract) {
      this.initContract();
    }
    this.maxDate = moment(new Date()).format("YYYY-MM-DD");
    this.isLoading = true;
  },
  computed: {
    maxDurationTo() {
      return moment(this.contract.durationFrom, "YYYY-MM-DD")
        .add(1, "days")
        .format("YYYY-MM-DD");
    },
  },

  methods: {
    // Init contract
    initContract() {
      let cloneContract = Object.assign({}, this.propContract);
      this.contract = this.copyProperties(cloneContract, this.contract);

      this.initOwner(cloneContract.contractOwner);
      this.moneyInput();
    },
    // Init owner
    initOwner(contractOwner) {
      this.owner.userId = contractOwner.userId;
      this.owner.fullName = contractOwner.userName;
    },
    copyProperties(src, to) {
      let toKeys = Object.keys(to);

      for (let index = 0; index < toKeys.length; index++) {
        to[toKeys[index]] = src[toKeys[index]];
      }
      return to;
    },

    // Cheack basic information
    checkBasicInformation() {
      this.durationFromErr = this.contract.durationFrom.length === 0;
      this.durationToErr = this.contract.durationTo.length === 0;
      this.signedDateErr = this.contract.signedDate.length === 0;
      // this.totalPriceErr = this.contract.totalPrice.length === 0;
      this.passengerCountErr = this.contract.passengerCount.length === 0;
      this.vehicleCountErr = this.contract.vehicleCount.length === 0;
      let signedLocationErr = this.$refs.signedLocation.checkValid();
      this.ownerErr = this.owner.userId.length === 0;
      return (
        this.durationFromErr ||
        this.durationToErr ||
        this.signedDateErr ||
        this.totalPriceErr ||
        signedLocationErr ||
        this.passengerCountErr ||
        this.vehicleCountErr ||
        this.ownerErr
      );
    },
    durationToChange() {
      this.contract.durationTo = "";
      this.isChange = true;
    },
    // Get contract data
    getData() {
      let contract = Object.assign({}, this.contract);

      contract.signedLocation = this.$refs.signedLocation.getAdress();
      contract.contractOwnerId = this.owner.userId;
      contract.totalPrice = contract.totalPrice.replace(/\D/g, "");
      return contract;
    },
    // Cancel
    cancel() {
      if (this.propContract) {
        this.contract = this.propContract;
      } else {
        this.contract = {
          contractId: "",
          contractOwnerId: "",
          departureLocation: "",
          departureTime: "",
          destinationTime: "",
          durationFrom: "",
          durationTo: "",
          otherInformation: "",
          signedDate: "",
          signedLocation: "",
          totalPrice: "",
          passengerCount: 0,
          vehicleCount: 0,
        };
      }
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
    // Money input
    moneyInput() {
      this.contract.totalPrice = this.contract.totalPrice
        .toString()
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

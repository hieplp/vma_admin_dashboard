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
                      :min="contract.durationFrom"
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
                  <label>Estimated Passenger Count</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="contract.estimatedPassengerCount"
                      placeholder="Estimated Passenger Count"
                      @keypress="isNumber($event)"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="estimatedPassengerCountErr"
                  >
                    Estimated Passenger Count is required!
                  </div>
                </div>
                <!-- Estimated Vehicle Count -->
                <div class="field">
                  <label>Estimated Vehicle Count</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="contract.estimatedVehicleCount"
                      placeholder="Estimated Vehicle Count"
                      @keypress="isNumber($event)"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="estimatedVehicleCountErr"
                  >
                    Estimated Vehicle Count is required!
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
                  <div
                    class="ui pointing red basic label"
                    v-if="estimatedVehicleCountErr"
                  >
                    Estimated Vehicle Count is required!
                  </div>
                </div>
              </div>
              <div class="two fields">
                <!-- Total Price -->
                <div class="field">
                  <label>Total Price</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="contract.totalPrice"
                      placeholder="Total Price"
                      @keypress="isNumber($event)"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div class="ui pointing red basic label" v-if="totalPriceErr">
                    Total price is required!
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

export default {
  props: {
    propContract: Object,
    isCreate: Boolean,
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
        estimatedPassengerCount: "",
        estimatedVehicleCount: "",
        roundTrip: false,
        trips: [],
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
      estimatedPassengerCountErr: false,
      estimatedVehicleCountErr: false,

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
      currentDateTime: "",
    };
  },
  mounted() {
    if (this.propContract) {
      this.initContract();
    }
    this.isLoading = true;
  },
  methods: {
    // Init contract
    initContract() {
      this.contract = this.copyProperties(this.propContract, this.contract);
      this.initOwner(this.propContract.contractOwner);
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
      this.totalPriceErr = this.contract.totalPrice.length === 0;
      this.estimatedPassengerCountErr =
        this.contract.estimatedPassengerCount.length === 0;
      this.estimatedVehicleCountErr =
        this.contract.estimatedVehicleCount.length === 0;
      let signedLocationErr = this.$refs.signedLocation.checkValid();
      this.ownerErr = this.owner.userId.length === 0;
      return (
        this.durationFromErr ||
        this.durationToErr ||
        this.signedDateErr ||
        this.totalPriceErr ||
        signedLocationErr ||
        this.estimatedPassengerCountErr ||
        this.estimatedVehicleCountErr ||
        this.ownerErr
      );
    },
    // Get contract data
    getData() {
      let contract = Object.assign({}, this.contract);

      contract.signedLocation = this.$refs.signedLocation.getAdress();
      contract.contractOwnerId = this.owner.userId;

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
          estimatedPassengerCount: 0,
          estimatedVehicleCount: 0,
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

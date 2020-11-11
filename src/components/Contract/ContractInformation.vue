<template>
  <div>
    <CustomersModal
      v-show="isOwnerModalVisible"
      :cancelFunction="handleVehicleOwnerModal"
      :doneFunction="getVehicleOwner"
      :userId="owner.userId"
      ref="ownerModal"
    />
    <div class="row">
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
                <!-- Total Price -->
                <div class="field">
                  <label>Total Price</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="contract.totalPrice"
                      placeholder="Total Price"
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
      <!-- DEPARTURE/DESTINATION TIME -->
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <h4 class="ui dividing header">DEPARTURE/DESTINATION TIME</h4>
              <div class="two fields">
                <!-- Departure Time -->
                <div class="field">
                  <label>Departure Time</label>
                  <div class="ui corner labeled input">
                    <input
                      type="datetime-local"
                      v-model="contract.departureTime"
                      placeholder="Departure Time"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="departureTimeErr"
                  >
                    Departure time is required!
                  </div>
                </div>
                <!-- Destination Time-->
                <div class="field ">
                  <label>Destination Time</label>
                  <div class="ui corner labeled input">
                    <input
                      type="datetime-local"
                      name="Salary"
                      v-model="contract.destinationTime"
                      :min="contract.departureTime"
                      :readonly="!contract.departureTime"
                      placeholder=" Destination Time"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="destinationTimeErr"
                  >
                    Destination Time is required!
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
    <Address
      title="DEPARTURE LOCATION"
      :propAddress="contract.departureLocation"
      v-if="contract.departureLocation || isCreate"
      ref="departureLocation"
    />
    <Address
      title="DESTINATION LOCATION"
      :propAddress="contract.destinationLocation"
      v-if="contract.destinationLocation || isCreate"
      ref="destinationLocation"
    />
  </div>
</template>

<script>
import { isNumber } from "../../assets/js/input.js";
// import * as firebase from "firebase";
import moment from "moment";
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
        departureLocation: "",
        departureTime: "",
        destinationLocation: "",
        destinationTime: "",
        durationFrom: "",
        durationTo: "",
        otherInformation: "",
        signedDate: "",
        signedLocation: "",
        totalPrice: "",
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
    };
  },
  async mounted() {
    if (this.propContract) {
      this.initContract();
    }
  },
  methods: {
    // Init contract
    initContract() {
      this.contract = this.copyProperties(this.propContract, this.contract);
      // Format departure and destination time
      this.contract.departureTime = moment(this.contract.departureTime).format(
        "YYYY-MM-DDTkk:mm"
      );
      this.contract.destinationTime = moment(
        this.contract.destinationTime
      ).format("YYYY-MM-DDTkk:mm");
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
      this.departureTimeErr = this.contract.departureTime.length === 0;
      this.destinationTimeErr = this.contract.destinationTime.length === 0;
      let signedLocationErr = this.$refs.signedLocation.checkValid();
      let departureLocationErr = this.$refs.departureLocation.checkValid();
      let destinationLocationErr = this.$refs.destinationLocation.checkValid();
      return (
        this.durationFromErr ||
        this.durationToErr ||
        this.signedDateErr ||
        this.totalPriceErr ||
        this.departureTimeErr ||
        this.destinationTimeErr ||
        signedLocationErr ||
        departureLocationErr ||
        destinationLocationErr
      );
    },
    // Get contract data
    getData() {
      let contract = Object.assign({}, this.contract);
      // Format date
      contract.departureTime = moment(contract.departureTime).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      contract.destinationTime = moment(contract.destinationTime).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      contract.signedLocation = this.$refs.signedLocation.getAdress();
      contract.departureLocation = this.$refs.departureLocation.getAdress();
      contract.destinationLocation = this.$refs.destinationLocation.getAdress();
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
          destinationLocation: "",
          destinationTime: "",
          durationFrom: "",
          durationTo: "",
          otherInformation: "",
          signedDate: "",
          signedLocation: "",
          totalPrice: "",
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

.cus-modal .header {
  color: white;
  font-size: 35px !important;
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
<style>
@import "../../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

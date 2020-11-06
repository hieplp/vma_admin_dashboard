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
    <!-- Error modal -->
    <div
      class="ui basic cus-modal justify-content-center"
      v-if="isCreatedSuccessfully"
    >
      <div class="ui icon header col-12">
        <i class="user plus icon mb-3"></i>
        Create Contract Successfully!
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>
          Contrac is created successfully!
        </h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <router-link to="/contracts" class="ui blue primary button">
          <i class="checkmark icon"></i>
          Continue
        </router-link>
      </div>
    </div>

    <div class="ui basic cus-modal justify-content-center" v-if="isError">
      <div class="ui icon header col-12">
        <i class="frown outline icon mb-3"></i>
        Create Contract Fail!
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>
          {{ this.errMsg }}
        </h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <button @click="isError = !isError" class="ui blue primary button">
          <i class="checkmark icon"></i>
          Ok
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui two steps">
              <button
                class="step"
                v-on:click="changeTab()"
                v-bind:class="{ active: isUserInfoVisible }"
              >
                <i class="flag checkered icon"></i>
                <div class="content">
                  <div class="title">CONTRACT INFORMATION</div>
                </div>
              </button>
              <button
                class="step"
                v-on:click="changeTab()"
                v-bind:class="{ active: !isUserInfoVisible }"
              >
                <i class="bus icon"></i>
                <div class="content">
                  <div class="title">VEHICLE</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CustomersModal
      v-show="isOwnerModalVisible"
      :cancelFunction="handleVehicleOwnerModal"
      :doneFunction="getVehicleOwner"
      :userId="owner.userId"
      ref="ownerModal"
    />

    <div class="row" v-if="isUserInfoVisible">
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
      :visible="isUserInfoVisible"
      ref="signedLocation"
    />
    <Address
      title="DEPARTURE LOCATION"
      :visible="isUserInfoVisible"
      ref="departureLocation"
    />
    <Address
      title="DESTINATION LOCATION"
      :visible="isUserInfoVisible"
      ref="destinationLocation"
    />
    <div class="row" v-if="isUserInfoVisible">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <!-- Button group -->
              <div class="row justify-content-center">
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

    <!-- User document -->
    <div class="row" v-if="!isUserInfoVisible">
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
                    v-on:click="changeTab()"
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
import { isNumber } from "../../assets/js/input.js";
// import * as firebase from "firebase";
import Loading from "vue-loading-overlay";
import moment from "moment";
import Address from "../../components/Address";
import CustomersModal from "../../components/Modal/CustomersModal";

import { RepositoryFactory } from "../../repositories/RepositoryFactory";
const ContractRepository = RepositoryFactory.get("contracts");

export default {
  name: "CreateContract",
  components: {
    Loading,
    Address,
    CustomersModal,
  },
  data() {
    return {
      contract: {
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
      // Profile image
      isUserInfoVisible: true,

      // Basic Information Error
      ownerErr: false,
      departureTimeErr: false,
      destinationTimeErr: false,
      durationFromErr: false,
      durationToErr: false,
      otherInformationErr: false,
      signedDateErr: false,
      totalPriceErr: false,

      maxBirthDate: "",
      isLoading: false,
      isCreatedSuccessfully: false,
      isError: false,
      errMsg: "",

      // address
      cities: [],
      selectedCity: {
        name: "",
      },
      districts: [],
      selectedDistrict: {
        name: "",
      },
      wards: [],
      selectedWard: {
        name: "",
      },
      drivingLicenseTypes: [],
      selectedDrivingLicenseTypes: {
        name: "",
      },
      documentExpiryDate: [],

      // Vehicle Owner
      isOwnerModalVisible: false,
      // Owner
      owner: {
        userId: "",
        fullName: "",
      },
    };
  },
  mounted() {
    let today = new Date();
    // Init max birthdate = current year - 18
    this.maxBirthDate =
      today.getFullYear() -
      18 +
      "-" +
      (today.getMonth() > 10 ? "" : "0") +
      today.getMonth() +
      "-" +
      (today.getDate() > 10 ? "" : "0") +
      today.getDate();
  },
  methods: {
    getExpiryDate(date, ex) {
      let dateArr = date.split("-");
      return Number(dateArr[0]) + ex + "-" + dateArr[1] + "-" + dateArr[2];
    },

    getDepartureLocation(address) {
      console.log(address);
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
    async create() {
      let isValid = this.checkBasicInformation();
      if (!isValid) {
        this.isLoading = true;
        // Format date
        this.contract.departureTime = moment(
          this.contract.departureTime
        ).format("YYYY-MM-DD HH:mm:ss");
        this.contract.destinationTime = moment(
          this.contract.destinationTime
        ).format("YYYY-MM-DD HH:mm:ss");

        this.contract.signedLocation = this.$refs.signedLocation.getAdress();
        this.contract.departureLocation = this.$refs.departureLocation.getAdress();
        this.contract.destinationLocation = this.$refs.destinationLocation.getAdress();
        this.contract.contractOwnerId = this.owner.userId;
        console.log(this.contract);
        await ContractRepository.create(this.contract)
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
        this.isLoading = false;
      }
    },
    changeTab() {
      let isValid = this.checkBasicInformation();
      // let isValid = false;
      if (!isValid) {
        document.getElementById("app").scrollIntoView();
        this.isUserInfoVisible = !this.isUserInfoVisible;
      }
    },
    // Vehicle Owner
    handleVehicleOwnerModal() {
      this.isOwnerModalVisible = !this.isOwnerModalVisible;
    },
    // Get vehicle owner
    getVehicleOwner() {
      this.owner = this.$refs.ownerModal.getSelectedCustomer();
      console.log(this.owner);
      this.handleVehicleOwnerModal();
    },
    isNumber(evt) {
      isNumber(evt);
    },
    // Check Phone input
    phoneInput() {
      var x = this.contract.departureTime
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      if (x[1].charAt(0) !== "0" && x[1].length != 0) {
        x[1] = "0" + x[1];
      }
      this.contract.departureTime = !x[2]
        ? x[1]
        : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
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
.preview-img {
  position: relative;
}
.close-btn {
  position: absolute;
  top: 0%;
  right: 8%;
  color: red;
  font-size: 30px;
  background-color: transparent;
  border: none;
  visibility: hidden;
}
.preview-img:hover > .close-btn {
  visibility: visible;
}

.upload-photo {
  opacity: 0;
  position: absolute;
  z-index: -1;
}
.step i {
  color: #047edf !important;
}
/* Upload profile img */
.upload-pro {
  position: relative;
}
.upload-pro:hover > .upload-pro-plus {
  cursor: pointer;
  visibility: visible;
}

.upload-pro img {
  border-radius: 50%;
  width: 280px !important;
  height: 280px !important;
}
.upload-pro-plus {
  position: absolute;
  z-index: 1000;
  background-color: rgba(221, 209, 209, 0.5);
  color: rgb(138, 135, 135);
  width: 100%;
  height: 100%;
  top: 0%;
  left: 0%;
  font-size: 80px;
  border-radius: 55%;
  visibility: hidden;
}
.upload-pro-plus i {
  position: absolute;
  left: 35%;
  top: 35%;
}

.cus-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(92, 90, 87, 0.637);
  z-index: 10000;
  width: 100%;
  height: 100%;
  padding-top: 12%;
  color: white;
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

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

    <ContractInformation :isCreate="true" />

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
import ContractInformation from "../../components/Contract/ContractInformation";

import { RepositoryFactory } from "../../repositories/RepositoryFactory";
const ContractRepository = RepositoryFactory.get("contracts");

export default {
  name: "CreateContract",
  components: {
    Loading,
    ContractInformation,
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

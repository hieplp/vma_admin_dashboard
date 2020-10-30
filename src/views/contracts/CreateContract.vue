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
          Contract with name {{ this.contract.departureLocation }} is created
          successfully!
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

    <div class="row" v-if="isUserInfoVisible">
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
                    v-if="isDepartureTimeErr"
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
                    v-if="isDestinationTimeErr"
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
    <Address title="DEPARTURE LOCATION" :visible="isUserInfoVisible" />
    <Address title="DESTINATION LOCATION" :visible="isUserInfoVisible" />
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
                  v-on:click="changeTab()"
                >
                  Continue
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
// import moment from "moment";
import Address from "../../components/Address";

// import { RepositoryFactory } from "../../repositories/RepositoryFactory";
// const ContractRepository = RepositoryFactory.get("contracts");

export default {
  name: "CreateContract",
  components: {
    Loading,
    Address,
  },
  data() {
    return {
      contract: {
        userId: "",
        departureLocation: "",
        address: "",
        departureTime: "",
        gender: true,
        destinationLocation: "",
        imageLink: "",
        baseSalary: "",
        userStatusId: 2,
        userDocumentReqList: [
          // Indentify Card
          {
            userDocumentId: "",
            userDocumentTypeId: "1",
            registeredLocation: "",
            registeredDate: "",
            expiryDate: "",
            otherInformation: "",
            documentImagesReqList: [],
          },
          //  Health Insurance
          {
            userDocumentId: "",
            userDocumentTypeId: "2",
            registeredLocation: "",
            registeredDate: "",
            expiryDate: "",
            otherInformation: "",
            documentImagesReqList: [],
          },
          // Driving License
          {
            userDocumentId: "",
            userDocumentTypeId: "3",
            registeredLocation: "",
            registeredDate: "",
            expiryDate: "",
            otherInformation: "",
            documentImagesReqList: [],
          },
        ],
      },
      // Profile image
      profileImage: null,
      profileImagePrev: null,
      isUserInfoVisible: true,
      uploadValue: 0,
      img1: null,
      imageData: null,
      // Indentify image
      indentifyImage: [],
      indentifyImagePrev: [],
      // Health Insurance
      healthInsuranceImage: [],
      healthInsuranceImagePrev: [],
      // Driving License
      drivingLicenseImage: [],
      drivingLicenseImagePrev: [],
      // Basic Information Error
      isDepartureLocationErr: false,
      isDepartureTimeErr: false,
      isDestinationLocationErr: false,
      isDestinationTimeErr: false,
      isUserImgErr: false,
      // Address error
      isAddressErr: false,
      isWardErr: false,
      isDistrictErr: false,
      isCityErr: false,

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
      this.isDepartureLocationErr =
        this.contract.departureLocation.length === 0;
      this.isAddressErr = this.contract.address.length === 0;
      this.isWardErr = this.selectedWard.name.length === 0;
      this.isDistrictErr = this.selectedDistrict.name.length === 0;
      this.isCityErr = this.selectedCity.name.length === 0;
      this.isDepartureTimeErr =
        this.contract.departureTime
          .replace("(", "")
          .replace(")", "")
          .replace(" ", "")
          .replace("-", "").length !== 10;
      this.isDestinationLocationErr =
        this.contract.destinationLocation.length === 0;
      this.isDestinationTimeErr = this.contract.baseSalary.length === 0;
      this.isUserImgErr =
        this.profileImage === null || this.profileImage === null;
      return (
        this.isDepartureLocationErr ||
        this.isAddressErr ||
        this.isDepartureTimeErr ||
        this.isDestinationLocationErr ||
        this.isDestinationTimeErr ||
        this.isWardErr ||
        this.isDistrictErr ||
        this.isCityErr ||
        this.isUserImgErr
      );
    },

    changeTab() {
      let isValid = this.checkBasicInformation();
      // let isValid = false;
      if (!isValid) {
        document.getElementById("app").scrollIntoView();
        this.isUserInfoVisible = !this.isUserInfoVisible;
      }
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
</style>
<style>
@import "../../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

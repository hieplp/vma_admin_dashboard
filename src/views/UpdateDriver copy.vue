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
        <router-link to="/drivers">
          Drivers
        </router-link>
        <span class="text-secondary">/</span>
        <span>
          Create Driver
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
        Create Driver Successfully!
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>
          Driver with name {{ this.driver.fullName }} is created successfully!
        </h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <router-link to="/drivers" class="ui blue primary button">
          <i class="checkmark icon"></i>
          Continue
        </router-link>
      </div>
    </div>

    <div class="ui basic cus-modal justify-content-center" v-if="isError">
      <div class="ui icon header col-12">
        <i class="frown outline icon mb-3"></i>
        Create Driver Fail!
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
                <i class="mdi mdi-account-box icon"></i>
                <div class="content">
                  <div class="title">Basic Information</div>
                </div>
              </button>
              <button
                class="step"
                v-on:click="changeTab()"
                v-bind:class="{ active: !isUserInfoVisible }"
              >
                <i class="mdi mdi-file-document icon"></i>
                <div class="content">
                  <div class="title">Document</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- User Information -->
    <div class="row" v-if="isUserInfoVisible">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <h4 class="ui dividing header">Basic Information</h4>

              <div class="field">
                <label>Profile image</label>
              </div>
              <div class="row justify-content-center">
                <label for="up-pro-pho" class="upload-pro">
                  <img
                    :src="driver.imageLink"
                    class="ui medium circular image pro-img"
                    alt="image"
                    v-if="
                      driver.imageLink !== null && driver.imageLink.length > 0
                    "
                  />
                  <img
                    src="../assets/images/unnamed.png"
                    class="ui medium circular image pro-img"
                    alt="image"
                    v-else-if="profileImagePrev == null"
                  />
                  <img
                    :src="profileImagePrev"
                    class="ui medium circular image pro-img"
                    alt="image"
                    v-else
                  />
                  <div class="upload-pro-plus ">
                    <i class="mdi mdi-plus"></i>
                  </div>
                </label>
                <input
                  class="upload-photo"
                  id="up-pro-pho"
                  type="file"
                  accept="image/*"
                  @change="uploadProfile($event)"
                />
              </div>
              <div class="row justify-content-center" v-if="isUserImgErr">
                <div class="ui pointing red basic label justify-content-center">
                  User image is required!
                </div>
              </div>

              <div class="two fields mt-4">
                <!-- Full name -->
                <div class="field">
                  <label>Full Name</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="driver.fullName"
                      name="Name"
                      placeholder="Full name"
                      maxlength="50"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div class="ui pointing red basic label" v-if="isFullNameErr">
                    Full name is required!
                  </div>
                </div>
                <!-- Address -->
                <div class="field">
                  <label>Address</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="driver.address"
                      placeholder="Address"
                      maxlength="100"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div class="ui pointing red basic label" v-if="isAddressErr">
                    Address is required!
                  </div>
                </div>
              </div>
              <div class="two fields">
                <!-- Gender  -->
                <div class="field">
                  <label>Gender</label>
                  <select class="ui fluid dropdown" v-model="driver.gender">
                    <option value="1">Male</option>
                    <option value="0">Female</option>
                  </select>
                </div>
                <!-- Phone number -->
                <div class="field">
                  <label>Phone Number</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      name="Phone Number"
                      v-model="driver.phoneNumber"
                      placeholder="Phone Number: (0xx) xxx-xxxx"
                      @input="phoneInput"
                      maxlength="14"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="isPhoneNumberErr"
                  >
                    Phone number is required 10 digits!
                  </div>
                </div>
              </div>
              <div class="two fields">
                <!-- Birthdate -->
                <div class="field">
                  <label>Birthdate</label>
                  <div class="ui corner labeled input">
                    <input
                      type="date"
                      v-model="driver.dateOfBirth"
                      :max="maxBirthDate"
                      class="form-control"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="isBirthDateErr"
                  >
                    Birthdate is required!
                  </div>
                </div>
                <!-- Base Salary -->
                <div class="field ">
                  <label>Base Salary</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      name="Salary"
                      v-model="driver.baseSalary"
                      placeholder="Basic Salary"
                      @keypress="isNumber($event)"
                      min="1"
                      step="any"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="isBirthDateErr"
                  >
                    Base salary is required!
                  </div>
                </div>
              </div>
              <!-- Button group -->
              <div class="row justify-content-center mt-5">
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
    <div class="row" v-else>
      <!-- Indentify Card -->
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <h4 class="ui dividing header">Indentify Card</h4>
              <div class="field justify-content-center">
                <label class="mb-4">Images</label>
                <div class="row">
                  <div
                    class="col-3 preview-img mb-3"
                    v-for="(img, index) in indentifyImagePrev"
                    :key="index"
                  >
                    <img :src="img" class="ui large image" />
                    <button
                      class="close-btn"
                      v-on:click="removeImage(index, 'indentifyImage')"
                    >
                      <i class="mdi mdi-close-circle"></i>
                    </button>
                  </div>
                </div>
                <div
                  class="ui pointing below red basic label"
                  v-if="indentify.imageErr"
                >
                  Image is required!
                </div>
                <div class="ui corner labeled input">
                  <label
                    class="btn btn-gradient-info btn-icon-text"
                    for="upload-photo"
                  >
                    <i class="mdi mdi-upload btn-icon-prepend" />Select image...
                  </label>
                  <input
                    ref="indentifyID"
                    class="upload-photo"
                    id="upload-photo"
                    type="file"
                    accept="image/*"
                    @change="uploadImage($event, 'indentifyImage')"
                  />
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>Indentify ID</label>
                  <div class="ui corner labeled input">
                    <input
                      v-model="indentifyInfor.userDocumentId"
                      type="text"
                      name="Name"
                      placeholder="Indentify ID"
                      @keypress="isNumber($event)"
                      maxlength="12"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="indentify.documentIdErr"
                  >
                    Indentify ID is required 9 or 12 digits!
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="indentify.documentDupErr"
                  >
                    Indentify ID is duplicated!
                  </div>
                </div>
                <div class="field">
                  <label>Register Location</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="indentifyInfor.registerLocation"
                      placeholder="Register location"
                      maxlength="100"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="indentify.registerLocationErr"
                  >
                    Register location is required!
                  </div>
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>Register Date</label>
                  <div class="ui corner labeled input">
                    <input
                      type="date"
                      v-model="indentifyInfor.registerDate"
                      class="form-control"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="indentify.registerDateErr"
                  >
                    Register date is required!
                  </div>
                </div>
                <div class="field">
                  <label>Expiry Date</label>
                  <div class="ui corner labeled input">
                    <input
                      type="date"
                      class="form-control"
                      v-model="indentifyInfor.expiryDate"
                      :min="indentifyInfor.registerDate"
                      :disabled="indentifyInfor.registerDate.length === 0"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="indentify.expiryDateErr"
                  >
                    Expiry date is required!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Health Insurance -->
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <h4 class="ui dividing header">Health Insurance</h4>
              <div class="field justify-content-center">
                <label class="mb-4">Images</label>
                <div class="row">
                  <div
                    class="col-3 preview-img mb-3"
                    v-for="(img, index) in healthInsuranceImagePrev"
                    :key="index"
                  >
                    <img :src="img" class="ui large image" />
                    <button
                      class="close-btn"
                      v-on:click="removeImage(index, 'healthInsuranceImage')"
                    >
                      <i class="mdi mdi-close-circle"></i>
                    </button>
                  </div>
                </div>
                <div
                  class="ui pointing below red basic label"
                  v-if="healthInsurance.imageErr"
                >
                  Image is required!
                </div>
                <div class="ui corner labeled input">
                  <label
                    class="btn btn-gradient-info btn-icon-text"
                    for="upload-health-photo"
                  >
                    <i class="mdi mdi-upload btn-icon-prepend" />Select image...
                  </label>
                  <input
                    class="upload-photo"
                    id="upload-health-photo"
                    type="file"
                    accept="image/*"
                    @change="uploadImage($event, 'healthInsuranceImage')"
                  />
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>ID</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      name="Name"
                      ref="healthInsurId"
                      placeholder="ID"
                      maxlength="15"
                      style="text-transform:uppercase"
                      v-model="healthInsuranceInfor.userDocumentId"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="healthInsurance.documentIdErr"
                  >
                    Health insurance id is required 15 chars!
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="healthInsurance.documentDupErr"
                  >
                    Health insurance id is duplicated!
                  </div>
                </div>
                <div class="field">
                  <label>Register Location</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      placeholder="Register location"
                      maxlength="100"
                      v-model="healthInsuranceInfor.registerLocation"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="healthInsurance.registerLocationErr"
                  >
                    Register location is required!
                  </div>
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>Register Date</label>
                  <div class="ui corner labeled input">
                    <input
                      type="date"
                      class="form-control"
                      v-model="healthInsuranceInfor.registerDate"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="healthInsurance.registerDateErr"
                  >
                    Register date is required!
                  </div>
                </div>
                <div class="field">
                  <label>ExpiryDate</label>
                  <div class="ui corner labeled input">
                    <input
                      type="date"
                      class="form-control"
                      v-model="healthInsuranceInfor.expiryDate"
                      :min="healthInsuranceInfor.registerDate"
                      :disabled="healthInsuranceInfor.registerDate.length === 0"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="healthInsurance.expiryDateErr"
                  >
                    Expiry date is required!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Driving License -->
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <h4 class="ui dividing header">Driving License</h4>
              <div class="field justify-content-center">
                <label class="mb-4">Images</label>
                <div class="row">
                  <div
                    class="col-3 preview-img mb-3"
                    v-for="(img, index) in drivingLicenseImagePrev"
                    :key="index"
                  >
                    <img :src="img" class="ui large image" />
                    <button
                      class="close-btn"
                      v-on:click="removeImage(index, 'drivingLicenseImage')"
                    >
                      <i class="mdi mdi-close-circle"></i>
                    </button>
                  </div>
                </div>
                <div
                  class="ui pointing below red basic label"
                  v-if="drivingLicense.imageErr"
                >
                  Image is required!
                </div>
                <div class="ui corner labeled input">
                  <label
                    class="btn btn-gradient-info btn-icon-text"
                    for="upload-drive-photo"
                  >
                    <i class="mdi mdi-upload btn-icon-prepend" />Select image
                  </label>
                  <input
                    class="upload-photo"
                    id="upload-drive-photo"
                    type="file"
                    accept="image/*"
                    @change="uploadImage($event, 'drivingLicenseImage')"
                  />
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>Driving License ID</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      ref="drivLicenseID"
                      placeholder="Driving License ID"
                      @keypress="isNumber($event)"
                      maxlength="12"
                      v-model="drivingLicenseInfor.userDocumentId"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="drivingLicense.documentIdErr"
                  >
                    Driving license id is required 12 digits!
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="drivingLicense.documentDupErr"
                  >
                    Driving license id is duplicated!
                  </div>
                </div>
                <div class="field">
                  <label>Driving license type</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      placeholder="Driving license type"
                      style="text-transform:uppercase"
                      v-model="drivingLicenseInfor.otherInformation"
                      maxlength="4"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="drivingLicense.otherInfoErr"
                  >
                    Driving license type is required!
                  </div>
                </div>
              </div>
              <div class="field">
                <label>Register Location</label>
                <div class="ui corner labeled input">
                  <input
                    type="text"
                    placeholder="Register location"
                    maxlength="100"
                    v-model="drivingLicenseInfor.registerLocation"
                  />
                  <div class="ui corner label">
                    <i class="asterisk icon"></i>
                  </div>
                </div>
                <div
                  class="ui pointing red basic label"
                  v-if="drivingLicense.registerLocationErr"
                >
                  Register location is required!
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>Register Date</label>
                  <div class="ui corner labeled input">
                    <input
                      type="date"
                      class="form-control"
                      v-model="drivingLicenseInfor.registerDate"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="drivingLicense.registerDateErr"
                  >
                    Register date is required!
                  </div>
                </div>
                <div class="field">
                  <label>ExpiryDate</label>
                  <div class="ui corner labeled input">
                    <input
                      type="date"
                      class="form-control"
                      v-model="drivingLicenseInfor.expiryDate"
                      :min="drivingLicenseInfor.registerDate"
                      :disabled="drivingLicenseInfor.registerDate.length === 0"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="drivingLicense.expiryDateErr"
                  >
                    Expiry date is required!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
import { isNumber } from "../assets/js/input.js";
import * as firebase from "firebase";
import Loading from "vue-loading-overlay";
import moment from "moment";
import { RepositoryFactory } from "../repositories/RepositoryFactory";
const DriverRepository = RepositoryFactory.get("drivers");
export default {
  name: "CreateDriver",
  components: {
    Loading,
  },
  data() {
    return {
      driver: {
        userId: "",
        fullName: "",
        address: "",
        phoneNumber: "",
        gender: 1,
        dateOfBirth: "",
        imageLink: "",
        baseSalary: "",
        userStatusId: 2,
        userDocumentReqList: [],
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
      isFullNameErr: false,
      isAddressErr: false,
      isPhoneNumberErr: false,
      isBirthDateErr: false,
      isSalaryErr: false,
      isUserImgErr: false,
      // Document Information Error
      indentify: {
        documentIdErr: false,
        documentDupErr: false,
        registerLocationErr: false,
        registerDateErr: false,
        expiryDateErr: false,
        imageErr: false,
      },
      healthInsurance: {
        documentIdErr: false,
        documentDupErr: false,
        registerLocationErr: false,
        registerDateErr: false,
        expiryDateErr: false,
        imageErr: false,
      },
      drivingLicense: {
        documentIdErr: false,
        documentDupErr: false,
        otherInfoErr: false,
        registerLocationErr: false,
        registerDateErr: false,
        expiryDateErr: false,
        imageErr: false,
      },
      maxBirthDate: "",
      isLoading: false,
      isCreatedSuccessfully: false,
      isError: false,
      errMsg: "",
      userId: "",
      cloneObj: {},
      indentifyInfor: {},
      healthInsuranceInfor: {},
      drivingLicenseInfor: {},
    };
  },
  async mounted() {
    let today = new Date();
    this.maxBirthDate =
      today.getFullYear() -
      18 +
      "-" +
      (today.getMonth() > 10 ? "" : "0") +
      today.getMonth() +
      "-" +
      (today.getDate() > 10 ? "" : "0") +
      today.getDate();
    this.userId = this.$route.params.userId;
    await this.initDriver();
  },
  methods: {
    // Init driver detail
    async initDriver() {
      await DriverRepository.getDetailDriver(this.userId).then((res) => {
        this.driver = res;
      });

      this.driver.dateOfBirth = this.getDate(this.driver.dateOfBirth);
      this.driver.gender = this.driver.gender ? 1 : 0;

      // console.log("--------");
      // driver.fullName = "dcm";
      // console.log(driver.userDocumentList);
      let identityCard = this.findDocumentByName(
        this.driver.userDocumentList,
        "Identity Card"
      );
      let healthInsurance = this.findDocumentByName(
        this.driver.userDocumentList,
        "Health Insurance"
      );
      let drivingLicense = this.findDocumentByName(
        this.driver.userDocumentList,
        "Driving License"
      );
      this.indentifyInfor = identityCard;
      this.healthInsuranceInfor = healthInsurance;
      this.drivingLicenseInfor = drivingLicense;
    },

    // Find document
    findDocumentByName(driverDocument, documentName) {
      for (let doc of driverDocument) {
        if (doc.userDocumentType === documentName) {
          doc.expiryDate = this.getDate(doc.expiryDate);
          doc.registerDate = this.getDate(doc.registerDate);
          return doc;
        }
      }
    },
    // Upload profile img
    uploadProfile(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.profileImagePrev = e.target.result;
      };
      this.profileImage = image;
    },
    uploadImage(e, imageType) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        let arr = this.$data[imageType + "Prev"];
        arr.push(e.target.result);
      };
      let arr = this.$data[imageType];
      arr.push(image);
    },
    // Remove image from list
    removeImage(index, imageType) {
      let imgArr = this.$data[imageType];
      let imgPrevArr = this.$data[imageType + "Prev"];
      this.$delete(imgArr, index);
      this.$delete(imgPrevArr, index);
    },
    // Upload image to firebase
    uploadImageToFirebase(imageData, imgTypeName) {
      return new Promise((resolve) => {
        var seft = this;
        let date = moment(new Date()).format("YYYYMMDDHHmmss");
        seft.img1 = null;
        const storageRef = firebase
          .storage()
          .ref(imgTypeName + "-" + this.driver.userId + "-" + date)
          .put(imageData);
        storageRef.on(
          `state_changed`,
          (snapshot) => {
            this.uploadValue =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            console.log(error.message);
          },
          () => {
            this.uploadValue = 100;
            storageRef.snapshot.ref.getDownloadURL().then((url) => {
              // let lastIndex = url.lastIndexOf("/");
              // seft.img1 = url.substring(lastIndex);
              resolve(url);
            });
          }
        );
      });
    },
    // Cheack basic information
    checkBasicInformation() {
      this.isFullNameErr = this.driver.fullName.length === 0;
      this.isAddressErr = this.driver.address.length === 0;
      this.isPhoneNumberErr =
        this.driver.phoneNumber
          .replace("(", "")
          .replace(")", "")
          .replace(" ", "")
          .replace("-", "").length !== 10;
      this.isBirthDateErr = this.driver.dateOfBirth.length === 0;
      this.isSalaryErr = this.driver.baseSalary.length === 0;
      this.isUserImgErr =
        (this.profileImage === null || this.profileImage === null) &&
        (this.driver.imageLink === null ||
          (this.driver.imageLink !== null &&
            this.driver.imageLink.length == 0));

      return (
        this.isFullNameErr ||
        this.isAddressErr ||
        this.isPhoneNumberErr ||
        this.isBirthDateErr ||
        this.isSalaryErr ||
        this.isUserImgErr
      );
    },
    // Check Document
    checkDocumentInfo() {
      // Check indentify card
      let indentify = this.indentifyInfor;
      let indentifyID = indentify.userDocumentId;
      this.indentify.documentIdErr =
        indentifyID.length !== 9 && indentifyID.length !== 12;
      this.indentify.registerLocationErr =
        indentify.registerLocation.length === 0;
      this.indentify.registerDateErr = indentify.registerDate.length === 0;
      this.indentify.expiryDateErr = indentify.expiryDate.length === 0;
      this.indentify.imageErr =
        this.indentifyImage.length === 0 ||
        this.indentifyImagePrev.length === 0;
      let isIndentifyValid =
        this.indentify.documentIdErr ||
        this.indentify.registerLocationErr ||
        this.indentify.registerDateErr ||
        this.indentify.expiryDateErr ||
        this.indentify.imageErr;
      // Check health insurance
      let healthInsurance = this.healthInsuranceInfor;
      this.healthInsurance.documentIdErr =
        healthInsurance.userDocumentId.length !== 15;
      this.healthInsurance.registerLocationErr =
        healthInsurance.registerLocation.length === 0;
      this.healthInsurance.registerDateErr =
        healthInsurance.registerDate.length === 0;
      this.healthInsurance.expiryDateErr =
        healthInsurance.expiryDate.length === 0;
      this.healthInsurance.imageErr =
        this.healthInsuranceImage.length === 0 ||
        this.healthInsuranceImage.length === 0;
      let isHealthInsuranceValid =
        this.healthInsurance.documentIdErr ||
        this.healthInsurance.registerLocationErr ||
        this.healthInsurance.registerDateErr ||
        this.healthInsurance.expiryDateErr ||
        this.healthInsurance.imageEr;
      // Check driving license
      let drivingLicense = this.drivingLicenseInfor;
      this.drivingLicense.documentIdErr =
        drivingLicense.userDocumentId.length !== 12;
      this.drivingLicense.otherInfoErr =
        drivingLicense.otherInformation.length === 0;
      this.drivingLicense.registerLocationErr =
        drivingLicense.registerLocation.length === 0;
      this.drivingLicense.registerDateErr =
        drivingLicense.registerDate.length === 0;
      this.drivingLicense.expiryDateErr =
        drivingLicense.expiryDate.length === 0;
      this.drivingLicense.imageErr =
        this.drivingLicenseImage.length === 0 ||
        this.drivingLicenseImagePrev.length === 0;
      let isDrivingLicenseValid =
        this.drivingLicense.documentIdErr ||
        this.drivingLicense.otherInfoErr ||
        this.drivingLicense.registerLocationErr ||
        this.drivingLicense.registerDateErr ||
        this.drivingLicense.expiryDateErr ||
        this.drivingLicense.imageErr;
      return (
        isIndentifyValid || isHealthInsuranceValid || isDrivingLicenseValid
      );
    },
    async create() {
      let isValid = this.checkDocumentInfo();
      if (!isValid) {
        this.isLoading = true;
        this.driver.userId = this.indentifyInfor.userDocumentId;
        this.indentify.documentDupErr = false;
        this.healthInsurance.documentDupErr = false;
        this.drivingLicense.documentDupErr = false;
        // Init image list for indentify card
        this.driver.imageLink = await this.uploadImageToFirebase(
          this.profileImage,
          "profile"
        );

        this.driver.phoneNumber = this.driver.phoneNumber
          .replace("(", "")
          .replace(")", "")
          .replace(" ", "")
          .replace("-", "");

        await this.getFirebaseLinks("indentifyImage", 0);
        await this.getFirebaseLinks("healthInsuranceImage", 1);
        await this.getFirebaseLinks("drivingLicenseImage", 2);

        await DriverRepository.create(this.driver)
          .then((res) => {
            if (res) {
              this.isCreatedSuccessfully = true;
            }
            console.log(res);
          })
          .catch((ex) => {
            this.isError = true;
            if (
              ex.debugMessage.includes(
                "Cannot insert duplicate key in object 'dbo.user_document'"
              )
            ) {
              if (
                ex.debugMessage.includes(
                  this.drivingLicenseInfor.userDocumentId
                )
              ) {
                this.errMsg = "Driving license id is duplicated!";
                this.drivingLicense.documentDupErr = true;
                this.$refs.drivLicenseID.focus();
              }
              if (
                ex.debugMessage.includes(
                  this.healthInsuranceInfor.userDocumentId
                )
              ) {
                this.errMsg = "Health insurance id is duplicated!";
                this.healthInsurance.documentDupErr = true;
                this.$refs.healthInsurId.focus();
              }
            }
            if (
              ex.debugMessage.includes(
                "Cannot insert duplicate key in object 'dbo.user'"
              )
            ) {
              this.errMsg = "Indentify ID is duplicated!";
              this.indentify.documentDupErr = true;
              this.$refs.indentifyID.focus();
            }
            console.error(ex);
          });
        this.isLoading = false;
      }
    },
    // Get firebase links
    async getFirebaseLinks(imgTypeName, index) {
      let imgDataList = this.$data[imgTypeName];
      let imgArr = [];
      let document = this.driver.userDocumentReqList[index];
      for (let img of imgDataList) {
        let url = await this.uploadImageToFirebase(img, imgTypeName);
        let imgObj = {
          documentId: document.userDocumentId,
          documentImageId: 0,
          imageLink: url,
        };
        imgArr.push(imgObj);
      }
      document.documentImagesReqList = imgArr;
    },
    changeTab() {
      let isValid = this.checkBasicInformation();
      if (!isValid) {
        this.isUserInfoVisible = !this.isUserInfoVisible;
      }
    },
    isNumber(evt) {
      isNumber(evt);
    },
    // Check Phone input
    phoneInput() {
      var x = this.driver.phoneNumber
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      if (x[1].charAt(0) !== "0" && x[1].length != 0) {
        x[1] = "0" + x[1];
      }
      this.driver.phoneNumber = !x[2]
        ? x[1]
        : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
    },
    getDate(date) {
      return moment(date).format("YYYY-MM-DD");
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
  /* min-width: 200px; */
  /* max-width: 300px; */
  /* min-height: 200px; */
  /* max-height: 300px; */
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
</style>
<style>
@import "../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

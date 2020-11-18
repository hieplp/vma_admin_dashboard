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
                    src="../../assets/images/unnamed.png"
                    class="ui medium circular image pro-img"
                    alt="image"
                    v-if="profileImagePrev == null"
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

              <div class="three fields">
                <!-- Gender  -->
                <div class="field">
                  <label>Gender</label>
                  <select class="ui fluid dropdown" v-model="driver.gender">
                    <option value="true">Male</option>
                    <option value="false">Female</option>
                  </select>
                </div>

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
                  <div class="ui pointing red basic label" v-if="isSalaryErr">
                    Base salary is required!
                  </div>
                </div>
              </div>

              <div class="two fields">
                <!-- Adress -->
                <div class="field">
                  <label>Address</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="driver.address"
                      maxlength="30"
                      placeholder="Address"
                      class="form-control"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div class="ui pointing red basic label" v-if="isAddressErr">
                    Address is required!
                  </div>
                </div>
                <!-- Wards/Communes  -->
                <div class="field">
                  <label>Wards/Communes</label>
                  <div class="ui left corner labeled input">
                    <select
                      class="ui fluid dropdown cus-select"
                      v-model="selectedWard"
                      :disabled="this.wards.length === 0"
                    >
                      <option :value="{ name: '' }">
                        Wards/Communes
                      </option>
                      <option
                        v-for="ward in wards"
                        :key="ward.code"
                        :value="ward"
                        >{{ ward.name_with_type }}</option
                      >
                    </select>
                    <div class="ui left corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>

                  <div class="ui pointing red basic label" v-if="isWardErr">
                    Ward/Commune is required!
                  </div>
                </div>
              </div>

              <div class="two fields">
                <!-- Districts -->
                <div class="field">
                  <label>Districts</label>
                  <div class="ui left corner labeled input">
                    <select
                      class="ui fluid dropdown cus-select"
                      @change="handleDropdownChange(2)"
                      v-model="selectedDistrict"
                      :disabled="this.districts.length === 0"
                    >
                      <option :value="{ name: '' }">
                        Districts
                      </option>
                      <option
                        v-for="district in districts"
                        :key="district.code"
                        :value="district"
                        >{{ district.name_with_type }}</option
                      >
                    </select>
                    <div class="ui left corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>

                  <div class="ui pointing red basic label" v-if="isDistrictErr">
                    District is required!
                  </div>
                </div>
                <div class="field">
                  <label>Cities/Provinces</label>
                  <div class="ui left corner labeled input">
                    <select
                      class="ui dropdown cus-select"
                      @change="handleDropdownChange(1)"
                      v-model="selectedCity"
                    >
                      <option :value="{ name: '' }">
                        Cities/Provinces
                      </option>
                      <option
                        v-for="city in cities"
                        :key="city.code"
                        :value="city"
                      >
                        {{ city.name_with_type }}
                      </option>
                    </select>
                    <div class="ui left corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>

                  <div class="ui pointing red basic label" v-if="isCityErr">
                    City/Province is required!
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
                  Image is required 2 images!
                </div>
                <div class="ui corner labeled input">
                  <label
                    class="btn btn-icon-text cus-disable"
                    v-bind:class="{
                      'btn-gradient-info':
                        indentifyImage !== null && indentifyImage.length < 2,
                    }"
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
                    :disabled="
                      indentifyImage !== null && indentifyImage.length === 2
                    "
                  />
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>Indentify ID</label>
                  <div class="ui corner labeled input">
                    <input
                      v-model="driver.userDocumentReqList[0].userDocumentId"
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
                  <label>Registered Date</label>
                  <div class="ui corner labeled input">
                    <input
                      type="date"
                      v-model="driver.userDocumentReqList[0].registeredDate"
                      class="form-control"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="indentify.registeredDateErr"
                  >
                    Registered date is required!
                  </div>
                </div>
                <div class="field">
                  <label>Registered Location</label>
                  <div class="ui left corner labeled input">
                    <select
                      class="ui dropdown cus-select"
                      v-model="driver.userDocumentReqList[0].registeredLocation"
                    >
                      <option :value="''">
                        Cities/Provinces
                      </option>
                      <option
                        v-for="city in cities"
                        :key="city.code"
                        :value="city.name_with_type"
                      >
                        {{ city.name_with_type }}
                      </option>
                    </select>
                    <div class="ui left corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="indentify.registeredLocationErr"
                  >
                    Registered Location is required!
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
                  Image is required 2 images!
                </div>
                <div class="ui corner labeled input">
                  <label
                    class="btn btn-icon-text cus-disable"
                    v-bind:class="{
                      'btn-gradient-info':
                        healthInsuranceImage !== null &&
                        healthInsuranceImage.length < 2,
                    }"
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
                    :disabled="
                      healthInsuranceImage !== null &&
                        healthInsuranceImage.length === 2
                    "
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
                      v-model="driver.userDocumentReqList[1].userDocumentId"
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
                  <label>Registered Date</label>
                  <div class="ui corner labeled input">
                    <input
                      type="date"
                      class="form-control"
                      v-model="driver.userDocumentReqList[1].registeredDate"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="healthInsurance.registeredDateErr"
                  >
                    Registered date is required!
                  </div>
                </div>
                <div class="field">
                  <label>Registered Location</label>

                  <div class="ui left corner labeled input">
                    <select
                      class="ui dropdown cus-select"
                      v-model="driver.userDocumentReqList[1].registeredLocation"
                    >
                      <option :value="''">
                        Cities/Provinces
                      </option>
                      <option
                        v-for="city in cities"
                        :key="city.code"
                        :value="city.name_with_type"
                      >
                        {{ city.name_with_type }}
                      </option>
                    </select>
                    <div class="ui left corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="healthInsurance.registeredLocationErr"
                  >
                    Registered Location is required!
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
                  Image is required 2 images!
                </div>
                <div class="ui corner labeled input">
                  <label
                    class="btn btn-icon-text cus-disable"
                    v-bind:class="{
                      'btn-gradient-info':
                        drivingLicenseImage !== null &&
                        drivingLicenseImage.length < 2,
                    }"
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
                    :disabled="
                      drivingLicenseImage !== null &&
                        drivingLicenseImage.length === 2
                    "
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
                      v-model="driver.userDocumentReqList[2].userDocumentId"
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
                  <div class="ui left corner labeled input">
                    <select
                      class="ui dropdown cus-select"
                      v-model="selectedDrivingLicenseTypes"
                    >
                      <option :value="{ name: '' }">
                        Driving License Type
                      </option>
                      <option
                        v-for="drivingLicenseType in drivingLicenseTypes"
                        :key="drivingLicenseType.name"
                        :value="drivingLicenseType"
                      >
                        {{ drivingLicenseType.name }}
                      </option>
                    </select>
                    <div class="ui left corner label">
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

              <div class="two fields">
                <div class="field">
                  <label>Registered Date</label>
                  <div class="ui corner labeled input">
                    <input
                      type="date"
                      class="form-control"
                      v-model="driver.userDocumentReqList[2].registeredDate"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="drivingLicense.registeredDateErr"
                  >
                    Registered date is required!
                  </div>
                </div>
                <div class="field">
                  <label>Registered Location</label>
                  <div class="ui left corner labeled input">
                    <select
                      class="ui dropdown cus-select"
                      v-model="driver.userDocumentReqList[2].registeredLocation"
                    >
                      <option :value="''">
                        Cities/Provinces
                      </option>
                      <option
                        v-for="city in cities"
                        :key="city.code"
                        :value="city.name_with_type"
                      >
                        {{ city.name_with_type }}
                      </option>
                    </select>
                    <div class="ui left corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="drivingLicense.registeredLocationErr"
                  >
                    Registered Location is required!
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
import { isNumber } from "../../assets/js/input.js";
import * as firebase from "firebase";
import Loading from "vue-loading-overlay";
import moment from "moment";
// import citiesJson from "../assets/json/addresses/tinh_tp.json";

import { RepositoryFactory } from "../../repositories/RepositoryFactory";
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
        gender: true,
        dateOfBirth: "",
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
      isFullNameErr: false,
      isPhoneNumberErr: false,
      isBirthDateErr: false,
      isSalaryErr: false,
      isUserImgErr: false,
      // Address error
      isAddressErr: false,
      isWardErr: false,
      isDistrictErr: false,
      isCityErr: false,

      // Document Information Error
      indentify: {
        documentIdErr: false,
        documentDupErr: false,
        registeredLocationErr: false,
        registeredDateErr: false,
        expiryDateErr: false,
        imageErr: false,
      },
      healthInsurance: {
        documentIdErr: false,
        documentDupErr: false,
        registeredLocationErr: false,
        registeredDateErr: false,
        expiryDateErr: false,
        imageErr: false,
      },
      drivingLicense: {
        documentIdErr: false,
        documentDupErr: false,
        otherInfoErr: false,
        registeredLocationErr: false,
        registeredDateErr: false,
        expiryDateErr: false,
        imageErr: false,
      },
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
    this.cities = this.getJsonObjects("tinh_tp.json");
    this.drivingLicenseTypes = require("../../assets/json/indentify/type.json");
    this.documentExpiryDate = require("../../assets/json/expiryDate.json");

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

    getJsonObjects(str) {
      return require("../../assets/json/addresses/" + str);
    },
    // Handle address dropdown
    handleDropdownChange(name) {
      // If city is selected
      if (name === 1) {
        if (this.selectedCity.name !== "") {
          this.districts = this.getJsonObjects(
            "quan-huyen/" + this.selectedCity.code + ".json"
          );
        } else {
          this.districts = [];
        }
        this.selectedDistrict = { name: "" };
        this.selectedWard = { name: "" };
        this.wards = [];
        // If district is selected
      } else if (name === 2) {
        if (this.selectedDistrict.name !== "") {
          this.wards = this.getJsonObjects(
            "xa-phuong/" + this.selectedDistrict.code + ".json"
          );
        } else {
          this.selectedWard = { name: "" };
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
              resolve(url);
            });
          }
        );
      });
    },
    deleteImageFromFirebase(img) {
      return new Promise((resolve) => {
        firebase
          .storage()
          .refFromURL(img)
          .delete();
        resolve();
      });
    },
    // Cheack basic information
    checkBasicInformation() {
      this.isFullNameErr = this.driver.fullName.length === 0;
      this.isAddressErr = this.driver.address.length === 0;
      this.isWardErr = this.selectedWard.name.length === 0;
      this.isDistrictErr = this.selectedDistrict.name.length === 0;
      this.isCityErr = this.selectedCity.name.length === 0;
      this.isPhoneNumberErr =
        this.driver.phoneNumber
          .replace("(", "")
          .replace(")", "")
          .replace(" ", "")
          .replace("-", "").length !== 10;
      this.isBirthDateErr = this.driver.dateOfBirth.length === 0;
      this.isSalaryErr = this.driver.baseSalary.length === 0;
      this.isUserImgErr =
        this.profileImage === null || this.profileImage === null;
      return (
        this.isFullNameErr ||
        this.isAddressErr ||
        this.isPhoneNumberErr ||
        this.isBirthDateErr ||
        this.isSalaryErr ||
        this.isWardErr ||
        this.isDistrictErr ||
        this.isCityErr ||
        this.isUserImgErr
      );
    },
    // Check Document
    checkDocumentInfo() {
      // Check indentify card
      let indentify = this.driver.userDocumentReqList[0];
      let indentifyID = indentify.userDocumentId;
      this.indentify.documentIdErr =
        indentifyID.length !== 9 && indentifyID.length !== 12;
      this.indentify.registeredLocationErr =
        indentify.registeredLocation.length === 0;
      this.indentify.registeredDateErr = indentify.registeredDate.length === 0;
      this.indentify.imageErr =
        this.indentifyImage.length < 2 || this.indentifyImagePrev.length < 2;
      let isIndentifyValid =
        this.indentify.documentIdErr ||
        this.indentify.registeredLocationErr ||
        this.indentify.registeredDateErr ||
        this.indentify.imageErr;
      // Check health insurance
      let healthInsurance = this.driver.userDocumentReqList[1];
      this.healthInsurance.documentIdErr =
        healthInsurance.userDocumentId.length !== 15;
      this.healthInsurance.registeredLocationErr =
        healthInsurance.registeredLocation.length === 0;
      this.healthInsurance.registeredDateErr =
        healthInsurance.registeredDate.length === 0;

      this.healthInsurance.imageErr =
        this.healthInsuranceImage.length < 2 ||
        this.healthInsuranceImage.length < 2;
      let isHealthInsuranceValid =
        this.healthInsurance.documentIdErr ||
        this.healthInsurance.registeredLocationErr ||
        this.healthInsurance.registeredDateErr ||
        this.healthInsurance.imageEr;
      // Check driving license
      let drivingLicense = this.driver.userDocumentReqList[2];
      this.drivingLicense.documentIdErr =
        drivingLicense.userDocumentId.length !== 12;
      this.drivingLicense.otherInfoErr =
        this.selectedDrivingLicenseTypes.name.length === 0;
      this.drivingLicense.registeredLocationErr =
        drivingLicense.registeredLocation.length === 0;
      this.drivingLicense.registeredDateErr =
        drivingLicense.registeredDate.length === 0;

      this.drivingLicense.imageErr =
        this.drivingLicenseImage.length < 2 ||
        this.drivingLicenseImagePrev.length < 2;
      let isDrivingLicenseValid =
        this.drivingLicense.documentIdErr ||
        this.drivingLicense.otherInfoErr ||
        this.drivingLicense.registeredLocationErr ||
        this.drivingLicense.registeredDateErr ||
        this.drivingLicense.imageErr;
      return (
        isIndentifyValid || isHealthInsuranceValid || isDrivingLicenseValid
      );
    },
    async create() {
      let isValid = this.checkDocumentInfo();
      if (!isValid) {
        this.isLoading = true;
        this.driver.userId = this.driver.userDocumentReqList[0].userDocumentId;

        this.indentify.documentDupErr = false;
        this.healthInsurance.documentDupErr = false;
        this.drivingLicense.documentDupErr = false;

        // Init document expiry date
        this.driver.userDocumentReqList[0].expiryDate = this.getExpiryDate(
          this.driver.userDocumentReqList[0].registeredDate,
          this.documentExpiryDate.indentify
        );
        this.driver.userDocumentReqList[1].expiryDate = this.getExpiryDate(
          this.driver.userDocumentReqList[1].registeredDate,
          this.documentExpiryDate.indentify
        );
        this.driver.userDocumentReqList[2].expiryDate = this.getExpiryDate(
          this.driver.userDocumentReqList[2].registeredDate,
          this.selectedDrivingLicenseTypes.expiryDate
        );
        this.driver.userDocumentReqList[2].otherInformation = this.selectedDrivingLicenseTypes.name;

        this.driver.address =
          this.driver.address +
          ", " +
          this.selectedWard.name_with_type +
          ", " +
          this.selectedDistrict.name_with_type +
          ", " +
          this.selectedCity.name_with_type;

        // Init image list for indentify card
        if (this.profileImage) {
          this.driver.imageLink = await this.uploadImageToFirebase(
            this.profileImage,
            "profile"
          );
          this.profileImage = null;
        }

        // Set phone number
        this.driver.phoneNumber = this.driver.phoneNumber
          .replace("(", "")
          .replace(")", "")
          .replace(" ", "")
          .replace("-", "");

        // Delete old firebase image link
        await this.deleteFirebaseLink(
          this.driver.userDocumentReqList[0].documentImagesReqList
        );
        this.driver.userDocumentReqList[0].documentImagesReqList = [];
        await this.deleteFirebaseLink(
          this.driver.userDocumentReqList[1].documentImagesReqList
        );
        this.driver.userDocumentReqList[0].documentImagesReqList = [];
        await this.deleteFirebaseLink(
          this.driver.userDocumentReqList[2].documentImagesReqList
        );
        this.driver.userDocumentReqList[0].documentImagesReqList = [];

        // Upload images to firebase
        await this.getFirebaseLinks("indentifyImage", 0);
        await this.getFirebaseLinks("healthInsuranceImage", 1);
        await this.getFirebaseLinks("drivingLicenseImage", 2);

        // Call api to create new driver
        await DriverRepository.create(this.driver)
          .then((res) => {
            if (res) {
              this.isCreatedSuccessfully = true;
            }
          })
          .catch((ex) => {
            if (
              ex.debugMessage.includes(
                "Cannot insert duplicate key in object 'dbo.user_document'"
              )
            ) {
              if (
                ex.debugMessage.includes(
                  this.driver.userDocumentReqList[2].userDocumentId
                )
              ) {
                this.errMsg = "Driving license id is duplicated!";
                this.drivingLicense.documentDupErr = true;
                this.$refs.drivLicenseID.focus();
              }
              if (
                ex.debugMessage.includes(
                  this.driver.userDocumentReqList[1].userDocumentId
                )
              ) {
                this.errMsg = "Health insurance id is duplicated!";
                this.healthInsurance.documentDupErr = true;
                this.$refs.healthInsurId.focus();
              }
              if (
                ex.debugMessage.includes(
                  this.driver.userDocumentReqList[0].userDocumentId
                )
              ) {
                this.errMsg = "Indentify ID is duplicated!";
                this.indentify.documentDupErr = true;
                this.$refs.indentifyID.focus();
              }
              this.isError = true;
            } else if (
              ex.debugMessage.includes(
                "Cannot insert duplicate key in object 'dbo.user'"
              )
            ) {
              this.isError = true;
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
      if (imgDataList) {
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
      }
    },
    // Delete firebase imgs
    async deleteFirebaseLink(imgs) {
      for (let img of imgs) {
        await this.deleteImageFromFirebase(img.imageLink);
      }
      imgs = [];
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";

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
</style>

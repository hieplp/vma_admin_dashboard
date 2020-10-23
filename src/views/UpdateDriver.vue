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
          Update Driver
        </span>
      </h3>
    </div>
    <div
      class="ui basic cus-modal justify-content-center"
      v-if="isCreatedSuccessfully"
    >
      <div class="ui icon header col-12">
        <i class="check circle icon mb-3"></i>
        Update Driver Successfully!
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>
          Driver with name {{ this.driver.fullName }} is updated successfully!
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
        Update Driver Fail!
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

    <!-- Update confirmation dialog -->
    <div
      class="ui basic cus-modal justify-content-center"
      v-if="isUpdConVisible"
    >
      <div class="ui icon header col-12">
        <i class="edit outline icon mb-3"></i>
        Update Confirmation
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>Do you want to update this driver?</h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <button
          type="button"
          class="ui red button"
          @click="isUpdConVisible = !isUpdConVisible"
        >
          <i class="x icon"></i>
          Cancel
        </button>
        <button type="button" class="ui blue  button" @click="update()">
          <i class="check icon"></i>
          Update
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
                      profileImage === null &&
                        driver.imageLink !== null &&
                        driver.imageLink.length > 0
                    "
                  />
                  <img
                    :src="profileImagePrev"
                    class="ui medium circular image pro-img"
                    alt="image"
                    v-else-if="profileImage !== null"
                  />
                  <img
                    src="../assets/images/unnamed.png"
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
                    <img :src="img.imageLink" class="ui large image" />
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
                      v-model="indentifyInfor.userDocumentId"
                      type="text"
                      readonly
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
                  <label>Register Date</label>
                  <div class="ui corner labeled input">
                    <input
                      type="date"
                      v-model="indentifyInfor.registeredDate"
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
                  <label>Register Location</label>
                  <div class="ui left corner labeled input">
                    <select
                      class="ui dropdown cus-select"
                      v-model="indentifyInfor.registeredLocation"
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
                    Registered location is required!
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
                    <img :src="img.imageLink" class="ui large image" />
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
                      readonly
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
                  <label>Register Date</label>
                  <div class="ui corner labeled input">
                    <input
                      type="date"
                      class="form-control"
                      v-model="healthInsuranceInfor.registeredDate"
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
                  <label>Register Location</label>

                  <div class="ui left corner labeled input">
                    <select
                      class="ui dropdown cus-select"
                      v-model="healthInsuranceInfor.registeredLocation"
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
                    Registered location is required!
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
                    <img :src="img.imageLink" class="ui large image" />
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
                      readonly
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
                  <label>Register Date</label>
                  <div class="ui corner labeled input">
                    <input
                      type="date"
                      class="form-control"
                      v-model="drivingLicenseInfor.registeredDate"
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
                  <label>Register Location</label>
                  <div class="ui left corner labeled input">
                    <select
                      class="ui dropdown cus-select"
                      v-model="drivingLicenseInfor.registeredLocation"
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
                    Registered location is required!
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
                    v-on:click="openConfirmation()"
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
import { isNumber } from "../assets/js/input.js";
import * as firebase from "firebase";
import Loading from "vue-loading-overlay";
import moment from "moment";
// import SuccessModal from "../components/SuccessModal";
// import citiesJson from "../assets/json/addresses/tinh_tp.json";

import { RepositoryFactory } from "../repositories/RepositoryFactory";
const DriverRepository = RepositoryFactory.get("drivers");

export default {
  name: "UpdateDriver",
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
      indentifyImageDel: [],
      indentifyImagePrev: [],
      // Health Insurance
      healthInsuranceImage: [],
      healthInsuranceImageDel: [],
      healthInsuranceImagePrev: [],
      // Driving License
      drivingLicenseImage: [],
      drivingLicenseImageDel: [],
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

      indentifyInfor: {},
      healthInsuranceInfor: {},
      drivingLicenseInfor: {},

      isUpdConVisible: false,
    };
  },
  mounted() {
    this.cities = this.getJsonObjects("tinh_tp.json");
    this.drivingLicenseTypes = require("../assets/json/indentify/type.json");
    this.documentExpiryDate = require("../assets/json/expiryDate.json");

    this.initDetailDriver();

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
  },
  methods: {
    initDetailDriver() {
      this.isLoading = true;
      DriverRepository.getDetailDriver(this.$route.params.userId).then(
        (res) => {
          this.driver = res;

          let addressArr = this.driver.address.split(", ");

          this.selectedCity = this.findItemFromJson(
            this.cities,
            addressArr[addressArr.length - 1],
            "name_with_type"
          );
          this.handleDropdownChange(1);

          this.selectedDistrict = this.findItemFromJson(
            this.districts,
            addressArr[addressArr.length - 2],
            "name_with_type"
          );

          this.handleDropdownChange(2);
          this.selectedWard = this.findItemFromJson(
            this.wards,
            addressArr[addressArr.length - 3],
            "name_with_type"
          );
          this.driver.address = addressArr[0];
          this.phoneInput();

          let identityCard = this.findDocumentByName(
            this.driver.userDocumentList,
            1
          );

          let healthInsurance = this.findDocumentByName(
            this.driver.userDocumentList,
            2
          );
          let drivingLicense = this.findDocumentByName(
            this.driver.userDocumentList,
            3
          );

          this.indentifyInfor = this.copyProperties(
            identityCard,
            "documentImages"
          );
          this.healthInsuranceInfor = this.copyProperties(
            healthInsurance,
            "documentImages"
          );
          this.drivingLicenseInfor = this.copyProperties(
            drivingLicense,
            "documentImages"
          );

          this.selectedDrivingLicenseTypes = this.findItemFromJson(
            this.drivingLicenseTypes,
            drivingLicense.otherInformation,
            "name"
          );

          // Init image for document
          this.indentifyInfor.documentImagesReqList.forEach((img) => {
            this.indentifyImagePrev.push(img);
          });
          this.healthInsuranceInfor.documentImagesReqList.forEach((img) => {
            this.healthInsuranceImagePrev.push(img);
          });
          this.drivingLicenseInfor.documentImagesReqList.forEach((img) => {
            this.drivingLicenseImagePrev.push(img);
          });

          this.isLoading = false;
        }
      );
    },
    // Find document
    findDocumentByName(driverDocument, userDocumentTypeId) {
      for (let doc of driverDocument) {
        if (doc.userDocumentType.userDocumentTypeId === userDocumentTypeId) {
          return doc;
        }
      }
    },

    copyProperties(arr, exKey) {
      let keys = Object.keys(arr);
      let img = {
        expiryDate: "",
        otherInformation: "",
        registeredDate: "",
        registeredLocation: "",
        userDocumentId: "",
        userDocumentTypeId: "",
        documentImagesReqList: [],
      };
      for (let index = 0; index < keys.length; index++) {
        if (keys[index] === exKey) {
          img["documentImagesReqList"] = arr[keys[index]];
        } else if (keys[index] !== "userDocumentType") {
          img[keys[index]] = arr[keys[index]];
        }
      }
      img["userDocumentTypeId"] = arr["userDocumentType"].userDocumentTypeId;
      return img;
    },
    findItemFromJson(arr, findStr, typeName) {
      let keys = Object.keys(arr);
      for (let index = 0; index < keys.length; index++) {
        let item = arr[keys[index]];
        if (item[typeName] === findStr) {
          return item;
        }
      }
    },
    getExpiryDate(date, ex) {
      let dateArr = date.split("-");
      return Number(dateArr[0]) + ex + "-" + dateArr[1] + "-" + dateArr[2];
    },

    getJsonObjects(str) {
      return require("../assets/json/addresses/" + str);
    },

    handleDropdownChange(name) {
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
        arr.push({
          imageLink: e.target.result,
        });
      };
      let arr = this.$data[imageType];
      arr.push(image);
      console.log(arr);
    },
    // Remove image from list
    removeImage(index, imageType) {
      let imgPrevArr = this.$data[imageType + "Prev"];
      // Check if image is new or old image
      if (
        imgPrevArr[index].imageLink.includes("firebasestorage.googleapis.com")
      ) {
        let delImgArr = this.$data[imageType + "Del"];
        delImgArr.push(imgPrevArr[index]);
      } else {
        let imgArr = this.$data[imageType];
        this.$delete(imgArr, index);
      }
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
        this.isWardErr ||
        this.isDistrictErr ||
        this.isCityErr ||
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
      this.indentify.registeredLocationErr =
        indentify.registeredLocation.length === 0;
      this.indentify.registeredDateErr = indentify.registeredDate.length === 0;
      this.indentify.imageErr = this.indentifyImagePrev.length < 2;
      let isIndentifyValid =
        this.indentify.documentIdErr ||
        this.indentify.registeredLocationErr ||
        this.indentify.registeredDateErr ||
        this.indentify.imageErr;
      // Check health insurance
      let healthInsurance = this.healthInsuranceInfor;
      this.healthInsurance.documentIdErr =
        healthInsurance.userDocumentId.length !== 15;
      this.healthInsurance.registeredLocationErr =
        healthInsurance.registeredLocation.length === 0;
      this.healthInsurance.registeredDateErr =
        healthInsurance.registeredDate.length === 0;

      this.healthInsurance.imageErr = this.healthInsuranceImagePrev.length < 2;
      let isHealthInsuranceValid =
        this.healthInsurance.documentIdErr ||
        this.healthInsurance.registeredLocationErr ||
        this.healthInsurance.registeredDateErr ||
        this.healthInsurance.imageEr;
      // Check driving license
      let drivingLicense = this.drivingLicenseInfor;
      this.drivingLicense.documentIdErr =
        drivingLicense.userDocumentId.length !== 12;
      this.drivingLicense.otherInfoErr =
        this.selectedDrivingLicenseTypes.name.length === 0;
      this.drivingLicense.registeredLocationErr =
        drivingLicense.registeredLocation.length === 0;
      this.drivingLicense.registeredDateErr =
        drivingLicense.registeredDate.length === 0;

      this.drivingLicense.imageErr = this.drivingLicenseImagePrev.length < 2;
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
    // Open update confirmation dialog
    openConfirmation() {
      let isValid = this.checkDocumentInfo();
      if (!isValid) {
        this.isUpdConVisible = true;
      }
    },
    // Update
    async update() {
      this.isUpdConVisible = false;
      this.isLoading = true;
      let oldImageLink = null;

      this.driver.userDocumentReqList = [
        this.indentifyInfor,
        this.healthInsuranceInfor,
        this.drivingLicenseInfor,
      ];

      this.driver.userId = this.driver.userDocumentReqList[0].userDocumentId;

      this.indentify.documentDupErr = false;
      this.healthInsurance.documentDupErr = false;
      this.drivingLicense.documentDupErr = false;

      this.driver.userStatusId = this.driver.userStatus.userStatusId;

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
        oldImageLink = this.driver.imageLink;
        this.driver.imageLink = await this.uploadImageToFirebase(
          this.profileImage,
          "profile"
        );
      }

      this.driver.phoneNumber = this.driver.phoneNumber
        .replace("(", "")
        .replace(")", "")
        .replace(" ", "")
        .replace("-", "");

      await this.getFirebaseLinks("indentify");
      await this.getFirebaseLinks("healthInsurance");
      await this.getFirebaseLinks("drivingLicense");
      // console.log(JSON.stringify(this.driver));

      await DriverRepository.update(this.driver)
        .then(async (res) => {
          if (res) {
            if (oldImageLink !== null) {
              let arrTemp = [
                {
                  imageLink: oldImageLink,
                },
              ];
              await this.deleteFirebaseLink(arrTemp);
            }
            await this.deleteFirebaseLink(this.indentifyImageDel);
            await this.deleteFirebaseLink(this.healthInsuranceImageDel);
            await this.deleteFirebaseLink(this.drivingLicenseImageDel);
            console.log(oldImageLink);
            console.log(this.indentifyImageDel);
            this.isCreatedSuccessfully = true;
          }
          console.log(res);
        })
        .catch((ex) => {
          if (ex.debugMessage) {
            this.errMsg = ex.debugMessage;
          }
          this.isError = true;
          console.error(ex);
        });
      this.isLoading = false;
    },
    // Get firebase links
    async getFirebaseLinks(imgTypeName) {
      let imgDataList = this.$data[imgTypeName + "Image"];
      if (imgDataList.length > 0) {
        let document = this.$data[imgTypeName + "Infor"];
        let imgArr = document.documentImagesReqList;
        let delImgArr = this.$data[imgTypeName + "ImageDel"];
        let index = 0;
        for (let img of imgDataList) {
          let url = await this.uploadImageToFirebase(img, imgTypeName);
          let imgObj = {
            documentImageId: delImgArr[index].documentImageId,
            imageLink: url,
          };
          console.log(imgArr.length);
          for (let i = 0; i < imgArr.length; i++) {
            let imgA = imgArr[i];
            console.log(imgA.documentImageId);
            console.log(delImgArr);
            if (imgA.documentImageId === delImgArr[index].documentImageId) {
              this.$delete(imgArr, index);
            }
          }
          imgArr.push(imgObj);
          index++;
        }
        // document.documentImagesReqList = imgArr;
        this.$data[imgTypeName + "Image"] = [];
      }
    },
    // Delete firebase imgs
    async deleteFirebaseLink(imgs) {
      if (imgs) {
        for (let img of imgs) {
          await this.deleteImageFromFirebase(img.imageLink);
        }
        imgs = [];
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
@import "../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

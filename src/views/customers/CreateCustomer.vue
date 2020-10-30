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
        <router-link to="/customers">
          Customers
        </router-link>
        <span class="text-secondary">/</span>
        <span>
          Create Customer
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
        Create Customer Successfully!
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>
          Customer with name {{ this.customer.fullName }} is created
          successfully!
        </h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <router-link to="/customers" class="ui blue primary button">
          <i class="checkmark icon"></i>
          Continue
        </router-link>
      </div>
    </div>

    <div class="ui basic cus-modal justify-content-center" v-if="isError">
      <div class="ui icon header col-12">
        <i class="frown outline icon mb-3"></i>
        Create Customer Fail!
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

    <!-- User Information -->
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <h4 class="ui dividing header">Customer Information</h4>

              <div class="two fields mt-4">
                <!-- Full name -->
                <div class="field">
                  <label>Full Name</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="customer.fullName"
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
                      v-model="customer.phoneNumber"
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
                      v-model="customer.dateOfBirth"
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

                <!-- Email -->
                <div class="field ">
                  <label>Email</label>
                  <div class="ui corner labeled input">
                    <input
                      type="email"
                      v-model="customer.email"
                      placeholder="Email"
                      step="any"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div class="ui pointing red basic label" v-if="isEmailErr">
                    Email is required!
                  </div>
                </div>
              </div>

              <div class="three fields">
                <!-- Fax -->
                <div class="field ">
                  <label>Fax</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="customer.fax"
                      placeholder="Fax"
                    />
                    <!-- <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div> -->
                  </div>
                  <!-- <div class="ui pointing red basic label" v-if="isFaxErr">
                   Fa is required!
                  </div> -->
                </div>
                <!-- Tax Code -->
                <div class="field ">
                  <label>Tax Code</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="customer.taxCode"
                      placeholder="Basic Salary"
                      min="1"
                      step="any"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div class="ui pointing red basic label" v-if="isTaxCodeErr">
                    Tax code is required!
                  </div>
                </div>
                <!-- Account Number -->
                <div class="field ">
                  <label>Account Number</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="customer.accountNumber"
                      placeholder="Account Number"
                      step="any"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="isAccountNumberErr"
                  >
                    Account Number is required!
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
                      v-model="customer.address"
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
                <div class="col-4">
                  <button
                    class="btn btn-gradient-danger btn-fw"
                    type="button"
                    v-on:click="clearData()"
                  >
                    Clear
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
import Loading from "vue-loading-overlay";
// import citiesJson from "../assets/json/addresses/tinh_tp.json";

// import { RepositoryFactory } from "../../repositories/RepositoryFactory";
// const CustomerRepository = RepositoryFactory.get("customers");

export default {
  name: "CreateCustomer",
  components: {
    Loading,
  },
  data() {
    return {
      customer: {
        fullName: "",
        address: "",
        dateOfBirth: "",
        phoneNumber: "",
        email: "",
        fax: "",
        taxCode: "",
        accountNumber: "",
      },
      // Basic Information Error
      isFullNameErr: false,
      isPhoneNumberErr: false,
      isBirthDateErr: false,
      isEmailErr: false,
      isTaxCodeErr: false,
      isAccountNumberErr: false,

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

    // Cheack basic information
    checkBasicInformation() {
      this.isFullNameErr = this.customer.fullName.length === 0;
      this.isAddressErr = this.customer.address.length === 0;
      this.isWardErr = this.selectedWard.name.length === 0;
      this.isDistrictErr = this.selectedDistrict.name.length === 0;
      this.isCityErr = this.selectedCity.name.length === 0;
      this.isPhoneNumberErr =
        this.customer.phoneNumber
          .replace("(", "")
          .replace(")", "")
          .replace(" ", "")
          .replace("-", "").length !== 10;
      this.isBirthDateErr = this.customer.dateOfBirth.length === 0;
      this.isEmailErr = this.customer.email.length === 0;
      this.isTaxCodeErr = this.customer.taxCode.length === 0;
      this.isAccountNumberErr = this.customer.accountNumber.length === 0;

      return (
        this.isFullNameErr ||
        this.isAddressErr ||
        this.isPhoneNumberErr ||
        this.isBirthDateErr ||
        this.isEmailErr ||
        this.isWardErr ||
        this.isDistrictErr ||
        this.isCityErr ||
        this.isTaxCodeErr
      );
    },
    clearData() {
      this.customer = {
        fullName: "",
        address: "",
        dateOfBirth: "",
        phoneNumber: "",
        email: "",
        fax: "",
        taxCode: "",
        accountNumber: "",
      };
    },
    async create() {
      let isValid = this.checkBasicInformation();
      if (!isValid) {
        // TODO: call customer create api
      }
    },
    // Get firebase links
    isNumber(evt) {
      isNumber(evt);
    },
    // Check Phone input
    phoneInput() {
      var x = this.customer.phoneNumber
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      if (x[1].charAt(0) !== "0" && x[1].length != 0) {
        x[1] = "0" + x[1];
      }
      this.customer.phoneNumber = !x[2]
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

<template>
  <div class="col-lg-12 grid-margin stretch-card">
    <div class="card">
      <div class="card-body">
        <div class="ui form">
          <h4 class="ui dividing header">CUSTOMER INFORMATION</h4>

          <div class="two fields mt-4">
            <!-- Full name -->
            <div class="field">
              <label>Full Name</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  v-model="customer.customerName"
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
              <div class="ui pointing red basic label" v-if="isPhoneNumberErr">
                Phone number is required 10 digits!
              </div>
            </div>
          </div>

          <div class="two fields">
            <!-- Fax -->
            <div class="field ">
              <label>Fax</label>
              <div class="ui corner labeled input">
                <input type="text" v-model="customer.fax" placeholder="Fax" />
                <!-- <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div> -->
              </div>
              <!-- <div class="ui pointing red basic label" v-if="isFaxErr">
                   Fa is required!
                  </div> -->
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
              <div class="ui pointing red basic label" v-if="isInValidEmailErr">
                Email is invalid format(example@domain.com)!
              </div>
            </div>
          </div>

          <div class="two fields">
            <!-- Tax Code -->
            <div class="field ">
              <label>Tax Code</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  v-model="customer.taxCode"
                  placeholder="Tax Code"
                  min="1"
                  step="any"
                  maxlength="10"
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
                  <option v-for="city in cities" :key="city.code" :value="city">
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
                @click="handleLeftBtn()"
              >
                {{ this.leftBtnTxt }}
              </button>
              <button
                class="btn btn-gradient-info btn-fw ml-2"
                type="button"
                @click="handleRightBtn()"
              >
                {{ this.rightBtnTxt }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Customer",
  props: {
    propCustomer: Object,
    leftBtnTxt: String,
    rightBtnTxt: String,
    // Function
    handlePropLeftBtn: Function,
    handlePropRightBtn: Function,
  },
  data() {
    return {
      customer: {},
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
      // Basic Information Error
      isFullNameErr: false,
      isPhoneNumberErr: false,
      isEmailErr: false,
      isInValidEmailErr: false,
      isTaxCodeErr: false,
      isAccountNumberErr: false,

      // Address error
      isAddressErr: false,
      isWardErr: false,
      isDistrictErr: false,
      isCityErr: false,
    };
  },
  mounted() {
    this.cities = this.getJsonObjects("tinh_tp.json");
    this.initData();
  },
  methods: {
    // Init data
    initData() {
      if (this.propCustomer) {
        this.customer = Object.assign({}, this.propCustomer);
        let addressArr = this.customer.address.split(", ");
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
        this.customer.address = addressArr[0];
      } else {
        this.customer = {
          customerName: "",
          address: "",
          phoneNumber: "",
          email: "",
          fax: "",
          taxCode: "",
          accountNumber: "",
        };
      }
    },
    // Handle right function
    handleLeftBtn() {
      this.handlePropLeftBtn();
    },
    // Handle right function
    handleRightBtn() {
      let isValid = this.checkBasicInformation();
      if (!isValid) {
        this.handlePropRightBtn();
      }
    },
    // Find address
    findItemFromJson(arr, findStr, typeName) {
      let keys = Object.keys(arr);
      for (let index = 0; index < keys.length; index++) {
        let item = arr[keys[index]];
        if (item[typeName] === findStr) {
          return item;
        }
      }
    },
    // Cheack basic information
    checkBasicInformation() {
      this.isFullNameErr = this.customer.customerName.length === 0;
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
      this.isEmailErr = this.customer.email.length === 0;
      // Check email format
      // eslint-disable-next-line no-useless-escape
      const reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      this.isInValidEmailErr = !reg.test(this.customer.email);
      this.isTaxCodeErr = this.customer.taxCode.length === 0;
      this.isAccountNumberErr = this.customer.accountNumber.length === 0;

      return (
        this.isFullNameErr ||
        this.isAddressErr ||
        this.isPhoneNumberErr ||
        this.isEmailErr ||
        this.isInValidEmailErr ||
        this.isWardErr ||
        this.isDistrictErr ||
        this.isCityErr ||
        this.isTaxCodeErr
      );
    },
    // Get data
    getData() {
      let customer = Object.assign({}, this.customer);
      customer.phoneNumber = customer.phoneNumber
        .replace("(", "")
        .replace(")", "")
        .replace(" ", "")
        .replace("-", "");
      // format address
      customer.address =
        customer.address +
        ", " +
        this.selectedWard.name_with_type +
        ", " +
        this.selectedDistrict.name_with_type +
        ", " +
        this.selectedCity.name_with_type;
      return customer;
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

<style></style>

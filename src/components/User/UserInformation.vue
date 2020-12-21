<template>
  <div class="col-lg-12 grid-margin stretch-card">
    <div class="card">
      <div class="card-body">
        <div class="ui form">
          <h4 class="ui dividing header">
            BASIC INFORMATION
          </h4>

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
                src="../../assets/images/unnamed.png"
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
              <div class="ui pointing red basic label" v-if="isPhoneNumberErr">
                Phone number is required 10 digits!
              </div>
            </div>
          </div>

          <div class="two fields">
            <!-- Gender  -->
            <div class="field">
              <label>Gender</label>
              <select class="ui fluid dropdown" v-model="driver.gender">
                <option value="true">Male</option>
                <option value="false">Female</option>
              </select>
            </div>

            <!-- Birthdate -->
            <div class="field" v-if="maxBirthDate">
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
              <div class="ui pointing red basic label" v-if="isBirthDateErr">
                Birthdate is required!
              </div>
            </div>

            <!-- Base Salary -->
            <div class="field" v-if="isUpdate && !isContributor">
              <label>Base Salary</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  v-model="driver.baseSalary"
                  placeholder="Basic Salary"
                  @input="moneyInput"
                />
                <div class="ui corner label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div class="ui pointing red basic label" v-if="isSalaryErr">
                Base salary is required!
              </div>
            </div>

            <!-- Password if used for contributor-->
            <div class="field" v-if="isContributor && !isUpdate">
              <label>Password</label>
              <div class="ui corner icon input">
                <input
                  type="password"
                  v-model="driver.password"
                  placeholder="Password (6 characters minimum)"
                  ref="password"
                />
                <i
                  class=" circular eye link icon cus-icon"
                  v-bind:class="{ slash: !isSeePassword }"
                  @click="seePassword"
                ></i>
                <div class="ui corner label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div class="ui pointing red basic label" v-if="isPasswordErr">
                Password is required at least 6 chars!
              </div>
            </div>
          </div>

          <div class="two fields" v-if="!isUpdate && !isContributor">
            <!-- Base Salary -->
            <div class="field ">
              <label>Base Salary</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  v-model="driver.baseSalary"
                  placeholder="Basic Salary"
                  @input="moneyInput"
                />
                <div class="ui corner label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div class="ui pointing red basic label" v-if="isSalaryErr">
                Base salary is required!
              </div>
            </div>
            <!-- Password -->
            <div class="field ">
              <label>Password</label>
              <div class="ui corner icon input">
                <input
                  type="password"
                  v-model="driver.password"
                  placeholder="Password (6 characters minimum)"
                  ref="password"
                />
                <i
                  class=" circular eye link icon cus-icon"
                  v-bind:class="{ slash: !isSeePassword }"
                  @click="seePassword"
                ></i>
                <div class="ui corner label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div class="ui pointing red basic label" v-if="isPasswordErr">
                Password is required at least 6 chars!
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
            <!-- If update user is call -->
            <div class="col-4" v-if="isUpdate">
              <button
                class="btn btn-gradient-danger btn-fw"
                type="button"
                @click="initData()"
              >
                Cancel
              </button>
              <button
                class="btn btn-gradient-info btn-fw ml-2"
                type="button"
                v-on:click="update()"
              >
                Update
              </button>
            </div>
            <!-- If not -->
            <button
              v-else
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
</template>

<script>
import { isNumber } from "../../assets/js/input.js";
import moment from "moment";

export default {
  props: {
    propDriver: Object,
    isUpdate: Boolean,
    isContributor: Boolean,
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
        userDocumentList: [],
        password: "",
      },
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
      maxBirthDate: "",
      // Basic Information Error
      isFullNameErr: false,
      isPhoneNumberErr: false,
      isBirthDateErr: false,
      isSalaryErr: false,
      isPasswordErr: false,
      isUserImgErr: false,
      // Address error
      isAddressErr: false,
      isWardErr: false,
      isDistrictErr: false,
      isCityErr: false,
      // Profile image
      profileImage: null,
      profileImagePrev: null,
      // password
      rePassword: "",
      isSeePassword: false,
    };
  },
  mounted() {
    this.cities = this.getJsonObjects("tinh_tp.json");
    //If there is a driver data
    if (this.propDriver) {
      this.initData();
    }

    this.maxBirthDate = moment(new Date())
      .subtract(18, "y")
      .format("YYYY-MM-DD");
  },
  methods: {
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
      if (!this.isContributor) {
        this.isSalaryErr = this.driver.baseSalary.length === 0;
      }
      if (!this.isUpdate) {
        this.isPasswordErr = this.driver.password.length < 6;
      }
      // this.isUserImgErr =
      //   this.profileImage === null || this.profileImage === null;
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
        this.isUserImgErr ||
        this.isPasswordErr
      );
    },
    update() {
      let isValid = this.checkBasicInformation();
      if (!isValid) {
        this.$parent.openConfirmation("BASIC_INFOR");
      }
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
    // Init data when is update
    initData() {
      this.driver = Object.assign({}, this.propDriver);
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
      this.moneyInput();
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
    // Change tab
    changeTab() {
      this.$parent.changeTab();
    },
    // Get data
    getData() {
      let driver = Object.assign({}, this.driver);
      // format phone number
      driver.phoneNumber = driver.phoneNumber
        .replace("(", "")
        .replace(")", "")
        .replace(" ", "")
        .replace("-", "");
      // format address
      driver.address =
        driver.address +
        ", " +
        this.selectedWard.name_with_type +
        ", " +
        this.selectedDistrict.name_with_type +
        ", " +
        this.selectedCity.name_with_type;
      driver.baseSalary = driver.baseSalary.replace(/\D/g, "");
      return {
        driver: driver,
        image: this.profileImage,
      };
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
    isNumber(evt) {
      isNumber(evt);
    },
    seePassword() {
      let password = this.$refs.password;
      this.isSeePassword = !this.isSeePassword;
      if (password.type === "password") {
        password.type = "text";
      } else {
        password.type = "password";
      }
    },
    // Money input
    moneyInput() {
      this.driver.baseSalary = this.driver.baseSalary
        .toString()
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  },
};
</script>

<style>
.asterisk.icon {
  color: red;
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
.ui.icon.input > i.circular.icon {
  right: 3.2em;
}
.ui.icon.input {
  border: black;
}
.ui.icon.input:hover {
  cursor: pointer;
}

.edit-btn {
  position: absolute;
  right: 1%;
  top: 1%;
}
</style>

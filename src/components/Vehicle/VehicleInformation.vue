<template>
  <div class="col-lg-12 grid-margin stretch-card">
    <ContributorsModal
      v-show="isOwnerModalVisible"
      :cancelFunction="handleVehicleOwnerModal"
      :doneFunction="getVehicleOwner"
      :userId="owner.userId"
      ref="ownerModal"
    />
    <div class="card">
      <div class="card-body">
        <div class="ui form">
          <h4 class="ui dividing header">
            BASIC INFORMATION
          </h4>

          <div class="field">
            <label>Vehicle Image</label>
          </div>

          <div class="row justify-content-center">
            <label for="up-pro-pho" class="upload-pro">
              <img
                :src="vehicle.imageLink"
                class="ui medium  image pro-img"
                alt="image"
                v-if="
                  profileImage === null &&
                    vehicle.imageLink !== null &&
                    vehicle.imageLink.length > 0
                "
              />
              <img
                :src="profileImagePrev"
                class="ui medium  image pro-img"
                alt="image"
                v-else-if="profileImage !== null"
              />
              <i class="car icon" v-else></i>
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
          <div class="row justify-content-center" v-if="isVehicleImgErr">
            <div class="ui pointing red basic label justify-content-center">
              Vehicle image is required!
            </div>
          </div>
          <div class="two fields mt-5">
            <!-- Chassis Number -->
            <div class="field">
              <label>Chassis Number/VIN</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  v-model="vehicle.chassisNumber"
                  placeholder="Chassis Number/ VIN"
                  style="text-transform:uppercase"
                  maxlength="17"
                />
                <div class="ui corner label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div
                class="ui pointing red basic label"
                v-if="isChassisNumberErr"
              >
                Chassis Number/ VIN is required 17 chars!
              </div>
            </div>
            <!-- Engine Number -->
            <div class="field">
              <label>Engine Number</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  placeholder="Engine Number"
                  v-model="vehicle.engineNumber"
                  style="text-transform:uppercase"
                  maxlength="10"
                />
                <div class="ui corner label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div class="ui pointing red basic label" v-if="isEngineNumberErr">
                Engine Number is required 10 chars!
              </div>
            </div>
            <!-- Model -->
            <div class="field">
              <label>Model</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  placeholder="Model"
                  v-model="vehicle.model"
                />
                <div class="ui corner label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div class="ui pointing red basic label" v-if="isModelErr">
                Model is required!
              </div>
            </div>
          </div>

          <div class="two fields">
            <!-- Brand -->
            <div class="field">
              <label>Brand</label>
              <div class="ui corner labeled input">
                <multiselect
                  v-model="brand"
                  :options="brandOptions"
                  track-by="brandId"
                  label="brandName"
                  placeholder="Select or add a brand"
                  :multiple="false"
                  :taggable="true"
                >
                </multiselect>
                <div class="ui corner label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div class="ui pointing red basic label" v-if="isBrandErr">
                Brand is required!
              </div>
            </div>
            <!-- Origin -->
            <div class="field">
              <label>Origin</label>
              <div class="ui corner labeled input">
                <multiselect
                  v-model="origin"
                  track-by="name"
                  label="name"
                  :options="originOtions"
                  placeholder="Select origin"
                >
                </multiselect>
                <div class="ui corner label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div class="ui pointing red basic label" v-if="isOriginErr">
                Origin is required!
              </div>
            </div>
            <!-- Year Of Manufacture -->
            <div class="field">
              <label>Year Of Manufacture</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  v-model="vehicle.yearOfManufacture"
                  placeholder="Year Of Manufacture (YYYY)"
                  maxlength="4"
                  @keypress="isNumber($event)"
                />
                <div class="ui corner label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div
                class="ui pointing red basic label"
                v-if="isYearOfManufactureErr"
              >
                Year of manufacture is required 4 numbers!
              </div>
            </div>
          </div>

          <div class="two fields">
            <!-- Seat -->
            <div class="field ">
              <label>Total Seats</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  v-model="vehicle.seats"
                  placeholder="Total Seat"
                  maxlength="4"
                  @keypress="isNumber($event)"
                />

                <div class="ui corner label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div class="ui pointing red basic label" v-if="isSeatErr">
                Total seats is required!
              </div>
            </div>
            <!-- Vehicle Type -->
            <div class="field ">
              <label>Vehicle Type</label>
              <div class="ui corner labeled input">
                <select
                  class="ui fluid dropdown cus-select"
                  v-model="vehicle.vehicleTypeId"
                >
                  <option :value="''">
                    Select vehicle type
                  </option>
                  <option
                    v-for="vehicleType in vehicleTypes"
                    :key="vehicleType.vehicleTypeId"
                    :value="vehicleType.vehicleTypeId"
                    >{{ vehicleType.vehicleTypeName }}</option
                  >
                </select>
                <div class="ui corner left label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div class="ui pointing red basic label" v-if="isVehicleTypeErr">
                Vehicle type is required!
              </div>
            </div>
            <!--Total Distance Driven -->
            <div class="field">
              <label>Total Distance Driven</label>
              <div class="ui corner labeled input">
                <input
                  v-model="vehicle.distanceDriven"
                  type="text"
                  placeholder="Total Distance Driven"
                  @keypress="isNumber($event)"
                />
                <div class="ui corner label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div
                class="ui pointing red basic label"
                v-if="isDistanceDrivenErr"
              >
                Total distance driven is required!
              </div>
            </div>
            <!-- Owner -->
            <div class="field ">
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
import Multiselect from "vue-multiselect";
import ContributorsModal from "../Modal/ContributorsModal";
import { RepositoryFactory } from "../../repositories/RepositoryFactory";

const VehicleRepository = RepositoryFactory.get("vehicles");

export default {
  components: {
    Multiselect,
    ContributorsModal,
  },
  props: {
    propVehicle: Object,
    isUpdate: Boolean,
    isContributor: Boolean,
  },
  data() {
    return {
      vehicle: {
        brandId: "",
        chassisNumber: "",
        distanceDriven: "",
        engineNumber: "",
        imageLink: "",
        model: "",
        origin: "",
        ownerId: null,
        roleId: "0",
        seats: "",
        vehicleDocuments: [],
        vehicleId: "",
        vehicleTypeId: "",
        yearOfManufacture: "",
        vehicleStatus: "",
      },
      // Basic Information Error
      isChassisNumberErr: false,
      isEngineNumberErr: false,
      isModelErr: false,
      isBrandErr: false,
      isOriginErr: false,
      isYearOfManufactureErr: false,
      isSeatErr: false,
      isDistanceDrivenErr: false,
      isVehicleTypeErr: false,
      isVehicleImgErr: false,

      // Profile image
      profileImage: null,
      profileImagePrev: null,

      // Document
      docOptions: [],
      documentValue: [],

      // Brand
      brandOptions: [],
      brand: null,
      // Origin
      originOtions: [],
      origin: null,
      // Seat
      totalSeats: [],
      seat: "",
      // vehicle Types
      vehicleTypes: [],
      vehicleType: "",
      // Owner
      owner: {
        userId: "",
        fullName: "",
      },
      // Vehicle Owner
      isOwnerModalVisible: false,
    };
  },
  async mounted() {
    this.originOtions = require("../../assets/json/contry.json");
    this.totalSeats = require("../../assets/json/vehicle/totalSeat.json");
    await this.initBrands();
    await this.initTypes();
    //If there is a vehicle data
    if (this.propVehicle) {
      this.initData();
    }
    // Init max birthdate = current year - 18
  },
  methods: {
    // Init
    // Init data when is update
    initData() {
      this.vehicle = this.copyProperties(this.propVehicle, this.vehicle);

      // Init brand
      this.brand = this.propVehicle.brand;
      // Init origin
      this.origin = this.findItemFromJson(
        this.originOtions,
        this.propVehicle.origin,
        "name"
      );
      // Init vehicle type
      this.vehicle.vehicleTypeId = this.propVehicle.vehicleType.vehicleTypeId;
      // Init owner
      this.owner.userId = this.propVehicle.owner.userId;
      this.owner.fullName = this.propVehicle.owner.userName;
    },
    // Init brands
    async initBrands() {
      await VehicleRepository.getBrands().then((res) => {
        this.brandOptions = res;
      });
    },
    // Init types
    async initTypes() {
      await VehicleRepository.getVehicleType().then((res) => {
        this.vehicleTypes = res;
      });
    },
    // Vehicle Owner
    handleVehicleOwnerModal() {
      this.isOwnerModalVisible = !this.isOwnerModalVisible;
    },
    copyProperties(src, to) {
      let toKeys = Object.keys(to);

      for (let index = 0; index < toKeys.length; index++) {
        to[toKeys[index]] = src[toKeys[index]];
      }
      return to;
    },
    // Find objet
    findItemFromJson(arr, findStr, typeName) {
      let keys = Object.keys(arr);
      for (let index = 0; index < keys.length; index++) {
        let item = arr[keys[index]];
        if (item[typeName] === findStr) {
          return item;
        }
      }
    },
    // Get vehicle owner
    getVehicleOwner() {
      this.owner = this.$refs.ownerModal.getSelectedContributor();
      this.handleVehicleOwnerModal();
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
    // Cheack basic information
    checkBasicInformation() {
      this.isChassisNumberErr = this.vehicle.chassisNumber.length !== 17;
      this.isEngineNumberErr = this.vehicle.engineNumber.length !== 10;
      this.isModelErr = this.vehicle.model.length === 0;
      this.isBrandErr = this.brand === null;
      this.isOriginErr = this.origin === null;
      this.isYearOfManufactureErr = this.vehicle.yearOfManufacture.length !== 4;
      this.isSeatErr = this.vehicle.seats.length === 0;
      this.isVehicleTypeErr = this.vehicle.vehicleTypeId.length === 0;
      this.isDistanceDrivenErr = this.vehicle.distanceDriven.length === 0;
      // this.isVehicleImgErr =
      //   this.profileImage === null || this.profileImage === null;
      this.isVehicleImgErr =
        (this.profileImage === null || this.profileImage === null) &&
        (this.vehicle.imageLink === null ||
          (this.vehicle.imageLink !== null &&
            this.vehicle.imageLink.length == 0));

      return (
        this.isChassisNumberErr ||
        this.isEngineNumberErr ||
        this.isModelErr ||
        this.isBrandErr ||
        this.isOriginErr ||
        this.isYearOfManufactureErr ||
        this.isSeatErr ||
        this.isVehicleTypeErr ||
        this.isDistanceDrivenErr ||
        this.isVehicleImgErr
      );
    },
    update() {
      let isValid = this.checkBasicInformation();
      // let isValid = false;
      if (!isValid) {
        this.$parent.openConfirmation("BASIC_INFOR");
      }
    },
    // Change tab
    changeTab() {
      this.$parent.changeTab();
    },
    // Get data
    getData() {
      let vehicle = Object.assign({}, this.vehicle);
      // format phone number
      vehicle.chassisNumber = vehicle.chassisNumber.toUpperCase().trim();
      vehicle.engineNumber = vehicle.engineNumber.toUpperCase().trim();
      vehicle.brandId = this.brand.brandId;
      vehicle.origin = this.origin.name;
      // vehicle.vehicleTypeId = this.vehicleType.vehicleTypeId;
      if (this.owner.userId.length > 0) {
        vehicle.ownerId = this.owner.userId;
      } else {
        let user = JSON.parse(localStorage.getItem("userId"));
        vehicle.ownerId = user.uid;
      }

      return {
        vehicle: vehicle,
        image: this.profileImage,
      };
    },
    isNumber(evt) {
      isNumber(evt);
    },
  },
};
</script>

<style scoped>
@import "../../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";

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
  /* border-radius: 50%; */
  width: 400px !important;
  height: 280px !important;
  border-radius: 2%;
}
.car.icon {
  font-size: 250px;
  width: 400px !important;
  height: 280px !important;
  color: rgb(161, 161, 165);
  border: rgb(214, 214, 221) 1px solid;
  border-radius: 2%;
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
  border-radius: 2% !important;
  visibility: hidden;
}
.upload-pro-plus i {
  position: absolute;
  left: 40%;
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
.ui.right.labeled {
  background-color: #3497e9;
  color: rgb(255, 255, 255);
}
</style>

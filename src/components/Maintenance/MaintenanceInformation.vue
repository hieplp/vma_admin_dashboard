<template>
  <div class="col-lg-12 grid-margin stretch-card">
    <VehiclesModal
      v-show="isVehicleModalVisible"
      :cancelFunction="handleVehicleModal"
      :doneFunction="getVehicleId"
      :vehicleId="maintenance.vehicleId"
      ref="vehicleModal"
    />
    <div class="card">
      <div class="card-body">
        <div class="ui form">
          <h4 class="ui dividing header">
            MAINTENANCE INFORMATION
          </h4>

          <div class="field">
            <label>Maintenance Image</label>
          </div>

          <div class="row justify-content-center">
            <label for="up-pro-pho" class="upload-pro">
              <img
                :src="maintenance.imageLink"
                class="ui medium  image pro-img"
                alt="image"
                v-if="
                  profileImage === null &&
                    maintenance.imageLink !== null &&
                    maintenance.imageLink.length > 0
                "
              />
              <img
                :src="profileImagePrev"
                class="ui medium  image pro-img"
                alt="image"
                v-else-if="profileImage !== null"
              />
              <i class="file alternate icon" v-else></i>
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
              Maintenance image is required!
            </div>
          </div>
          <div class="two fields mt-5">
            <!-- Start Date -->
            <div class="field">
              <label>Start Date</label>
              <div class="ui corner labeled input">
                <input type="date" v-model="maintenance.startDate" />
                <div class="ui corner label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div class="ui pointing red basic label" v-if="isStartDateErr">
                Start date is required!
              </div>
            </div>
            <!-- End Date -->
            <div class="field">
              <label>End Date</label>
              <div class="ui corner labeled input">
                <input
                  type="date"
                  v-model="maintenance.endDate"
                  :disabled="!maintenance.startDate"
                  :min="maintenance.startDate"
                />
                <div class="ui corner label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div class="ui pointing red basic label" v-if="isEndDateErr">
                End date is required!
              </div>
            </div>
            <!--  Type -->
            <div class="field ">
              <label>Type</label>
              <div class="ui corner labeled input">
                <select
                  class="ui fluid dropdown cus-select"
                  v-model="maintenance.maintenanceType"
                >
                  <option value="PERIODIC_MAINTENANCE">
                    PERIODIC MAINTENANCE
                  </option>
                  <option value="REPAIR">
                    REPAIR
                  </option>
                  >
                </select>
                <div class="ui corner left label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div class="ui pointing red basic label" v-if="isTypeErr">
                Maintenance type is required!
              </div>
            </div>
          </div>

          <div class="two fields">
            <!--Cost -->
            <div class="field">
              <label>Cost</label>
              <div class="ui corner labeled input">
                <input
                  v-model="maintenance.cost"
                  type="text"
                  placeholder="Cost"
                  @keypress="isNumber($event)"
                />
                <div class="ui corner label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div class="ui pointing red basic label" v-if="isCostErr">
                Cost is required!
              </div>
            </div>
            <!-- Vehicle -->
            <div class="field ">
              <label>Vehicle</label>
              <div class="ui action input">
                <input
                  v-model="maintenance.vehicleId"
                  type="text"
                  readonly
                  placeholder="Pick an vehicle"
                />
                <button
                  class="ui right labeled icon button"
                  @click="handleVehicleModal"
                >
                  <i class="bus icon"></i>
                  Pick
                </button>
              </div>
              <div class="ui pointing red basic label" v-if="isVehicleErr">
                Vehicle is required!
              </div>
            </div>
          </div>
          <!--Description -->
          <div class="field">
            <label>Description</label>
            <div class="ui corner labeled input">
              <textarea
                v-model="maintenance.description"
                type="text"
                rows="5"
                placeholder="Description"
              />
              <div class="ui corner label">
                <i class="asterisk icon"></i>
              </div>
            </div>
            <div class="ui pointing red basic label" v-if="isDescriptionErr">
              Description is required!
            </div>
          </div>

          <!-- Button group -->
          <div class="row justify-content-center mt-2">
            <div class="col-4">
              <button
                class="btn btn-gradient-danger btn-fw"
                type="button"
                @click="clearData()"
              >
                Cancel
              </button>
              <button
                class="btn btn-gradient-info btn-fw ml-2"
                type="button"
                @click="create()"
              >
                {{ this.isUpdate ? "Update" : "Create" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isNumber } from "../../assets/js/input.js";
import VehiclesModal from "../Modal/VehiclesModal";

export default {
  components: {
    VehiclesModal,
  },
  props: {
    propMaintenance: Object,
    isUpdate: Boolean,
    isContributor: Boolean,
    create: Function,
  },
  data() {
    return {
      maintenance: {
        cost: "",
        description: "",
        endDate: "",
        imageLink: "",
        maintenanceType: "PERIODIC_MAINTENANCE",
        startDate: "",
        vehicleId: "",
      },
      // Basic Information Error
      isStartDateErr: false,
      isEndDateErr: false,
      isCostErr: false,
      isTypeErr: false,
      isVehicleErr: false,
      isDescriptionErr: false,
      isVehicleImgErr: false,

      // Profile image
      profileImage: null,
      profileImagePrev: null,

      // maintenance vehicle modal
      isVehicleModalVisible: false,
    };
  },
  async mounted() {
    //If there is a maintenance data
    if (this.propMaintenance) {
      console.log("mounted -> this.propMaintenance", this.propMaintenance);
      this.initData();
    }
    // Init max birthdate = current year - 18
  },
  methods: {
    // Init
    // Init data when is update
    initData() {
      this.maintenance = Object.assign({}, this.propMaintenance);
    },
    // maintenance Owner
    handleVehicleModal() {
      this.isVehicleModalVisible = !this.isVehicleModalVisible;
    },

    // Get maintenance
    getVehicleId() {
      this.maintenance.vehicleId = this.$refs.vehicleModal.getSelectedVehicle();
      this.handleVehicleModal();
    },
    // Clear data
    clearData() {
      if (this.propMaintenance) {
        this.initData();
      } else {
        this.maintenance = {
          cost: "",
          description: "",
          endDate: "",
          imageLink: "",
          maintenanceType: "PERIODIC_MAINTENANCE",
          startDate: "",
          vehicleId: "",
        };
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
    // Cheack basic information
    checkBasicInformation() {
      this.isStartDateErr = this.maintenance.startDate.length === 0;
      this.isEndDateErr = this.maintenance.endDate.length === 0;
      this.isTypeErr = this.maintenance.maintenanceType.length === 0;
      this.isCostErr = this.maintenance.cost.length === 0;
      this.isVehicleErr = this.maintenance.vehicleId.length === 0;
      this.isDescriptionErr = this.maintenance.description.length === 0;

      this.isVehicleImgErr =
        (this.profileImage === null || this.profileImage === null) &&
        (this.maintenance.imageLink === null ||
          (this.maintenance.imageLink !== null &&
            this.maintenance.imageLink.length == 0));

      return (
        this.isStartDateErr ||
        this.isEndDateErr ||
        this.isTypeErr ||
        this.isCostErr ||
        this.isVehicleErr ||
        this.isVehicleImgErr ||
        this.isDescriptionErr
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
      let maintenance = Object.assign({}, this.maintenance);
      return {
        maintenance: maintenance,
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

.cus-select {
  padding-left: 26px !important;
}

.upload-pro img {
  /* border-radius: 50%; */
  width: 400px !important;
  height: 280px !important;
  border-radius: 2%;
}
.file.alternate.icon {
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

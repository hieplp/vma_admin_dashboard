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
        <a @click="$router.go(-1)" href="javascript:void(0)">
          {{ this.prevRoute === null ? "Drivers" : this.prevRoute.name }}
        </a>
        <span class="text-secondary">/</span>
        <span>
          {{ this.$route.params.userId }}
        </span>
      </h3>
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
                <div class="upload-pro">
                  <img
                    :src="driver.imageLink"
                    class="ui medium circular image pro-img"
                    alt="image"
                    @click="viewProfilePhoto()"
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
                </div>
              </div>

              <div class="row justify-content-center mt-4">
                <h4 class="col-12 text-center">ID: {{ driver.userId }}</h4>
                <p
                  class="badge ml-2"
                  v-if="driver.userStatus"
                  v-bind:class="{
                    'badge-info': driver.userStatus.userStatusName === 'Active',
                    'badge-danger':
                      driver.userStatus.userStatusName === 'Inactive',
                    'badge-warning':
                      driver.userStatus.userStatusName === 'Pending Approval',
                    'badge-dark':
                      driver.userStatus.userStatusName === 'Disabled',
                  }"
                >
                  {{ driver.userStatus.userStatusName }}
                </p>
              </div>

              <div class="two fields mt-4">
                <!-- Full name -->
                <div class="field">
                  <label>Full Name</label>
                  <div class="ui corner labeled input">
                    <input type="text" v-model="driver.fullName" readonly />
                  </div>
                </div>
                <!-- Phone number -->
                <div class="field">
                  <label>Phone Number</label>
                  <div class="ui corner labeled input">
                    <input type="text" v-model="driver.phoneNumber" readonly />
                  </div>
                </div>
                <!-- Vehicle ID -->
                <div class="field">
                  <label>Vehicle ID</label>
                  <div class="ui action input">
                    <input
                      type="text"
                      :value="driver.vehicleId ? driver.vehicleId : 'N/A'"
                      readonly
                    />
                    <button class="ui right labeled icon button">
                      <i class="truck icon"></i>
                      Assign
                    </button>
                  </div>
                </div>
              </div>

              <div class="three fields">
                <!-- Gender  -->
                <div class="field">
                  <label>Gender</label>
                  <input
                    type="text"
                    :value="driver.gender ? 'Male' : 'Female'"
                    readonly
                  />
                </div>

                <!-- Birthdate -->
                <div class="field">
                  <label>Birthdate</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="driver.dateOfBirth"
                      class="form-control"
                      readonly
                    />
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
                      readonly
                    />
                  </div>
                </div>
              </div>

              <!-- Adress -->
              <div class="field">
                <label>Address</label>
                <div class="ui corner labeled input">
                  <input
                    type="text"
                    v-model="driver.address"
                    maxlength="30"
                    readonly
                  />
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
                    v-for="(img, index) in indentifyInfor.documentImages"
                    :key="img.documentImageId"
                  >
                    <img
                      :src="img.imageLink"
                      class="ui large image"
                      @click="openGallery('indentifyInfor', index)"
                    />
                  </div>
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
                  </div>
                </div>

                <div class="field">
                  <label>Register Location</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="indentifyInfor.registeredLocation"
                      class="form-control"
                      readonly
                    />
                  </div>
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>Register Date</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="indentifyInfor.registeredDate"
                      class="form-control"
                      readonly
                    />
                  </div>
                </div>
                <div class="field">
                  <label>Expiry Date</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="indentifyInfor.expiryDate"
                      class="form-control"
                      readonly
                    />
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
                    v-for="(img, index) in healthInsuranceInfor.documentImages"
                    :key="img.documentImageId"
                  >
                    <img
                      :src="img.imageLink"
                      class="ui large image"
                      @click="openGallery('healthInsuranceInfor', index)"
                    />
                  </div>
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
                  </div>
                </div>
                <div class="field">
                  <label>Register Location</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="healthInsuranceInfor.registeredLocation"
                      class="form-control"
                      readonly
                    />
                  </div>
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>Register Date</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="healthInsuranceInfor.registeredDate"
                      class="form-control"
                      readonly
                    />
                  </div>
                </div>
                <div class="field">
                  <label>Expiry Date</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="healthInsuranceInfor.expiryDate"
                      class="form-control"
                      readonly
                    />
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
                    v-for="(img, index) in drivingLicenseInfor.documentImages"
                    :key="img.documentImageId"
                  >
                    <img
                      :src="img.imageLink"
                      class="ui large image"
                      @click="openGallery('drivingLicenseInfor', index)"
                    />
                  </div>
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
                  </div>
                </div>

                <div class="field">
                  <label>Driving license type</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      ref="drivLicenseID"
                      readonly
                      v-model="drivingLicenseInfor.otherInformation"
                    />
                  </div>
                </div>
              </div>

              <div class="two fields">
                <div class="field">
                  <label>Register Location</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      class="form-control"
                      v-model="drivingLicenseInfor.registeredLocation"
                    />
                  </div>
                </div>
                <div class="field">
                  <label>Register Date</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="drivingLicenseInfor.registeredDate"
                      class="form-control"
                      readonly
                    />
                  </div>
                </div>
                <div class="field">
                  <label>Expiry Date</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="drivingLicenseInfor.expiryDate"
                      class="form-control"
                      readonly
                    />
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
    <!-- Light box -->
    <LightBox ref="lightbox" :media="media" :showLightBox="false"></LightBox>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import LightBox from "vue-image-lightbox";
import { RepositoryFactory } from "../repositories/RepositoryFactory";
require("vue-image-lightbox/dist/vue-image-lightbox.min.css");

const DriverRepository = RepositoryFactory.get("drivers");

export default {
  name: "DriverDetail",
  components: {
    Loading,
    LightBox,
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

      isLoading: false,

      indentifyInfor: {},
      healthInsuranceInfor: {},
      drivingLicenseInfor: {},

      isUpdConVisible: false,
      media: [
        {
          thumb: "",
          src: "",
        },
      ],
      prevRoute: null,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  async mounted() {
    await this.initDetailDriver();
  },
  methods: {
    async initDetailDriver() {
      this.isLoading = true;
      await DriverRepository.getDetailDriver(this.$route.params.userId).then(
        (res) => {
          this.driver = res;

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

          this.indentifyInfor = identityCard;
          this.healthInsuranceInfor = healthInsurance;
          this.drivingLicenseInfor = drivingLicense;
        }
      );
      this.isLoading = false;
    },
    // Find document
    findDocumentByName(driverDocument, userDocumentTypeId) {
      for (let doc of driverDocument) {
        if (doc.userDocumentType.userDocumentTypeId === userDocumentTypeId) {
          return doc;
        }
      }
    },
    changeTab() {
      this.isUserInfoVisible = !this.isUserInfoVisible;
    },
    viewProfilePhoto() {
      this.media = [];
      let temp = {
        thumb: this.driver.imageLink,
        src: this.driver.imageLink,
      };
      this.media.push(temp);
      this.$refs.lightbox.showImage(0);
    },
    async openGallery(userDocumentType, index) {
      this.media = [];
      let documentImages = this.$data[userDocumentType].documentImages;
      documentImages.forEach((img) => {
        let temp = {
          thumb: img.imageLink,
          src: img.imageLink,
        };
        this.media.push(temp);
      });
      await this.$refs.lightbox.showImage(index);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.field label {
  margin-top: 10px !important;
}

.step i {
  color: #047edf !important;
}

.ui.large.image:hover {
  cursor: pointer;
}
.pro-img:hover {
  cursor: pointer;
}
.badge {
  font-size: 13px;
}

.ui.right.labeled {
  background-color: #3497e9;
  color: rgb(255, 255, 255);
}
</style>
<style>
@import "../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>

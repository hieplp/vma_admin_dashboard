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
                    src="../assets/images/unnamed.png"
                    class="ui medium circular image pro-img"
                    alt="image"
                    v-if="
                      this.driver.imageLink === null ||
                        (this.driver.imageLink != null &&
                          this.driver.imageLink.length === 0)
                    "
                  />
                  <img
                    :src="this.driver.imageLink"
                    class="ui medium circular image pro-img"
                    alt="image"
                    v-else
                  />
                </div>
              </div>

              <div class="two fields mt-4">
                <!-- Full name -->
                <div class="field">
                  <label>Full Name</label>
                  <div class="ui input">
                    <input
                      type="text"
                      v-model="driver.fullName"
                      name="Name"
                      placeholder="Full name"
                      maxlength="50"
                      disabled
                    />
                  </div>
                </div>
                <!-- Address -->
                <div class="field">
                  <label>Address</label>
                  <div class="ui input">
                    <input
                      type="text"
                      v-model="driver.address"
                      placeholder="Address"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div class="two fields">
                <!-- Gender  -->
                <div class="field">
                  <label>Gender</label>
                  <div class="ui input">
                    <input
                      type="text"
                      name="Phone Number"
                      :value="driver.gender ? 'Male' : 'Female'"
                      disabled
                    />
                  </div>
                </div>
                <!-- Phone number -->
                <div class="field">
                  <label>Phone Number</label>
                  <div class="ui input">
                    <input
                      type="text"
                      name="Phone Number"
                      v-model="driver.phoneNumber"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div class="two fields">
                <!-- Birthdate -->
                <div class="field">
                  <label>Birthdate</label>
                  <div class="ui input">
                    <input
                      type="date"
                      :value="getDate(driver.dateOfBirth)"
                      class="form-control"
                      disabled
                    />
                  </div>
                </div>
                <!-- Base Salary -->
                <div class="field ">
                  <label>Base Salary</label>
                  <div class="ui input">
                    <input
                      type="text"
                      name="Salary"
                      v-model="driver.baseSalary"
                      disabled
                    />
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
      <div
        class="col-lg-12 grid-margin stretch-card"
        v-for="(document, docIndex) in this.driver.userDocumentList"
        :key="document.userDocumentId"
      >
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <h4 class="ui dividing header">
                {{ document.userDocumentType }}
              </h4>
              <div class="field justify-content-center">
                <label class="mb-4">Images</label>
                <div class="row">
                  <div
                    class="col-3 preview-img mb-3"
                    v-for="img in document.documentImages"
                    :key="img.documentImageId"
                  >
                    <img
                      :src="img.imageLink"
                      class="ui large image"
                      @click="openGallery(docIndex)"
                    />
                  </div>
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>User Document ID</label>
                  <div class="ui input">
                    <input
                      :value="document.userDocumentId"
                      type="text"
                      name="Name"
                      disabled
                    />
                  </div>
                </div>
                <div class="field">
                  <label>Register Location</label>
                  <div class="ui input">
                    <input
                      type="text"
                      :value="document.registerLocation"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>Register Date</label>
                  <div class="ui input">
                    <input
                      type="date"
                      :value="getDate(document.registerDate)"
                      class="form-control"
                      disabled
                    />
                  </div>
                </div>
                <div class="field">
                  <label>Expiry Date</label>
                  <div class="ui input">
                    <input
                      type="date"
                      class="form-control"
                      :value="getDate(document.expiryDate)"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isImageVisible">
      <!-- Light box -->
      <LightBox ref="lightbox" :media="media" :showLightBox="false"></LightBox>
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import moment from "moment";
import { RepositoryFactory } from "../repositories/RepositoryFactory";
import LightBox from "vue-image-lightbox";

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
      driverID: "",
      driver: {},

      // Profile image
      profileImage: null,
      profileImagePrev: null,
      documentValue: null,
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

      isLoading: false,
      isImageVisible: false,

      media: [],
    };
  },
  mounted() {
    this.userId = this.$route.params.userId;

    this.initDriver();
  },
  methods: {
    initDriver() {
      DriverRepository.getDetailDriver(this.userId).then((res) => {
        let driver = Object.assign({}, res.data.driverDetail);
        this.driver = driver;
        console.log(res.data);
      });
    },
    changeTab() {
      this.isUserInfoVisible = !this.isUserInfoVisible;
    },
    getDate(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    // Handle document image light box
    openGallery(index) {
      this.isImageVisible = true;
      // this.$refs.lightbox.showImage(index);\
      this.$refs.lightbox.showImage(0);
      this.media = [];
      let documentImages = this.driver.userDocumentList[index].documentImages;
      documentImages.forEach((img) => {
        let temp = {
          thumb: img.imageLink,
          src: img.imageLink,
        };
        this.media.push(temp);
      });
      this.isImageVisible = true;
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

.ui.input input[type="text"][disabled] {
  font-size: 15px;
  color: #000000 !important;
  font-weight: 500 !important;
}

.ui.input input[type="date"][disabled] {
  font-size: 15px;
  color: #000000 !important;
  font-weight: 500 !important;
}
</style>
<style>
@import "../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
G

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
                  <div class="title">BASIC INFORMATION</div>
                </div>
              </button>
              <button
                class="step"
                v-on:click="changeTab()"
                v-bind:class="{ active: !isUserInfoVisible }"
              >
                <i class="mdi mdi-file-document icon"></i>
                <div class="content">
                  <div class="title">DOCUMENT</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- User Information -->
    <div class="row" v-show="isUserInfoVisible">
      <UserInformation ref="userInformation" />
    </div>
    <!-- User document -->
    <div class="row" v-show="!isUserInfoVisible">
      <!-- Indentify Card -->
      <UserDocument
        :title="'Identify card'"
        :maxImage="2"
        :idMaxLength="[9, 12]"
        :isNumberInp="true"
        :expiryMaxDate="10"
        :documentType="'IDENTITY_CARD'"
        :isDuplicated="indentifyDocumentDupErr"
        ref="indentifyCard"
      />
      <!-- Health Insurance -->
      <UserDocument
        :title="'Health insurance'"
        :maxImage="2"
        :idMaxLength="[15]"
        :isNumberInp="false"
        :expiryMaxDate="1"
        :documentType="'HEALTH_INSURANCE'"
        :isDuplicated="healthInsuranceDocumentDupErr"
        ref="healthInsurance"
      />
      <!-- Health Insurance -->
      <DrivingLicenseDocument
        :maxImage="2"
        :isNumberInp="true"
        :documentType="'DRIVING_LICENSE'"
        :isDuplicated="drivingLicenseDocumentDupErr"
        ref="drivingLicense"
      />

      <!-- Driving License -->

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
import * as firebase from "firebase";
import Loading from "vue-loading-overlay";
import moment from "moment";
import UserDocument from "../../components/UserDocument/UserDocument";
import DrivingLicenseDocument from "../../components/UserDocument/DrivingLicenseDocument";
import UserInformation from "../../components/User/UserInformation";
// import citiesJson from "../assets/json/addresses/tinh_tp.json";

import { RepositoryFactory } from "../../repositories/RepositoryFactory";
// eslint-disable-next-line no-unused-vars
const DriverRepository = RepositoryFactory.get("drivers");
export default {
  name: "CreateDriver",
  components: {
    Loading,
    UserDocument,
    DrivingLicenseDocument,
    UserInformation,
  },
  data() {
    return {
      driver: {},
      // Profile image
      profileImage: null,
      isUserInfoVisible: true,
      imageData: null,
      // Indentify image
      indentifyImage: [],
      // Health Insurance
      healthInsuranceImage: [],
      // Driving License
      drivingLicenseImage: [],
      // document duplicate
      indentifyDocumentDupErr: false,
      healthInsuranceDocumentDupErr: false,
      drivingLicenseDocumentDupErr: false,

      isLoading: false,
      isCreatedSuccessfully: false,
      isError: false,
      errMsg: "",
    };
  },
  mounted() {},
  methods: {
    // Upload image to firebase
    uploadImageToFirebase(imageData, imgTypeName) {
      return new Promise((resolve) => {
        let date = moment(new Date()).format("YYYYMMDDHHmmss");
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
    async create() {
      let isValid =
        this.$refs.indentifyCard.check() ||
        this.$refs.healthInsurance.check() ||
        this.$refs.drivingLicense.check();

      // isValid = false;
      if (!isValid) {
        this.isLoading = true;
        let userInformation = this.$refs.userInformation.getData();
        this.driver = userInformation.driver;
        this.profileImage = userInformation.image;

        let indentify = this.$refs.indentifyCard.getData();
        this.driver.userDocumentReqList[0] = indentify.document;
        this.indentifyImage = indentify.images;

        let healthInsurance = this.$refs.healthInsurance.getData();
        this.driver.userDocumentReqList[1] = healthInsurance.document;
        this.healthInsuranceImage = healthInsurance.images;

        let drivingLicense = this.$refs.drivingLicense.getData();
        this.driver.userDocumentReqList[2] = drivingLicense.document;
        this.drivingLicenseImage = drivingLicense.images;

        this.driver.userId = this.driver.userDocumentReqList[0].userDocumentId;
        this.indentifyDocumentDupErr = false;
        this.healthInsuranceDocumentDupErr = false;
        this.drivingLicenseDocumentDupErr = false;
        // Init image for profile
        if (this.profileImage) {
          this.driver.imageLink = await this.uploadImageToFirebase(
            this.profileImage,
            "profile"
          );
          this.profileImage = null;
        }

        // Delete old firebase image link
        await this.deleteFirebaseLink(
          this.driver.userDocumentReqList[0].documentImagesReqList
        );
        this.driver.userDocumentReqList[0].documentImagesReqList = [];
        await this.deleteFirebaseLink(
          this.driver.userDocumentReqList[1].documentImagesReqList
        );
        this.driver.userDocumentReqList[1].documentImagesReqList = [];
        await this.deleteFirebaseLink(
          this.driver.userDocumentReqList[2].documentImagesReqList
        );
        this.driver.userDocumentReqList[2].documentImagesReqList = [];
        // Upload images to firebase
        await this.getFirebaseLinks("indentifyImage", 0);
        await this.getFirebaseLinks("healthInsuranceImage", 1);
        await this.getFirebaseLinks("drivingLicenseImage", 2);

        console.log(this.driver);
        // Call api to create new driver
        await DriverRepository.create(this.driver)
          .then((res) => {
            if (res) {
              this.isCreatedSuccessfully = true;
            }
          })
          .catch((ex) => {
            console.log(ex);
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
            userDocumentImageId: 0,
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
      let isValid = this.$refs.userInformation.checkBasicInformation();
      // let isValid = false;
      if (!isValid) {
        document.getElementById("app").scrollIntoView();
        this.isUserInfoVisible = !this.isUserInfoVisible;
      }
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

.step i {
  color: #047edf !important;
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

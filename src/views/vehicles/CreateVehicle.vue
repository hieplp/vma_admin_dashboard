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
        <router-link to="/vehicles">
          Vehicles
        </router-link>
        <span class="text-secondary">/</span>
        <span>
          Create Vehicle
        </span>
      </h3>
    </div>
    <!-- Error modal -->
    <div
      class="ui basic cus-modal justify-content-center"
      v-if="isCreatedSuccessfully"
    >
      <div class="ui icon header col-12">
        <i class="check circle icon mb-3"></i>
        Create Vehicle Successfully!
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>
          Vehicle with name {{ this.vehicle.vehicleId }} is created
          successfully!
        </h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <router-link to="/vehicles" class="ui blue primary button">
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
                <i class="ui bus icon icon"></i>
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
      <VehicleInformation ref="vehicleInformation" />
    </div>
    <!-- User document -->
    <div class="row" v-show="!isUserInfoVisible">
      <!-- Select document -->
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <h4 class="ui dividing header">SELECT DOCUMENT</h4>
            </div>
            <div class="field mt-2">
              <multiselect
                v-model="documentValue"
                :options="docOptions"
                placeholder="Select or add a document"
                :multiple="true"
                :taggable="true"
                :searchable="false"
              >
              </multiselect>
            </div>
          </div>
        </div>
      </div>
      <!-- Vehicle registration certificate -->
      <VehicleDocument
        :title="'Vehicle registration certificate'"
        :maxImage="2"
        :isOtherInfoVisible="true"
        :otherInfoMaxLength="8"
        :otherInfoMinLength="7"
        :type="2"
        :isExpiryDateVisible="true"
        :documentType="'VEHICLE_REGISTRATION_CERTIFICATE'"
        otherInformationTitle="License Plate"
        ref="vehicleRegistrationCer"
        v-if="checkDocumentSelected('VEHICLE_REGISTRATION_CERTIFICATE')"
      />
      <!-- Civil liability insurace certificate -->
      <VehicleDocument
        :title="'Civil liability insurace certificate'"
        :maxImage="2"
        :idMaxLength="[9]"
        :expiryMaxDate="1"
        :otherInfoMaxLength="8"
        :otherInfoMinLength="7"
        :type="1"
        :documentType="'CIVIL_LIABILITY_INSURANCE_CERTIFICATE'"
        otherInformationTitle="License Plate"
        ref="civilLiabilityInsur"
        v-if="checkDocumentSelected('CIVIL_LIABILITY_INSURANCE_CERTIFICATE')"
      />

      <!-- Confirm Group -->
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <!-- Button group -->
              <div class="row justify-content-center">
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
import VehicleDocument from "../../components/Vehicle/VehicleDocument";
import VehicleInformation from "../../components/Vehicle/VehicleInformation";
import Multiselect from "vue-multiselect";

import { RepositoryFactory } from "../../repositories/RepositoryFactory";
// eslint-disable-next-line no-unused-vars
const VehicleRepository = RepositoryFactory.get("vehicles");

export default {
  name: "CreateVehicle",
  components: {
    Loading,
    VehicleDocument,
    VehicleInformation,
    Multiselect,
  },
  data() {
    return {
      vehicle: {},
      // Profile image
      profileImage: null,
      isUserInfoVisible: true,
      imageData: null,
      // Identity image
      identityImage: [],
      // Health Insurance
      healthInsuranceImage: [],
      // Driving License
      drivingLicenseImage: [],
      // document duplicate
      identityDocumentDupErr: false,
      healthInsuranceDocumentDupErr: false,
      drivingLicenseDocumentDupErr: false,

      isLoading: false,
      isCreatedSuccessfully: false,
      isError: false,
      errMsg: "",

      // Document
      docOptions: [],
      documentValue: [],
      index: 0,
    };
  },
  mounted() {
    this.docOptions = require("../../assets/json/vehicle/documentTypes.json");
    this.documentValue = this.docOptions;
  },
  methods: {
    // check document is selected
    checkDocumentSelected(id) {
      for (const document of this.documentValue) {
        if (document === id) {
          return true;
        }
      }
      return false;
    },
    // Upload image to firebase
    uploadImageToFirebase(imageData, imgTypeName) {
      return new Promise((resolve) => {
        let date = moment(new Date()).format("YYYYMMDDHHmmss");
        const storageRef = firebase
          .storage()
          .ref(imgTypeName + "-" + this.vehicle.fullName + "-" + date)
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
    // Check document
    checkDocument() {
      // Check identity card
      let vehicleRegistrationCerValid = false;
      if (this.checkDocumentSelected("VEHICLE_REGISTRATION_CERTIFICATE")) {
        vehicleRegistrationCerValid = this.$refs.vehicleRegistrationCer.check();
      }
      // CIVIL LIABILITY INSURANCE CERTIFICATE
      let civilLiabilityInsurValid = false;
      if (this.checkDocumentSelected("CIVIL_LIABILITY_INSURANCE_CERTIFICATE")) {
        civilLiabilityInsurValid = this.$refs.civilLiabilityInsur.check();
      }

      return vehicleRegistrationCerValid || civilLiabilityInsurValid;
    },
    // Init data document
    async initDataDocument(documentTypeId, documentRef) {
      if (this.checkDocumentSelected(documentTypeId)) {
        this.$refs[documentRef].handleDuplicateErr(false);
        let document = this.$refs[documentRef].getData();
        this.vehicle.vehicleDocuments[this.index] = document.document;
        // // Delete old firebase image link
        // await this.deleteFirebaseLink(
        //   this.vehicle.vehicleDocuments[this.index].imageLinks
        // );
        this.vehicle.vehicleDocuments[this.index].imageLinks = [];
        // Upload images to firebase
        this.vehicle.vehicleDocuments[
          this.index
        ].imageLinks = await this.getFirebaseLinks(
          document.images,
          documentTypeId
        );
        this.index++;
      } else {
        let oldIndex = this.getIndexOfDocument(documentTypeId);
        if (oldIndex >= 0) {
          this.$delete(this.vehicle.vehicleDocuments, oldIndex);
        }
      }
    },
    // Find index of document
    getIndexOfDocument(userDocumentType) {
      for (
        let index = 0;
        index < this.vehicle.vehicleDocuments.length;
        index++
      ) {
        let document = this.vehicle.vehicleDocuments[index].userDocumentType;
        if (document === userDocumentType) {
          return 1;
        }
      }
      return -1;
    },
    // Create
    async create() {
      let isValid = this.checkDocument();
      // isValid = false;
      if (!isValid) {
        this.isLoading = true;
        let vehicleInformation = this.$refs.vehicleInformation.getData();
        this.vehicle = vehicleInformation.vehicle;
        this.profileImage = vehicleInformation.image;

        this.index = 0;
        await this.initDataDocument(
          "VEHICLE_REGISTRATION_CERTIFICATE",
          "vehicleRegistrationCer"
        );
        await this.initDataDocument(
          "CIVIL_LIABILITY_INSURANCE_CERTIFICATE",
          "civilLiabilityInsur"
        );
        // Init image for profile
        if (this.profileImage) {
          this.vehicle.imageLink = await this.uploadImageToFirebase(
            this.profileImage,
            "profile"
          );
          this.profileImage = null;
        }
        this.vehicle.vehicleId = this.vehicle.vehicleDocuments[0].vehicleDocumentId;

        if (this.vehicle.vehicleValue.value) {
          this.vehicle.vehicleValue.vehicleId = this.vehicle.vehicleId;
        } else {
          this.vehicle.vehicleValue = null;
        }
        // Call api to create new vehicle
        await VehicleRepository.create(this.vehicle)
          .then((res) => {
            if (res) {
              this.isCreatedSuccessfully = true;
            }
          })
          .catch((ex) => {
            if (ex.debugMessage.includes("Document with ID")) {
              this.errMsg =
                "Civil liability insurace certificate id is duplicated!";
              this.$refs.civilLiabilityInsur.handleDuplicateErr(true);
              this.isError = true;
            } else if (ex.debugMessage.includes("Vehicle with ID")) {
              this.isError = true;
              this.errMsg =
                "Vehicle registration certificate id is duplicated!";
              this.$refs.vehicleRegistrationCer.handleDuplicateErr(true);
            } else {
              this.isError = true;
              this.errMsg = ex.debugMessage;
            }
            if (ex.debugMessage) {
              this.isError = true;
              this.errMsg = ex.debugMessage;
            }
            console.error(ex);
          });
        this.isLoading = false;
      }
    },
    // Get firebase links
    async getFirebaseLinks(imgDataList, imgTypeName) {
      // let imgDataList = this.$data[imgTypeName];
      let imgArr = [];
      if (imgDataList) {
        for (let img of imgDataList) {
          let url = await this.uploadImageToFirebase(img, imgTypeName);
          imgArr.push(url);
        }
      }
      return imgArr;
    },
    // Delete firebase imgs
    async deleteFirebaseLink(imgs) {
      for (let img of imgs) {
        await this.deleteImageFromFirebase(img.imageLink);
      }
      imgs = [];
    },
    changeTab() {
      let isValid = this.$refs.vehicleInformation.checkBasicInformation();
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

.cus-select {
  padding-left: 26px !important;
}
.cus-disable {
  background-color: #858585 !important;
  color: white;
}
</style>

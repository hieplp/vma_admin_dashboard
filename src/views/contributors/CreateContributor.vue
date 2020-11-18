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
        <router-link to="/contributors">
          Contributors
        </router-link>
        <span class="text-secondary">/</span>
        <span>
          Create Contributor
        </span>
      </h3>
    </div>
    <!-- Error message -->
    <MessageModal
      title="Create Contributor Fail!"
      icon="frown outline "
      :subTitle="errMsg"
      :proFunc="
        () => {
          this.isError = !this.isError;
        }
      "
      v-if="isError"
    />
    <!-- Success message -->
    <MessageModal
      title="Create Contributor Successfully!"
      icon="check circle"
      :subTitle="
        `Contributor with name ${this.contributor.fullName} is created successfully！`
      "
      :proFunc="
        () => {
          this.$router.push({
            name: 'Contributors',
          });
        }
      "
      v-if="isCreatedSuccessfully"
    />

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
      <UserInformation ref="userInformation" :isContributor="true" />
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
      <!-- Identity Card -->
      <UserDocument
        :title="'Identify card'"
        :maxImage="2"
        :idMaxLength="[9, 12]"
        :isNumberInp="true"
        :expiryMaxDate="10"
        :documentType="'IDENTITY_CARD'"
        :isDuplicated="identityDocumentDupErr"
        ref="identityCard"
        v-if="checkDocumentSelected('IDENTITY_CARD')"
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
        v-if="checkDocumentSelected('HEALTH_INSURANCE')"
      />
      <!-- Health Insurance -->
      <DrivingLicenseDocument
        :maxImage="2"
        :isNumberInp="true"
        :documentType="'DRIVING_LICENSE'"
        :isDuplicated="drivingLicenseDocumentDupErr"
        ref="drivingLicense"
        v-if="checkDocumentSelected('DRIVING_LICENSE')"
      />

      <!-- Driving License -->

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
import { mapActions } from "vuex";
import * as firebase from "firebase";
import Loading from "vue-loading-overlay";
import moment from "moment";
import UserDocument from "../../components/UserDocument/UserDocument";
import MessageModal from "../../components/Modal/MessageModal";
import DrivingLicenseDocument from "../../components/UserDocument/DrivingLicenseDocument";
import UserInformation from "../../components/User/UserInformation";
import Multiselect from "vue-multiselect";

export default {
  name: "CreateDriver",
  components: {
    Loading,
    UserDocument,
    DrivingLicenseDocument,
    UserInformation,
    Multiselect,
    MessageModal,
  },
  data() {
    return {
      contributor: {},
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
    this.docOptions = require("../../assets/json/document/userDocument.json");
    this.documentValue.push("IDENTITY_CARD");
  },
  methods: {
    // Map actions
    ...mapActions("User", ["_create"]),
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
          .ref(imgTypeName + "-" + this.contributor.fullName + "-" + date)
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
      let idValid = false;
      if (this.checkDocumentSelected("IDENTITY_CARD")) {
        idValid = this.$refs.identityCard.check();
      }
      // Check health insurance
      let healthValid = false;
      if (this.checkDocumentSelected("HEALTH_INSURANCE")) {
        healthValid = this.$refs.healthInsurance.check();
      }
      // Check driving card
      let drivValid = false;
      if (this.checkDocumentSelected("DRIVING_LICENSE")) {
        drivValid = this.$refs.drivingLicense.check();
      }
      return idValid || healthValid || drivValid;
    },
    // Init data document
    async initDataDocument(documentTypeId, documentRef) {
      if (this.checkDocumentSelected(documentTypeId)) {
        this.$refs[documentRef].handleDuplicateErr(false);
        let document = this.$refs[documentRef].getData();
        this.contributor.userDocumentList[this.index] = document.document;
        // Delete old firebase image link
        await this.deleteFirebaseLink(
          this.contributor.userDocumentList[this.index].userDocumentImages
        );
        this.contributor.userDocumentList[this.index].userDocumentImages = [];
        // Upload images to firebase
        this.contributor.userDocumentList[
          this.index
        ].userDocumentImages = await this.getFirebaseLinks(
          document.images,
          documentTypeId
        );
        this.index++;
      } else {
        let oldIndex = this.getIndexOfDocument(documentTypeId);
        if (oldIndex >= 0) {
          this.$delete(this.contributor.userDocumentList, oldIndex);
        }
      }
    },
    // Find index of document
    getIndexOfDocument(userDocumentType) {
      for (
        let index = 0;
        index < this.contributor.userDocumentList.length;
        index++
      ) {
        let document = this.contributor.userDocumentList[index]
          .userDocumentType;
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
        let userInformation = this.$refs.userInformation.getData();
        this.contributor = userInformation.driver;
        this.profileImage = userInformation.image;

        this.index = 0;
        await this.initDataDocument("IDENTITY_CARD", "identityCard");
        await this.initDataDocument("HEALTH_INSURANCE", "healthInsurance");
        await this.initDataDocument("DRIVING_LICENSE", "drivingLicense");

        this.identityDocumentDupErr = false;
        this.healthInsuranceDocumentDupErr = false;
        this.drivingLicenseDocumentDupErr = false;

        // Init image for profile
        if (this.profileImage) {
          this.contributor.imageLink = await this.uploadImageToFirebase(
            this.profileImage,
            "profile"
          );
          this.profileImage = null;
        }
        console.log(this.contributor);
        // Call api to create new contributor
        await this._create({ user: this.contributor, roleId: 2 })
          .then((res) => {
            if (res) {
              this.isCreatedSuccessfully = true;
            }
          })
          .catch((ex) => {
            if (
              ex.debugMessage.includes(
                "Cannot insert duplicate key in object 'dbo.user_document'"
              )
            ) {
              if (
                this.contributor.userDocumentList[2] &&
                ex.debugMessage.includes(
                  this.contributor.userDocumentList[2].userDocumentId
                )
              ) {
                this.errMsg = "Driving license id is duplicated!";
                // this.$refs.drivingLicense.focus();
                this.$refs.drivingLicense.handleDuplicateErr(true);
              }
              if (
                this.contributor.userDocumentList[1] &&
                ex.debugMessage.includes(
                  this.contributor.userDocumentList[1].userDocumentId
                )
              ) {
                this.errMsg = "Health insurance id is duplicated!";
                // this.$refs.healthInsurance.focus();
                this.$refs.healthInsurance.handleDuplicateErr(true);
              }
              if (
                this.contributor.userDocumentList[0] &&
                ex.debugMessage.includes(
                  this.contributor.userDocumentList[0].userDocumentId
                )
              ) {
                this.errMsg = "Identity ID is duplicated!";
                // this.$refs.identityCard.focus();
                this.$refs.identityCard.handleDuplicateErr(true);
              }
              this.isError = true;
            } else if (
              ex.debugMessage.includes(
                "Cannot insert duplicate key in object 'dbo.user'"
              )
            ) {
              this.isError = true;
              this.errMsg = "Identity ID is duplicated!";
              // this.identity.documentDupErr = true;
              // this.$refs.identityID.focus();
              this.$refs.identityCard.handleDuplicateErr(true);
            } else {
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
          let imgObj = {
            userDocumentImageId: 0,
            imageLink: url,
          };
          imgArr.push(imgObj);
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

.cus-select {
  padding-left: 26px !important;
}
.cus-disable {
  background-color: #858585 !important;
  color: white;
}
</style>

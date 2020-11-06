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
          Update Contributor
        </span>
      </h3>
    </div>

    <Confirmation
      icon="edit outline"
      title="Update Confirmation"
      subTitle="Do you want to update this contributor?"
      rightBtnTitle="Update"
      rightBtnIcon="check"
      rightBtnColor="blue"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="red"
      v-if="isUpdConVisible"
      :handleLeftBtn="
        () => {
          this.isUpdConVisible = !this.isUpdConVisible;
        }
      "
      :handleRightBtn="handleUpdateCon"
    />
    <div
      class="ui basic cus-modal justify-content-center"
      v-if="isCreatedSuccessfully"
    >
      <div class="ui icon header col-12">
        <i class="check circle icon mb-3"></i>
        Update Contributor Successfully!
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>
          Contributor with name {{ this.contributor.fullName }} is updated
          successfully!
        </h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <button
          @click="isCreatedSuccessfully = !isCreatedSuccessfully"
          class="ui blue primary button"
        >
          <i class="checkmark icon"></i>
          Ok
        </button>
      </div>
    </div>

    <div class="ui basic cus-modal justify-content-center" v-if="isError">
      <div class="ui icon header col-12">
        <i class="frown outline icon mb-3"></i>
        Update Contributor Fail!
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
    <div class="row" v-show="isUserInfoVisible">
      <UserInformation
        ref="userInformation"
        :isUpdate="true"
        :isContributor="true"
        :propDriver="contributor"
        v-if="isUserComLoading"
      />
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

      <!-- Indentify Card -->
      <UpdateUserDocument
        :title="'Identify card'"
        :maxImage="2"
        :idMaxLength="[9, 12]"
        :isNumberInp="true"
        :expiryMaxDate="10"
        :documentType="'IDENTITY_CARD'"
        :propDocument="indentifyInfor"
        ref="identityCard"
        v-if="this.isDocumentLoading && this.indentifyInfor"
      />
      <!-- Health Insurance -->
      <UpdateUserDocument
        :title="'Health insurance'"
        :maxImage="2"
        :idMaxLength="[15]"
        :isNumberInp="false"
        :expiryMaxDate="1"
        :documentType="'HEALTH_INSURANCE'"
        :propDocument="healthInsuranceInfor"
        ref="healthInsurance"
        v-if="this.isDocumentLoading && this.healthInsuranceInfor"
      />
      <!-- Health Insurance -->
      <UpdateDrivingLicenseDocument
        :maxImage="2"
        :isNumberInp="true"
        :documentType="'DRIVING_LICENSE'"
        :propDocument="drivingLicenseInfor"
        ref="drivingLicense"
        v-if="this.isDocumentLoading && this.drivingLicenseInfor"
      />
    </div>
  </div>
</template>

<script>
import * as firebase from "firebase";
import Loading from "vue-loading-overlay";
import moment from "moment";
import UserInformation from "../../components/User/UserInformation";
import Confirmation from "../../components/Modal/Confirmation";
import Multiselect from "vue-multiselect";
import UpdateUserDocument from "../../components/UserDocument/Update User Document/UpdateUserDocument";
import UpdateDrivingLicenseDocument from "../../components/UserDocument/Update User Document/UpdateDrivingLicenseDocument";

import { RepositoryFactory } from "../../repositories/RepositoryFactory";
const ContributorRepository = RepositoryFactory.get("contributors");
const UserRepository = RepositoryFactory.get("users");
const DocumentRepository = RepositoryFactory.get("documents");

export default {
  name: "UpdateContributor",
  components: {
    Loading,
    UserInformation,
    Confirmation,
    Multiselect,
    UpdateUserDocument,
    UpdateDrivingLicenseDocument,
  },
  data() {
    return {
      contributor: {},
      // Profile image
      profileImage: null,
      isUserInfoVisible: true,
      uploadValue: 0,
      imageData: null,
      // Indentify image
      indentifyImage: [],
      indentifyImageDel: [],
      // Health Insurance
      healthInsuranceImage: [],
      healthInsuranceImageDel: [],
      // Driving License
      drivingLicenseImage: [],
      drivingLicenseImageDel: [],
      // Basic Information Error

      isLoading: false,
      isCreatedSuccessfully: false,
      isError: false,
      errMsg: "",

      documentExpiryDate: [],

      indentifyInfor: null,
      healthInsuranceInfor: null,
      drivingLicenseInfor: null,

      isUpdConVisible: false,
      isUserComLoading: false,
      isDocumentLoading: false,

      // Confirmation type
      confType: 0,

      // Document
      docOptions: [],
      documentValue: [],
    };
  },
  async mounted() {
    await this.initDetailContributor();
    this.docOptions = require("../../assets/json/document/userDocument.json");
  },
  methods: {
    async initDetailContributor() {
      this.isLoading = true;
      ContributorRepository.getDetailContributor(
        this.$route.params.userId
      ).then((res) => {
        this.contributor = res;
        console.log(this.contributor);
        this.isUserComLoading = true;
      });
      this.isLoading = false;
    },
    // Find document
    findDocumentByName(contributorDocument, userDocumentType) {
      for (let doc of contributorDocument) {
        if (doc.userDocumentType === userDocumentType) {
          return doc;
        }
      }
    },
    // Update basic information
    async updateBasicInformation() {
      this.isLoading = true;
      let contributor = this.$refs.userInformation.getData().driver;
      let oldImg = null;
      let newImg = this.$refs.userInformation.getData().image;
      // Init image list for indentify card
      if (newImg) {
        oldImg = contributor.imageLink;
        contributor.imageLink = await this.uploadImageToFirebase(
          newImg,
          "profile"
        );
        console.log(oldImg);
      }
      await UserRepository.update(contributor)
        .then(async (res) => {
          if (res) {
            if (oldImg !== null) {
              let arrTemp = [
                {
                  imageLink: oldImg,
                },
              ];
              await this.deleteFirebaseLink(arrTemp);
            }
            this.isCreatedSuccessfully = true;
          }
        })
        .catch(async (ex) => {
          if (ex) {
            // Delete new firebase image
            if (newImg !== null) {
              let arrTemp = [
                {
                  imageLink: newImg,
                },
              ];
              await this.deleteFirebaseLink(arrTemp);
            }
            if (ex.debugMessage) {
              this.errMsg = ex.debugMessage;
            }
            this.isError = true;
          }
        });
      this.isLoading = false;
    },

    // Upload image to firebase
    uploadImageToFirebase(imageData, imgTypeName) {
      return new Promise((resolve) => {
        let date = moment(new Date()).format("YYYYMMDDHHmmss");
        const storageRef = firebase
          .storage()
          .ref(imgTypeName + "-" + this.contributor.userId + "-" + date)
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
    // Open update confirmation dialog
    openConfirmation(type) {
      this.isUpdConVisible = true;
      this.confType = type;
    },
    handleUpdateCon() {
      switch (this.confType) {
        case "BASIC_INFOR":
          this.isUpdConVisible = false;
          this.updateBasicInformation();
          break;
        case "IDENTITY_CARD":
          this.isUpdConVisible = false;
          this.updateDocument("identityCard");
          break;
        case "HEALTH_INSURANCE":
          this.isUpdConVisible = false;
          this.updateDocument("healthInsurance");
          break;
        case "DRIVING_LICENSE":
          this.isUpdConVisible = false;
          this.updateDocument("drivingLicense");
          break;
      }
    },
    async updateDocument(documentType) {
      this.isLoading = true;
      let resDoc = this.$refs[documentType].getData();
      let document = resDoc.document;
      let newImgs = resDoc.images;
      let delImgs = resDoc.delImage;
      document.userDocumentImages = await this.getFirebaseLinks(
        newImgs,
        delImgs,
        document.userDocumentImages,
        documentType
      );
      console.log(document);
      console.log(delImgs);
      await DocumentRepository.update(document, this.contributor.userId)
        .then(async (res) => {
          if (res) {
            await this.deleteFirebaseLink(delImgs);
            this.isCreatedSuccessfully = true;
          }
        })
        .catch((ex) => {
          if (ex.debugMessage) {
            this.errMsg = ex.debugMessage;
          }
          this.isError = true;
          console.error(ex);
        });
      this.isLoading = false;
    },
    // Get firebase links
    async getFirebaseLinks(newImg, delImg, oldImg, imgTypeName) {
      if (newImg) {
        let index = 0;
        for (let img of newImg) {
          let url = await this.uploadImageToFirebase(img, imgTypeName);
          let userDocumentImageId =
            delImg !== null && delImg.length > index
              ? delImg[index].userDocumentImageId
              : 0;
          let imgObj = {
            userDocumentImageId: userDocumentImageId,
            imageLink: url,
          };
          if (delImg !== null && delImg.length > 0) {
            for (let i = 0; i < oldImg.length; i++) {
              let imgA = oldImg[i];
              if (
                imgA.userDocumentImageId === delImg[index].userDocumentImageId
              ) {
                this.$delete(oldImg, i);
              }
            }
          }
          oldImg.push(imgObj);
          index++;
        }
      }
      return oldImg;
    },
    // Delete firebase imgs
    async deleteFirebaseLink(imgs) {
      if (imgs !== null) {
        for (let img of imgs) {
          await this.deleteImageFromFirebase(img.imageLink);
        }
        imgs = [];
      }
    },
    changeTab() {
      let isValid = this.$refs.userInformation.checkBasicInformation();
      // let isValid = false;

      if (!isValid) {
        document.getElementById("app").scrollIntoView();
        this.isUserInfoVisible = !this.isUserInfoVisible;
        // Init document data
        if (!this.isUserInfoVisible && !this.isDocumentLoading) {
          this.indentifyInfor = this.findDocumentByName(
            this.contributor.userDocumentList,
            "IDENTITY_CARD"
          );
          this.healthInsuranceInfor = this.findDocumentByName(
            this.contributor.userDocumentList,
            "HEALTH_INSURANCE"
          );
          this.drivingLicenseInfor = this.findDocumentByName(
            this.contributor.userDocumentList,
            "DRIVING_LICENSE"
          );
          this.isDocumentLoading = true;
        }
      }
    },

    // Check Phone input
    phoneInput() {
      var x = this.contributor.phoneNumber
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      if (x[1].charAt(0) !== "0" && x[1].length != 0) {
        x[1] = "0" + x[1];
      }
      this.contributor.phoneNumber = !x[2]
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

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
          Update Driver
        </span>
      </h3>
    </div>

    <Confirmation
      icon="edit outline"
      title="Update Confirmation"
      subTitle="Do you want to update this driver?"
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
    <!-- Error message -->
    <MessageModal
      title="Update Driver Fail!"
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
      title="Update Driver Successfully!"
      icon="check circle"
      :subTitle="
        `Driver with name ${this.driver.fullName} is updated successfully！`
      "
      :proFunc="
        () => {
          this.isCreatedSuccessfully = !this.isCreatedSuccessfully;
        }
      "
      v-if="isCreatedSuccessfully"
    />
    <!-- Delete confimation -->
    <Confirmation
      icon="trash alternate"
      title="Delete Document Confirmation"
      subTitle="Do you want to delete this document?"
      rightBtnTitle="Delete"
      rightBtnIcon="trash alternate"
      rightBtnColor="red"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="blue"
      v-if="isDeleteConVisible"
      :handleLeftBtn="handleDeleteConfirmation"
      :handleRightBtn="deleteDocument"
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
        :propDriver="driver"
        v-if="isUserLoading"
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
                @select="handleInsertDoc"
                @remove="handleRemoveDocument"
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
        :proIsInsert="isInsertIdentity"
        :handleDelBtnVisible="
          () => {
            this.handleRemoveDocument('IDENTITY_CARD');
          }
        "
        :insertFunc="createDocument"
        ref="identityCard"
        v-if="(isDocumentLoading && indentifyInfor) || isInsertIdentity"
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
        :proIsInsert="isInsertHealth"
        ref="healthInsurance"
        :handleDelBtnVisible="
          () => {
            this.handleRemoveDocument('HEALTH_INSURANCE');
          }
        "
        :insertFunc="createDocument"
        v-if="
          (this.isDocumentLoading && this.healthInsuranceInfor) ||
            isInsertHealth
        "
      />
      <!-- Health Insurance -->
      <UpdateDrivingLicenseDocument
        :maxImage="2"
        :isNumberInp="true"
        :documentType="'DRIVING_LICENSE'"
        :propDocument="drivingLicenseInfor"
        :proIsInsert="isInsertDriving"
        ref="drivingLicense"
        :handleDelBtnVisible="
          () => {
            this.handleRemoveDocument('DRIVING_LICENSE');
          }
        "
        :insertFunc="createDocument"
        v-if="
          (this.isDocumentLoading && this.drivingLicenseInfor) ||
            isInsertDriving
        "
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import * as firebase from "firebase";
import Loading from "vue-loading-overlay";
import moment from "moment";
import UserInformation from "../../components/User/UserInformation";
import Confirmation from "../../components/Modal/Confirmation";
import MessageModal from "../../components/Modal/MessageModal";
import Multiselect from "vue-multiselect";
import UpdateUserDocument from "../../components/UserDocument/Update User Document/UpdateUserDocument";
import UpdateDrivingLicenseDocument from "../../components/UserDocument/Update User Document/UpdateDrivingLicenseDocument";

export default {
  name: "UpdateDriver",
  components: {
    Loading,
    UserInformation,
    Confirmation,
    Multiselect,
    UpdateUserDocument,
    UpdateDrivingLicenseDocument,
    MessageModal,
  },
  computed: {
    // Map state
    // ...mapState("Driver", ["driver"]),
  },
  data() {
    return {
      driver: {},
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
      isDeleteConVisible: false,
      isDocumentLoading: false,
      isUserLoading: false,

      // Confirmation type
      confType: 0,

      // Delete document
      deletedDocumentId: "",
      deletedDocumentType: "",

      // Insert new document
      isInsertIdentity: false,
      isInsertHealth: false,
      isInsertDriving: false,

      // Document
      docOptions: [],
      documentValue: [],

      userId: this.$route.params.userId,
    };
  },
  async mounted() {
    this.isLoading = true;
    await this.initDetailDriver();
    this.docOptions = require("../../assets/json/document/userDocument.json");
    this.isLoading = false;
  },
  methods: {
    // Map actions
    ...mapActions("Driver", ["_getDetailDriver"]),
    ...mapActions("User", ["_updateUser"]),
    ...mapActions("Document", [
      "_updateDocument",
      "_getDocuments",
      "_delete",
      "_create",
    ]),
    // Init driver's detailed information
    async initDetailDriver() {
      await this._getDetailDriver(this.userId)
        .then((res) => {
          this.driver = res;
          this.isUserLoading = true;
        })
        .catch((err) => {
          if (err) {
            this.isError = true;
            this.errMsg = err.debugMessage;
          }
        });
    },
    // Find document
    findDocumentByName(driverDocument, userDocumentType) {
      for (let doc of driverDocument) {
        if (doc.userDocumentType === userDocumentType) {
          this.documentValue.push(userDocumentType);
          return doc;
        }
      }
      return null;
    },
    // Update basic information
    async updateBasicInformation() {
      this.isLoading = true;
      let driver = this.$refs.userInformation.getData().driver;
      let oldImg = null;
      let newImg = this.$refs.userInformation.getData().image;
      // Init image list for indentify card
      if (newImg) {
        oldImg = driver.imageLink;
        driver.imageLink = await this.uploadImageToFirebase(newImg, "profile");
      }
      await this._updateUser(driver)
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
    // Init data for document
    async initDataDocument() {
      this.documentValue = [];
      let documents = await this._getDocuments({
        userId: this.driver.userId,
        option: 0,
      });
      this.indentifyInfor = this.findDocumentByName(documents, "IDENTITY_CARD");

      this.healthInsuranceInfor = this.findDocumentByName(
        documents,
        "HEALTH_INSURANCE"
      );
      this.drivingLicenseInfor = this.findDocumentByName(
        documents,
        "DRIVING_LICENSE"
      );
    },
    // ------- Start of create and delete document
    // Delete document
    async deleteDocument() {
      this.isDeleteConVisible = !this.isDeleteConVisible;
      if (this.deletedDocumentId) {
        this.isLoading = true;
        await this._delete(this.deletedDocumentId)
          .then(async (res) => {
            if (res) {
              this.handleDeleteSuccess();
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
      } else {
        this.handleDeleteSuccess();
      }
    },
    handleDeleteSuccess() {
      switch (this.deletedDocumentType) {
        case "IDENTITY_CARD":
          this.indentifyInfor = null;
          this.isInsertIdentity = false;
          break;
        case "HEALTH_INSURANCE":
          this.healthInsuranceInfor = null;
          this.isInsertHealth = false;
          break;
        case "DRIVING_LICENSE":
          this.drivingLicenseInfor = null;
          this.isInsertDriving = false;
          break;
      }
      this.$delete(
        this.documentValue,
        this.findDocIndex(this.deletedDocumentType)
      );
    },
    // Find index in multi select
    findDocIndex(str) {
      for (let index = 0; index < this.documentValue.length; index++) {
        if (this.documentValue[index] === str) {
          return index;
        }
      }
      return -1;
    },
    // Handle cancel delete document confirmation dialog
    handleDeleteConfirmation() {
      if (
        this.deletedDocumentType &&
        this.findDocIndex(this.deletedDocumentType) === -1
      ) {
        this.documentValue.push(this.deletedDocumentType);
        this.deletedDocumentType = "";
      }
      this.isDeleteConVisible = !this.isDeleteConVisible;
    },
    // Handle remove document in multi select
    handleRemoveDocument(removedOption) {
      let selectedDoc = "";
      switch (removedOption) {
        case "IDENTITY_CARD":
          selectedDoc = "indentifyInfor";
          this.deletedDocumentType = "IDENTITY_CARD";
          break;
        case "HEALTH_INSURANCE":
          selectedDoc = "healthInsuranceInfor";
          this.deletedDocumentType = "HEALTH_INSURANCE";
          break;
        case "DRIVING_LICENSE":
          selectedDoc = "drivingLicenseInfor";
          this.deletedDocumentType = "DRIVING_LICENSE";
          break;
      }
      if (this.$data[selectedDoc]) {
        this.deletedDocumentId = this.$data[selectedDoc].userDocumentId;
      }
      this.isDeleteConVisible = !this.isDeleteConVisible;
    },
    // handle insert document in multi select
    handleInsertDoc(selectedOption) {
      switch (selectedOption) {
        case "IDENTITY_CARD":
          this.deletedDocumentType = "IDENTITY_CARD";
          this.isInsertIdentity = true;
          break;
        case "HEALTH_INSURANCE":
          this.deletedDocumentType = "HEALTH_INSURANCE";
          this.isInsertHealth = true;
          break;
        case "DRIVING_LICENSE":
          this.deletedDocumentType = "DRIVING_LICENSE";
          this.isInsertDriving = true;
          break;
      }
    },
    // handle create new document
    async createDocument(documentRes) {
      this.isLoading = true;
      let docImage = documentRes.images;
      let document = documentRes.document;
      document.userDocumentImages = await this.getNewFirebaseLinks(
        docImage,
        document.userDocumentType
      );
      await this._create({ document: document, userId: this.driver.userId })
        .then(async (res) => {
          if (res) {
            await this.initDataDocument();
            switch (this.deletedDocumentType) {
              case "IDENTITY_CARD":
                // this.$refs.identityCard.updateIsInsert();
                this.$refs.identityCard.updateDocument(this.indentifyInfor);
                break;
              case "HEALTH_INSURANCE":
                // this.$refs.healthInsurance.updateIsInsert();
                this.$refs.healthInsurance.updateDocument(
                  this.healthInsuranceInfor
                );
                break;
              case "DRIVING_LICENSE":
                // this.$refs.drivingLicense.updateIsInsert();
                this.$refs.drivingLicense.updateDocument(
                  this.drivingLicenseInfor
                );
                break;
            }
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
              this.driver.userDocumentList[2] &&
              ex.debugMessage.includes(
                this.driver.userDocumentList[2].userDocumentId
              )
            ) {
              this.errMsg = "Driving license id is duplicated!";
              // this.$refs.drivingLicense.focus();
              this.$refs.drivingLicense.handleDuplicateErr(true);
            }
            if (
              this.driver.userDocumentList[1] &&
              ex.debugMessage.includes(
                this.driver.userDocumentList[1].userDocumentId
              )
            ) {
              this.errMsg = "Health insurance id is duplicated!";
              // this.$refs.healthInsurance.focus();
              this.$refs.healthInsurance.handleDuplicateErr(true);
            }
            if (
              this.driver.userDocumentList[0] &&
              ex.debugMessage.includes(
                this.driver.userDocumentList[0].userDocumentId
              )
            ) {
              this.errMsg = "Identity ID is duplicated!";
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
            this.$refs.identityCard.handleDuplicateErr(true);
          } else {
            this.isError = true;
            this.errMsg = ex.debugMessage;
          }
          console.error(ex);
        });
      this.isLoading = false;
    },
    // ------- End of create and delete document
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
      await this._updateDocument({
        document: document,
        userId: this.driver.userId,
      })
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
    // Get firebase links
    async getNewFirebaseLinks(imgDataList, imgTypeName) {
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
            this.driver.userDocumentList,
            "IDENTITY_CARD"
          );
          this.healthInsuranceInfor = this.findDocumentByName(
            this.driver.userDocumentList,
            "HEALTH_INSURANCE"
          );
          this.drivingLicenseInfor = this.findDocumentByName(
            this.driver.userDocumentList,
            "DRIVING_LICENSE"
          );
          this.isDocumentLoading = true;
        }
      }
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

/* .cus-modal {
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
} */

.cus-select {
  padding-left: 26px !important;
}
.cus-disable {
  background-color: #858585 !important;
  color: white;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

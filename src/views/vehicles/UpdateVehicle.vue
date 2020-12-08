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
          Update Vehicle
        </span>
      </h3>
    </div>

    <Confirmation
      icon="edit outline"
      title="Update Confirmation"
      subTitle="Do you want to update this vehicle?"
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
      title="Update Vehicle Fail!"
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
      title="Update Vehicle Successfully!"
      icon="check circle"
      :subTitle="
        `Vehicle with id ${this.vehicle.vehicleId} is updated successfully！`
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
                <i class="ui bus icon icon"></i>
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
      <VehicleInformation
        ref="vehicleInformation"
        :isUpdate="true"
        :propVehicle="vehicle"
        v-if="isVehicleComLoading"
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
      <!-- Vehicle registration certificate -->
      <VehicleDocument
        :title="'Vehicle registration certificate'"
        :maxImage="2"
        :isOtherInfoVisible="true"
        :otherInfoMaxLength="9"
        :type="2"
        :isExpiryDateVisible="true"
        :documentType="'VEHICLE_REGISTRATION_CERTIFICATE'"
        otherInformationTitle="ID"
        ref="regisInfor"
        :propDocument="regisInfor"
        :proIsInsert="isInsertRegistration"
        :handleDelBtnVisible="
          () => {
            this.handleRemoveDocument('VEHICLE_REGISTRATION_CERTIFICATE');
          }
        "
        :insertFunc="createDocument"
        v-if="
          (regisInfor !== null && isDocumentLoading) || isInsertRegistration
        "
      />

      <!-- Civil liability insurance certificate -->
      <VehicleDocument
        :title="'Civil liability insurance certificate'"
        :maxImage="2"
        :idMaxLength="[9]"
        :expiryMaxDate="1"
        :otherInfoMaxLength="8"
        :otherInfoMinLength="7"
        :type="1"
        :propDocument="civilInsuranceInfor"
        :documentType="'CIVIL_LIABILITY_INSURANCE_CERTIFICATE'"
        otherInformationTitle="License Plate"
        ref="civilInsurance"
        :proIsInsert="isInsertInsurance"
        :handleDelBtnVisible="
          () => {
            this.handleRemoveDocument('CIVIL_LIABILITY_INSURANCE_CERTIFICATE');
          }
        "
        :insertFunc="createDocument"
        v-if="
          (civilInsuranceInfor !== null && isDocumentLoading) ||
            isInsertInsurance
        "
      />
    </div>
  </div>
</template>

<script>
import * as firebase from "firebase";
import Loading from "vue-loading-overlay";
import moment from "moment";
import Confirmation from "../../components/Modal/Confirmation";
import MessageModal from "../../components/Modal/MessageModal";
import Multiselect from "vue-multiselect";
import VehicleInformation from "../../components/Vehicle/VehicleInformation";
import VehicleDocument from "../../components/Vehicle/UpdateVehicleDocument";

import { RepositoryFactory } from "../../repositories/RepositoryFactory";
// const UserRepository = RepositoryFactory.get("users");
const VehicleRepository = RepositoryFactory.get("vehicles");
const VehicleDocRepos = RepositoryFactory.get("vehicleDocument");

export default {
  name: "UpdateVehicle",
  components: {
    Loading,
    Confirmation,
    Multiselect,
    VehicleInformation,
    VehicleDocument,
    MessageModal,
  },
  data() {
    return {
      vehicle: {},
      // Profile image
      profileImage: null,
      isUserInfoVisible: true,
      uploadValue: 0,
      imageData: null,
      // Indentify image
      regisImage: [],
      regisImageDel: [],
      // Health Insurance
      civilInsuranceImage: [],
      civilInsuranceImageDel: [],
      // Driving License
      drivingLicenseImage: [],
      drivingLicenseImageDel: [],
      // Basic Information Error

      isLoading: false,
      isCreatedSuccessfully: false,
      isError: false,
      errMsg: "",

      documentExpiryDate: [],

      regisInfor: null,
      civilInsuranceInfor: null,
      drivingLicenseInfor: null,

      isUpdConVisible: false,
      isVehicleComLoading: false,
      isDocumentLoading: false,
      isDeleteConVisible: false,

      isInsertRegistration: false,
      isInsertInsurance: false,

      // Confirmation type
      confType: 0,

      // Document
      docOptions: [],
      documentValue: [],
    };
  },
  async mounted() {
    this.isLoading = true;

    this.docOptions = require("../../assets/json/vehicle/documentTypes.json");
    await this.initVehicle();
    await this.initDocuments();

    this.isLoading = false;
  },
  methods: {
    // Init vehicle information
    async initVehicle() {
      await VehicleRepository.getDetailVehicle(
        this.$route.params.vehicleId
      ).then((res) => {
        this.vehicle = res;
        this.isVehicleComLoading = true;
      });
    },
    // Find document
    findDocumentByName(vehicleDocument, vehicleDocumentType) {
      for (let doc of vehicleDocument) {
        if (doc.vehicleDocumentType === vehicleDocumentType) {
          this.documentValue.push(vehicleDocumentType);
          return doc;
        }
      }
      return null;
    },
    // Init documents information
    async initDocuments() {
      await VehicleDocRepos.getDocuments(this.$route.params.vehicleId).then(
        (res) => {
          this.documents = res;
        }
      );
    },
    // Init data for document
    async initDataDocument() {
      this.documentValue = [];
      let documents = await VehicleDocRepos.getDocuments(
        this.$route.params.vehicleId
      );
      this.regisInfor = this.findDocumentByName(
        documents,
        "VEHICLE_REGISTRATION_CERTIFICATE"
      );
      this.civilInsuranceInfor = this.findDocumentByName(
        documents,
        "CIVIL_LIABILITY_INSURANCE_CERTIFICATE"
      );
    },
    // Update basic information
    async updateBasicInformation() {
      this.isLoading = true;
      let vehicle = this.$refs.vehicleInformation.getData().vehicle;
      let oldImg = null;
      let newImg = this.$refs.vehicleInformation.getData().image;
      // Init image list for indentify card
      if (newImg) {
        oldImg = vehicle.imageLink;
        vehicle.imageLink = await this.uploadImageToFirebase(newImg, "profile");
      }
      await VehicleRepository.update(vehicle)
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
    // ------- Start of create and delete document
    // Delete document
    async deleteDocument() {
      this.isDeleteConVisible = !this.isDeleteConVisible;
      if (this.deletedDocumentId) {
        this.isLoading = true;
        await VehicleDocRepos.delete(this.deletedDocumentId)
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
        case "VEHICLE_REGISTRATION_CERTIFICATE":
          this.regisInfor = null;
          this.isInsertRegistration = false;
          break;
        case "CIVIL_LIABILITY_INSURANCE_CERTIFICATE":
          this.civilInsuranceInfor = null;
          this.isInsertInsurance = false;
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
        case "VEHICLE_REGISTRATION_CERTIFICATE":
          selectedDoc = "regisInfor";
          this.deletedDocumentType = "VEHICLE_REGISTRATION_CERTIFICATE";
          break;
        case "CIVIL_LIABILITY_INSURANCE_CERTIFICATE":
          selectedDoc = "civilInsuranceInfor";
          this.deletedDocumentType = "CIVIL_LIABILITY_INSURANCE_CERTIFICATE";
          break;
      }
      if (this.$data[selectedDoc]) {
        this.deletedDocumentId = this.$data[selectedDoc].vehicleDocumentId;
      }
      this.isDeleteConVisible = !this.isDeleteConVisible;
    },
    // handle insert document in multi select
    handleInsertDoc(selectedOption) {
      switch (selectedOption) {
        case "VEHICLE_REGISTRATION_CERTIFICATE":
          this.deletedDocumentType = "VEHICLE_REGISTRATION_CERTIFICATE";
          this.isInsertRegistration = true;
          break;
        case "CIVIL_LIABILITY_INSURANCE_CERTIFICATE":
          this.deletedDocumentType = "CIVIL_LIABILITY_INSURANCE_CERTIFICATE";
          this.isInsertInsurance = true;
          break;
      }
    },
    // handle create new document
    async createDocument(documentRes) {
      this.isLoading = true;
      let docImage = documentRes.images;
      let document = documentRes.document;
      document.imageLinks = await this.getNewFirebaseLinks(
        docImage,
        document.vehicleDocumentType
      );
      await VehicleDocRepos.create(this.vehicle.vehicleId, document, 0)
        .then(async (res) => {
          if (res) {
            await this.initDataDocument();
            switch (this.deletedDocumentType) {
              case "VEHICLE_REGISTRATION_CERTIFICATE":
                this.$refs.regisInfor.updateDocument(this.regisInfor);
                break;
              case "CIVIL_LIABILITY_INSURANCE_CERTIFICATE":
                this.$refs.civilInsurance.updateDocument(
                  this.civilInsuranceInfor
                );
                break;
            }
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
    // ------- End of create and delete document
    // Upload image to firebase
    uploadImageToFirebase(imageData, imgTypeName) {
      return new Promise((resolve) => {
        let date = moment(new Date()).format("YYYYMMDDHHmmss");
        const storageRef = firebase
          .storage()
          .ref(imgTypeName + "-" + this.vehicle.userId + "-" + date)
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
    // Get firebase links
    async getNewFirebaseLinks(imgDataList, imgTypeName) {
      let imgArr = [];
      if (imgDataList) {
        for (let img of imgDataList) {
          let url = await this.uploadImageToFirebase(img, imgTypeName);
          imgArr.push(url);
        }
      }
      return imgArr;
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
        case "VEHICLE_REGISTRATION_CERTIFICATE":
          this.isUpdConVisible = false;
          this.updateDocument("regisInfor");
          break;
        case "CIVIL_LIABILITY_INSURANCE_CERTIFICATE":
          this.isUpdConVisible = false;
          this.updateDocument("civilInsurance");
          break;
      }
    },
    async updateDocument(documentType) {
      this.isLoading = true;
      let resDoc = this.$refs[documentType].getData();
      let document = resDoc.document;
      let newImgs = resDoc.images;
      let delImgs = resDoc.delImage;
      document.imageLink = await this.getFirebaseLinks(
        newImgs,
        delImgs,
        document.imageLinks,
        documentType
      );
      await VehicleDocRepos.update(document, this.vehicle.userId)
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
          this.isLoading = false;
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
          let vehicleDocumentImageId =
            delImg !== null && delImg.length > index
              ? delImg[index].vehicleDocumentImageId
              : 0;
          let imgObj = {
            vehicleDocumentImageId: vehicleDocumentImageId,
            imageLink: url,
          };
          if (delImg !== null && delImg.length > 0) {
            for (let i = 0; i < oldImg.length; i++) {
              let imgA = oldImg[i];
              if (
                imgA.vehicleDocumentImageId ===
                delImg[index].vehicleDocumentImageId
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
      let isValid = this.$refs.vehicleInformation.checkBasicInformation();
      // let isValid = false;

      if (!isValid) {
        document.getElementById("app").scrollIntoView();
        this.isUserInfoVisible = !this.isUserInfoVisible;
        // Init document data
        if (!this.isUserInfoVisible && !this.isDocumentLoading) {
          // VEHICLE_REGISTRATION_CERTIFICATE
          this.regisInfor = this.findDocumentByName(
            this.documents,
            "VEHICLE_REGISTRATION_CERTIFICATE"
          );
          this.civilInsuranceInfor = this.findDocumentByName(
            this.documents,
            "CIVIL_LIABILITY_INSURANCE_CERTIFICATE"
          );
          this.isDocumentLoading = true;
        }
      }
    },

    // Check Phone input
    phoneInput() {
      var x = this.vehicle.phoneNumber
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      if (x[1].charAt(0) !== "0" && x[1].length != 0) {
        x[1] = "0" + x[1];
      }
      this.vehicle.phoneNumber = !x[2]
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
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

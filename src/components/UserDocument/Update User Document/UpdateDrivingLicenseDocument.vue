<template>
  <div class="col-lg-12 grid-margin stretch-card">
    <div class="card">
      <div class="card-body">
        <button
          class="ui icon right floated button edit-btn"
          @click="handleUpdBtnVisible()"
          v-if="!isInsert"
        >
          <i class="edit icon"></i>
        </button>
        <button
          class="ui icon right floated button"
          :class="isInsert ? 'edit-btn' : 'del-btn'"
          @click="handleDelBtnVisible()"
        >
          <i class="trash alternate icon"></i>
        </button>
        <div class="ui form">
          <h4 class="ui dividing header">DRIVING LICENSE</h4>
          <div class="field justify-content-center">
            <label class="mb-4">Images</label>
            <div class="row">
              <div
                class="col-3 preview-img mb-3"
                v-for="(img, index) in documentImagePrev"
                :key="index"
              >
                <img :src="img.imageLink" class="ui large image" />
                <button
                  class="close-btn"
                  v-on:click="removeImage(index)"
                  :disabled="!isUpdBtnVisibile && !isInsert"
                >
                  <i class="mdi mdi-close-circle"></i>
                </button>
              </div>
            </div>
            <div class="ui pointing below red basic label" v-if="imageErr">
              Image is required 2 images!
            </div>
            <div class="ui corner labeled input">
              <label
                class="btn btn-icon-text cus-disable"
                v-bind:class="{
                  'btn-gradient-info':
                    documentImagePrev !== null &&
                    documentImagePrev.length < this.maxImage,
                }"
                :for="documentType"
              >
                <i class="mdi mdi-upload btn-icon-prepend" />Select image...
              </label>
              <input
                class="upload-photo"
                :id="documentType"
                type="file"
                accept="image/*"
                @change="uploadImage($event)"
                :disabled="
                  documentImagePrev !== null &&
                    documentImagePrev.length === this.maxImage
                "
              />
            </div>
          </div>
          <div class="two fields">
            <div class="field">
              <label>Driving License ID</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  ref="drivLicenseID"
                  placeholder="Driving License ID"
                  @keypress="isNumber($event)"
                  maxlength="12"
                  :readonly="!isUpdBtnVisibile && !isInsert"
                  v-model="document.userDocumentNumber"
                />
                <div class="ui corner label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div class="ui pointing red basic label" v-if="documentIdErr">
                Driving license id is required 12 digits!
              </div>
              <div class="ui pointing red basic label" v-if="isDuplicated">
                Driving license id is duplicated!
              </div>
            </div>

            <div class="field">
              <label>Class</label>
              <div class="ui left corner labeled input">
                <select
                  class="ui dropdown cus-select"
                  v-model="selectedDrivingLicenseClass"
                  :disabled="!isUpdBtnVisibile && !isInsert"
                >
                  <option :value="{ name: '' }">
                    Driving License Type
                  </option>
                  <option
                    v-for="drivingLicenseClass in drivingLicenseClasses"
                    :key="drivingLicenseClass.name"
                    :value="drivingLicenseClass"
                  >
                    {{ drivingLicenseClass.name }}
                  </option>
                </select>
                <div class="ui left corner label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div class="ui pointing red basic label" v-if="otherInfoErr">
                Driving license class is required!
              </div>
            </div>
          </div>

          <div class="two fields">
            <div class="field">
              <label>Registered Date</label>
              <div class="ui corner labeled input">
                <input
                  type="date"
                  class="form-control"
                  v-model="document.registeredDate"
                  :readonly="!isUpdBtnVisibile && !isInsert"
                />
                <div class="ui corner label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div class="ui pointing red basic label" v-if="registeredDateErr">
                Registered date is required!
              </div>
            </div>
            <div class="field">
              <label>Registered Location</label>
              <div class="ui left corner labeled input">
                <select
                  class="ui dropdown cus-select"
                  v-model="document.registeredLocation"
                  :disabled="!isUpdBtnVisibile && !isInsert"
                >
                  <option :value="''">
                    Cities/Provinces
                  </option>
                  <option
                    v-for="city in cities"
                    :key="city.code"
                    :value="city.name_with_type"
                  >
                    {{ city.name_with_type }}
                  </option>
                </select>
                <div class="ui left corner label">
                  <i class="asterisk icon"></i>
                </div>
              </div>
              <div
                class="ui pointing red basic label"
                v-if="registeredLocationErr"
              >
                Registered Location is required!
              </div>
            </div>
          </div>
          <!-- If update document is call -->
          <div class="row justify-content-center mt-5" v-if="isUpdBtnVisibile">
            <div class="col-4">
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
          </div>
          <div class="row justify-content-center mt-5" v-if="isInsert">
            <div class="col-4">
              <button
                class="btn btn-gradient-danger btn-fw"
                type="button"
                @click="clear()"
              >
                Clear
              </button>
              <button
                class="btn btn-gradient-info btn-fw ml-2"
                type="button"
                @click="create()"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isNumber } from "../../../assets/js/input.js";

export default {
  props: {
    title: String,
    maxImage: Number,
    idMaxLength: Array,
    isNumberInp: Boolean,
    expiryMaxDate: Number,
    documentType: String,
    isDuplicated: Boolean,
    propDocument: Object,
    // Insert document
    proIsInsert: Boolean,
    insertFunc: Function,
    cancelFunc: Function,
    handleDelBtnVisible: Function,
  },
  data() {
    return {
      document: {
        userDocumentNumber: "",
        userDocumentId: "",
        userDocumentType: "",
        registeredLocation: "",
        registeredDate: "",
        expiryDate: "",
        otherInformation: "",
        userDocumentImages: [],
      },
      // Error
      documentIdErr: false,
      documentDupErr: false,
      registeredLocationErr: false,
      registeredDateErr: false,
      expiryDateErr: false,
      otherInfoErr: false,
      imageErr: false,
      // Error message
      idErrMsg: "",
      // Image
      documentImage: [],
      documentImagePrev: [],
      documentImageDel: [],
      cities: [],
      idMaxRange: 0,
      // driving class
      drivingLicenseClasses: [],
      selectedDrivingLicenseClass: {
        name: "",
      },
      // Update button visible
      isUpdBtnVisibile: false,
      isInsert: false,
    };
  },
  mounted() {
    this.isInsert = this.proIsInsert;
    this.cities = require("../../../assets/json/addresses/tinh_tp.json");
    this.drivingLicenseClasses = require("../../../assets/json/indentify/type.json");
    if (!this.isInsert) {
      this.initData(this.propDocument);
    }
    // Init error message for id
    this.document.userDocumentType = this.documentType;

    if (this.document.otherInformation) {
      this.selectedDrivingLicenseClass = this.drivingLicenseClasses[
        this.document.otherInformation
      ];
    }
  },
  methods: {
    // Init document data
    initData(document) {
      this.documentImageDel = [];
      this.documentImage = [];
      this.documentImagePrev = [];
      this.document = Object.assign({}, document);
      this.document.userDocumentImages.forEach((img) => {
        this.documentImagePrev.push(img);
      });
    },
    // Handle edit show button
    handleUpdBtnVisible() {
      this.isUpdBtnVisibile = !this.isUpdBtnVisibile;
      this.document = Object.assign({}, this.propDocument);
    },
    // Upload image
    uploadImage(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.documentImagePrev.push({
          imageLink: e.target.result,
        });
      };
      this.documentImage.push(image);
    },
    // Remove image from list
    removeImage(index) {
      // Check if image is new or old image
      if (
        this.documentImagePrev[index].imageLink.includes(
          "firebasestorage.googleapis.com"
        )
      ) {
        this.documentImageDel.push(this.documentImagePrev[index]);
      } else {
        this.$delete(this.documentImage, index);
      }
      this.$delete(this.documentImagePrev, index);
    },
    // Check valid
    check() {
      let documentID = this.document.userDocumentNumber;
      this.documentIdErr = documentID.length !== 9 && documentID.length !== 12;

      this.registeredLocationErr =
        this.document.registeredLocation.length === 0;
      this.registeredDateErr = this.document.registeredDate.length === 0;
      this.imageErr = this.documentImagePrev.length < this.maxImage;
      this.otherInfoErr = this.selectedDrivingLicenseClass.name.length === 0;
      return (
        this.documentIdErr ||
        this.registeredLocationErr ||
        this.registeredDateErr ||
        this.imageErr ||
        this.otherInfoErr
      );
    },
    // Update
    update() {
      let isValid = this.check();
      if (!isValid) {
        this.$parent.openConfirmation(this.document.userDocumentType);
      }
    },
    // Handle duplicate
    handleDuplicateErr(isErr) {
      this.isDuplicated = isErr;
    },
    // Clear input
    clear() {
      this.document = {
        userDocumentNumber: "",
        userDocumentType: "",
        registeredLocation: "",
        registeredDate: "",
        expiryDate: "",
        otherInformation: "",
        userDocumentImages: [],
      };
    },
    // Update is insert
    updateIsInsert() {
      this.isInsert = !this.isInsert;
    },
    // Update is insert
    updateDocument(document) {
      this.isInsert = !this.isInsert;
      this.initData(document);
    },
    // Create
    create() {
      let isValid = this.check();
      if (!isValid) {
        let docRes = this.getData();
        this.insertFunc(docRes);
      }
    },
    // Get data
    getData() {
      this.document.expiryDate = this.getExpiryDate(
        this.document.registeredDate,
        this.selectedDrivingLicenseClass.expiryDate
      );
      this.document.otherInformation = this.selectedDrivingLicenseClass.name;

      return {
        document: this.document,
        images: this.documentImage,
        delImage: this.documentImageDel,
      };
    },
    // Get expiry date
    getExpiryDate(date, ex) {
      let dateArr = date.split("-");
      return Number(dateArr[0]) + ex + "-" + dateArr[1] + "-" + dateArr[2];
    },
    // Check id field accept only number or not
    isNumber(evt) {
      if (this.isNumberInp) {
        isNumber(evt);
      }
    },
  },
};
</script>

<style scoped>
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
.edit-btn {
  position: absolute;
  right: 1% !important;
  top: 2% !important;
}
.del-btn {
  position: absolute;
  right: 5% !important;
  top: 2% !important;
}
</style>

<template>
  <div class="col-lg-12 grid-margin stretch-card">
    <div class="card">
      <div class="card-body">
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
                <img :src="img" class="ui large image" />
                <button
                  class="close-btn"
                  v-on:click="removeImage(index, 'documentImage')"
                >
                  <i class="mdi mdi-close-circle"></i>
                </button>
              </div>
            </div>
            <div class="ui pointing below red basic label" v-if="imageErr">
              Image is required {{ this.maxImage }} images!
            </div>
            <div class="ui corner labeled input">
              <label
                class="btn btn-icon-text cus-disable"
                v-bind:class="{
                  'btn-gradient-info':
                    documentImage !== null && documentImage.length < 2,
                }"
                for="upload-drive-photo"
              >
                <i class="mdi mdi-upload btn-icon-prepend" />Select image
              </label>
              <input
                class="upload-photo"
                id="upload-drive-photo"
                type="file"
                accept="image/*"
                @change="uploadImage($event, 'documentImage')"
                :disabled="documentImage !== null && documentImage.length === 2"
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
                  v-model="document.userDocumentId"
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
                Driving license type is required!
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isNumber } from "../../assets/js/input.js";

export default {
  props: {
    title: String,
    maxImage: Number,
    idMaxLength: Array,
    isNumberInp: Boolean,
    expiryMaxDate: Number,
    documentType: String,
    isDuplicated: Boolean,
  },
  data() {
    return {
      document: {
        userDocumentId: "",
        userDocumentType: "",
        registeredLocation: "",
        registeredDate: "",
        expiryDate: "",
        otherInformation: "",
        documentImagesReqList: [],
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
      cities: [],
      idMaxRange: 0,
      // driving class
      drivingLicenseClasses: [],
      selectedDrivingLicenseClass: {
        name: "",
      },
    };
  },
  mounted() {
    this.cities = require("../../assets/json/addresses/tinh_tp.json");
    this.drivingLicenseClasses = require("../../assets/json/indentify/type.json");
    // Init error message for id
    this.document.userDocumentType = this.documentType;

    if (this.document.otherInformation) {
      this.selectedDrivingLicenseClass = this.drivingLicenseClasses[
        this.document.otherInformation
      ];
    }
  },
  methods: {
    // Upload image
    uploadImage(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.documentImagePrev.push(e.target.result);
      };
      this.documentImage.push(image);
    },
    // Remove image from list
    removeImage(index) {
      this.$delete(this.documentImagePrev, index);
      this.$delete(this.documentImage, index);
    },
    // Check valid
    check() {
      let documentID = this.document.userDocumentId;
      this.documentIdErr = documentID.length !== 9 && documentID.length !== 12;

      this.registeredLocationErr =
        this.document.registeredLocation.length === 0;
      this.registeredDateErr = this.document.registeredDate.length === 0;
      this.imageErr =
        this.documentImage.length < this.maxImage ||
        this.documentImagePrev.length < this.maxImage;
      this.otherInfoErr = this.selectedDrivingLicenseClass.name.length === 0;
      return (
        this.documentIdErr ||
        this.registeredLocationErr ||
        this.registeredDateErr ||
        this.imageErr ||
        this.otherInfoErr
      );
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

<style>
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
</style>

<template>
  <div class="col-lg-12 grid-margin stretch-card">
    <div class="card">
      <div class="card-body">
        <div class="ui form">
          <h4 class="ui dividing header">{{ this.title.toUpperCase() }}</h4>
          <div class="field justify-content-center">
            <label class="mb-4">Images</label>
            <div class="row">
              <div
                class="col-3 preview-img mb-3"
                v-for="(img, index) in documentImagePrev"
                :key="index"
              >
                <img :src="img" class="ui large image" />
                <button class="close-btn" v-on:click="removeImage(index)">
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
                    documentImage !== null &&
                    documentImage.length < this.maxImage,
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
                  documentImage !== null &&
                    documentImage.length === this.maxImage
                "
              />
            </div>
          </div>
          <template v-if="!isOtherInfoVisible">
            <div class="two fields">
              <div class="field">
                <label>ID</label>
                <div class="ui corner labeled input">
                  <input
                    type="text"
                    name="Name"
                    placeholder="ID"
                    :maxlength="this.idMaxRange"
                    @keypress="isNumber($event)"
                    style="text-transform:uppercase"
                    v-model="document.vehicleDocumentId"
                  />
                  <div class="ui corner label">
                    <i class="asterisk icon"></i>
                  </div>
                </div>
                <div class="ui pointing red basic label" v-if="documentIdErr">
                  {{ this.idErrMsg }}
                </div>
                <div class="ui pointing red basic label" v-if="isDuplicated">
                  {{ this.title }} id is duplicated!
                </div>
              </div>
              <div class="field">
                <label>Registered Date</label>
                <div class="ui corner labeled input">
                  <input
                    type="date"
                    class="form-control"
                    :max="maxDate"
                    v-model="document.registeredDate"
                  />
                  <div class="ui corner label">
                    <i class="asterisk icon"></i>
                  </div>
                </div>
                <div
                  class="ui pointing red basic label"
                  v-if="registeredDateErr"
                >
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
          </template>
          <template v-else>
            <div class="two fields">
              <template v-if="type === 1">
                <div class="field">
                  <label>ID</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      name="Name"
                      placeholder="ID"
                      :maxlength="this.idMaxRange"
                      @keypress="isNumber($event)"
                      style="text-transform:uppercase"
                      v-model="document.vehicleDocumentId"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div class="ui pointing red basic label" v-if="documentIdErr">
                    {{ this.idErrMsg }}
                  </div>
                  <div class="ui pointing red basic label" v-if="isDuplicated">
                    {{ this.title }} id is duplicated!
                  </div>
                </div>
                <!-- Other information -->
                <div class="field">
                  <label>{{ this.otherInformationTitle }}</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      name="Name"
                      :placeholder="otherInformationTitle"
                      :maxlength="this.otherInfoMaxLength"
                      style="text-transform:uppercase"
                      v-model="document.otherInformation"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div class="ui pointing red basic label" v-if="otherInfoErr">
                    {{ this.otherInformationTitle }} is required
                    {{ this.otherInfoMinLength }} -
                    {{ this.otherInfoMaxLength }} chars!
                  </div>
                </div>
              </template>
              <template v-else-if="type === 2">
                <div class="field">
                  <label>{{ this.otherInformationTitle }}</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      name="Name"
                      :placeholder="otherInformationTitle"
                      :maxlength="this.otherInfoMaxLength"
                      style="text-transform:uppercase"
                      v-model="document.vehicleDocumentId"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div class="ui pointing red basic label" v-if="documentIdErr">
                    {{ this.otherInformationTitle }} is required
                    <!-- {{ this.otherInfoMinLength }} - -->
                    {{ this.otherInfoMaxLength }} chars!
                  </div>
                  <div class="ui pointing red basic label" v-if="isDuplicated">
                    {{ this.title }} id is duplicated!
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
              </template>
            </div>
            <div class="fields two">
              <div class="field" v-if="type !== 2">
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
              <div class="field">
                <label>Registered Date</label>
                <div class="ui corner labeled input">
                  <input
                    type="date"
                    class="form-control"
                    :max="maxDate"
                    v-model="document.registeredDate"
                  />
                  <div class="ui corner label">
                    <i class="asterisk icon"></i>
                  </div>
                </div>
                <div
                  class="ui pointing red basic label"
                  v-if="registeredDateErr"
                >
                  Registered date is required!
                </div>
              </div>
              <div class="field" v-if="isExpiryDateVisible">
                <label>Expiry Date</label>
                <div class="ui corner labeled input">
                  <input
                    type="date"
                    class="form-control"
                    v-model="document.expiryDate"
                    :disabled="!document.registeredDate"
                    :min="document.registeredDate"
                  />
                  <div class="ui corner label">
                    <i class="asterisk icon"></i>
                  </div>
                </div>
                <div class="ui pointing red basic label" v-if="expiryDateErr">
                  Expiry date is required!
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isNumber } from "../../assets/js/input.js";
import moment from "moment";

export default {
  props: {
    title: String,
    maxImage: Number,
    idMaxLength: Array,
    otherInfoMaxLength: Number,
    otherInfoMinLength: Number,
    isNumberInp: Boolean,
    isOtherInfoVisible: Boolean,
    isExpiryDateVisible: Boolean,
    expiryMaxDate: Number,
    documentType: String,
    otherInformationTitle: String,
    type: Number,
  },
  data() {
    return {
      document: {
        vehicleDocumentId: "",
        vehicleDocumentType: "",
        registeredLocation: "",
        registeredDate: "",
        expiryDate: "",
        otherInformation: "",
        imageLinks: [],
      },
      // Error
      documentIdErr: false,
      documentDupErr: false,
      registeredLocationErr: false,
      registeredDateErr: false,
      expiryDateErr: false,
      otherInfoErr: false,
      imageErr: false,
      isDuplicated: false,
      // Error message
      idErrMsg: "",
      // Image
      documentImage: [],
      documentImagePrev: [],
      cities: [],
      idMaxRange: 0,
      maxDate: "",
    };
  },
  mounted() {
    this.cities = require("../../assets/json/addresses/tinh_tp.json");
    if (this.type !== 2) {
      this.idMaxRange = this.idMaxLength[this.idMaxLength.length - 1];
      // Init error message for id
      this.initIDErrMsg();
    }

    this.document.vehicleDocumentType = this.documentType;
    this.maxDate = moment(new Date()).format("YYYY-MM-DD");
  },
  methods: {
    // Init error message for id
    initIDErrMsg() {
      let isNumber = this.isNumberInp ? "numbers" : "chars";
      this.idErrMsg = this.title + " id is required " + this.idMaxLength[0];
      if (this.idMaxLength.length >= 2) {
        for (let index = 1; index < this.idMaxLength.length; index++) {
          this.idErrMsg += " or " + this.idMaxLength[index];
        }
      }
      this.idErrMsg += " " + isNumber + "!";
    },
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
      if (this.type === 1) {
        let documentID = this.document.vehicleDocumentId;
        this.documentIdErr = true;
        for (const idLength in this.idMaxLength) {
          if (documentID.length === this.idMaxLength[idLength]) {
            this.documentIdErr = false;
            break;
          }
        }
      } else if (this.type === 2) {
        this.documentIdErr =
          this.document.vehicleDocumentId.length < this.otherInfoMinLength ||
          this.document.vehicleDocumentId.length > this.otherInfoMaxLength;
      } else if (this.isOtherInfoVisible && this.type !== 2) {
        this.otherInfoErr =
          this.document.otherInformation.length < this.otherInfoMinLength ||
          this.document.otherInformation.length > this.otherInfoMaxLength;
      }

      this.registeredLocationErr =
        this.document.registeredLocation.length === 0;
      this.registeredDateErr = this.document.registeredDate.length === 0;
      this.imageErr =
        this.documentImage.length < this.maxImage ||
        this.documentImagePrev.length < this.maxImage;

      if (this.isExpiryDateVisible) {
        this.expiryDateErr = this.document.expiryDate.length === 0;
      }

      return (
        this.documentIdErr ||
        this.registeredLocationErr ||
        this.registeredDateErr ||
        this.expiryDateErr ||
        this.otherInfoErr ||
        this.imageErr
      );
    },
    // Get data
    getData() {
      this.document.vehicleDocumentId = this.document.vehicleDocumentId.toUpperCase();
      if (!this.isExpiryDateVisible) {
        this.document.expiryDate = this.getExpiryDate(
          this.document.registeredDate,
          this.expiryMaxDate
        );
      }

      return {
        document: this.document,
        images: this.documentImage,
      };
    },
    // Handle duplicate
    handleDuplicateErr(isErr) {
      this.isDuplicated = isErr;
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

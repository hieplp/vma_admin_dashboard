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
          <h4 class="ui dividing header">{{ this.title.toUpperCase() }}</h4>
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
                    :readonly="!isInsert"
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
                    v-model="document.registeredDate"
                    :readonly="!isUpdBtnVisibile && !isInsert"
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
                      :readonly="!isInsert"
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
                      :readonly="!isUpdBtnVisibile && !isInsert"
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
                      @keypress="isNumber($event)"
                      style="text-transform:uppercase"
                      v-model="document.vehicleDocumentId"
                      :readonly="!isInsert"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div class="ui pointing red basic label" v-if="documentIdErr">
                    {{ this.otherInformationTitle }} is required
                    {{ this.otherInfoMinLength }} -
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
              </template>
            </div>
            <div class="fields two">
              <div class="field" v-if="type !== 2">
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
                    :disabled="document.registeredDate === null"
                    :min="document.registeredDate"
                    :readonly="!isUpdBtnVisibile && !isInsert"
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
import { isNumber } from "../../assets/js/input.js";

export default {
  components: {},
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
    // Type = 1, there is id and other information
    // Type = 2, there is other information is id
    // Type = 2, there is other information is id
    type: Number,
    propDocument: Object,
    handleDelBtnVisible: Function,
    // Insert document
    proIsInsert: Boolean,
    insertFunc: Function,
    cancelFunc: Function,
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
      documentImageDel: [],
      cities: [],
      idMaxRange: 0,
      isUpdBtnVisibile: false,
      isInsert: false,
    };
  },
  mounted() {
    this.cities = require("../../assets/json/addresses/tinh_tp.json");
    this.isInsert = this.proIsInsert;
    if (!this.isInsert) {
      this.initData();
    }
    if (this.type !== 2) {
      this.idMaxRange = this.idMaxLength[this.idMaxLength.length - 1];
      // Init error message for id
      this.initIDErrMsg();
    }
    this.document.vehicleDocumentType = this.documentType;
  },
  methods: {
    // Init document data
    initData() {
      this.documentImageDel = [];
      this.documentImage = [];
      this.documentImagePrev = [];
      this.document = Object.assign({}, this.propDocument);
      this.document.imageLinks.forEach((img) => {
        this.documentImagePrev.push(img);
      });
    },
    // Handle edit show button
    handleUpdBtnVisible() {
      this.isUpdBtnVisibile = !this.isUpdBtnVisibile;
      this.document = Object.assign({}, this.propDocument);
    },
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
      this.imageErr = this.documentImagePrev.length < this.maxImage;

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
    // Update
    update() {
      let isValid = this.check();
      if (!isValid) {
        this.$parent.openConfirmation(this.document.vehicleDocumentType);
      }
    },
    // Clear input
    clear() {
      this.document = {
        vehicleDocumentId: "",
        vehicleDocumentType: "",
        registeredLocation: "",
        registeredDate: "",
        expiryDate: "",
        otherInformation: "",
        imageLinks: [],
      };
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
      if (!this.isExpiryDateVisible) {
        this.document.expiryDate = this.getExpiryDate(
          this.document.registeredDate,
          this.expiryMaxDate
        );
      }
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
.edit-btn {
  position: absolute;
  right: 1% !important;
  top: 2% !important;
}
</style>

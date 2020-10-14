<template>
  <div class="content-wrapper">
    <div class="page-header">
      <h3 class="page-title">Create Driver</h3>
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
    <div class="row" v-if="isUserInfoVisible">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <h4 class="ui dividing header">Basic Information</h4>

              <div class="field justify-content-center">
                <label>Profile image</label>
              </div>
              <div class="row justify-content-center">
                <label for="upload-photo" class="upload-pro">
                  <img
                    src="../assets/images/unnamed.png"
                    class="ui medium circular image pro-img"
                    alt="image"
                    v-if="profileImagePrev == null"
                  />
                  <img
                    :src="profileImagePrev"
                    class="ui medium circular image pro-img"
                    alt="image"
                    v-else
                  />
                  <div class="upload-pro-plus ">
                    <i class="mdi mdi-plus"></i>
                  </div>
                </label>
                <input
                  id="upload-photo"
                  type="file"
                  accept="image/*"
                  @change="uploadProfile($event)"
                />
              </div>
              <div class="field justify-content-center">
                <label>Profile image</label>
                <img :src="previewImage" class="ui large image" />
                <div class="ui corner labeled input">
                  <input type="file" accept="image/png" @change="uploadImage" />
                  <div class="ui corner label">
                    <i class="asterisk icon"></i>
                  </div>
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>Full Name</label>
                  <div class="ui corner labeled input">
                    <input type="text" name="Name" placeholder="Full name" />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label>Address</label>
                  <div class="ui corner labeled input">
                    <input type="text" placeholder="Address" />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>Gender</label>
                  <select class="ui fluid dropdown">
                    <option value="true">Male</option>
                    <option value="false">Female</option>
                  </select>
                </div>
                <div class="field">
                  <label>Phone Number</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      name="Phone Number"
                      placeholder="Phone Number"
                      @keypress="isNumber($event)"
                      maxlength="10"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>Birthdate</label>
                  <div class="ui corner labeled input">
                    <input type="date" class="form-control" v-model="time1" />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                </div>
                <div class="field ">
                  <label>Basic Salary</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      name="Salary"
                      placeholder="Basic Salary"
                      @keypress="isNumber($event)"
                      maxlength="10"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Button group -->
              <div class="row justify-content-center mt-5">
                <div class="col-4">
                  <button class="btn btn-gradient-danger btn-fw" type="button">
                    Clear
                  </button>
                  <button
                    class="btn btn-gradient-info btn-fw ml-2"
                    type="button"
                    v-on:click="changeTab()"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- User document -->
    <div class="row" v-else>
      <!-- Indentify Card -->
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <h4 class="ui dividing header">Indentify Card</h4>
              <div class="field justify-content-center">
                <label class="mb-4">Images</label>
                <div class="row">
                  <div
                    class="col-3 preview-img mb-3"
                    v-for="(img, index) in indentifyImagePrev"
                    :key="index"
                  >
                    <img :src="img" class="ui large image" />
                    <button
                      class="close-btn"
                      v-on:click="removeImage(index, 'indentifyImage')"
                    >
                      <i class="mdi mdi-close-circle"></i>
                    </button>
                  </div>
                </div>
                <div class="ui corner labeled input">
                  <label
                    class="btn btn-gradient-info btn-icon-text"
                    for="upload-photo"
                  >
                    <i class="mdi mdi-upload btn-icon-prepend" />Select image...
                  </label>
                  <input
                    id="upload-photo"
                    type="file"
                    accept="image/*"
                    @change="uploadImage($event, 'indentifyImage')"
                  />
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>Indentify ID</label>
                  <div class="ui corner labeled input">
                    <input type="text" name="Name" placeholder="Indentify ID" />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label>Register Location</label>
                  <div class="ui corner labeled input">
                    <input type="text" placeholder="Register location" />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>Register Date</label>
                  <div class="ui corner labeled input">
                    <input type="date" class="form-control" v-model="time1" />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label>ExpiryDate</label>
                  <div class="ui corner labeled input">
                    <input type="date" class="form-control" v-model="time1" />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Health Insurance -->
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <h4 class="ui dividing header">Health Insurance</h4>
              <div class="field justify-content-center">
                <label class="mb-4">Images</label>
                <div class="row">
                  <div
                    class="col-3 preview-img mb-3"
                    v-for="(img, index) in indentifyImagePrev"
                    :key="index"
                  >
                    <img :src="img" class="ui large image" />
                    <button
                      class="close-btn"
                      v-on:click="removeImage(index, 'indentifyImage')"
                    >
                      <i class="mdi mdi-close-circle"></i>
                    </button>
                  </div>
                </div>
                <div class="ui corner labeled input">
                  <label
                    class="btn btn-gradient-info btn-icon-text"
                    for="upload-photo"
                  >
                    <i class="mdi mdi-upload btn-icon-prepend" />Select image...
                  </label>
                  <input
                    id="upload-photo"
                    type="file"
                    accept="image/*"
                    @change="uploadImage($event, 'indentifyImage')"
                  />
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>ID</label>
                  <div class="ui corner labeled input">
                    <input type="text" name="Name" placeholder="ID" />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label>Register Location</label>
                  <div class="ui corner labeled input">
                    <input type="text" placeholder="Register location" />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>Register Date</label>
                  <div class="ui corner labeled input">
                    <input type="date" class="form-control" v-model="time1" />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label>ExpiryDate</label>
                  <div class="ui corner labeled input">
                    <input type="date" class="form-control" v-model="time1" />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Driving License -->
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <h4 class="ui dividing header">Driving License</h4>
              <div class="field justify-content-center">
                <label class="mb-4">Images</label>
                <div class="row">
                  <div
                    class="col-3 preview-img mb-3"
                    v-for="(img, index) in indentifyImagePrev"
                    :key="index"
                  >
                    <img :src="img" class="ui large image" />
                    <button
                      class="close-btn"
                      v-on:click="removeImage(index, 'indentifyImage')"
                    >
                      <i class="mdi mdi-close-circle"></i>
                    </button>
                  </div>
                </div>
                <div class="ui corner labeled input">
                  <label
                    class="btn btn-gradient-info btn-icon-text"
                    for="upload-photo"
                  >
                    <i class="mdi mdi-upload btn-icon-prepend" />Select image
                  </label>
                  <input
                    id="upload-photo"
                    type="file"
                    accept="image/*"
                    @change="uploadImage($event, 'indentifyImage')"
                  />
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>Driving License ID</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      name="Name"
                      placeholder="Driving License ID"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label>Register Location</label>
                  <div class="ui corner labeled input">
                    <input type="text" placeholder="Register location" />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>Register Date</label>
                  <div class="ui corner labeled input">
                    <input type="date" class="form-control" v-model="time1" />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label>ExpiryDate</label>
                  <div class="ui corner labeled input">
                    <input type="date" class="form-control" v-model="time1" />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
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
import { isNumber } from "../assets/js/input.js";
import * as firebase from "firebase";

export default {
  data() {
    return {
      // Profile image
      profileImage: null,
      profileImagePrev: null,
      documentValue: null,
      previewImage: null,
      time1: null,
      isUserInfoVisible: true,
      uploadValue: 0,
      img1: null,
      imageData: null,
      // Indentify image
      indentifyImage: [],
      indentifyImagePrev: [],
      // Health Insurance
      healthInsuranceImage: [],
      healthInsuranceImagePrev: [],
      detail: {
        image:
          "https://nghesiviet.vn/storage/files/7/kieutrinh/hot-girl-kieu-trinh.jpg",
      },
    };
  },
  mounted() {},
  methods: {
    // Upload profile img
    uploadProfile(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.profileImagePrev = e.target.result;
      };
      this.profileImage = image;
    },
    uploadImage(e, imageType) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        let arr = this.$data[imageType + "Prev"];
        arr.push(e.target.result);
        // this.previewImage = e.target.result;
      };

      let arr = this.$data[imageType];
      arr.push(image);
    },
    // Remove image from list
    removeImage(index, imageType) {
      let imgArr = this.$data[imageType];
      let imgPrevArr = this.$data[imageType + "Prev"];
      this.$delete(imgArr, index);
      this.$delete(imgPrevArr, index);
    },
    // Upload image to firebase
    uploadImageToFirebase() {
      this.img1 = null;
      const storageRef = firebase
        .storage()
        .ref(`${this.imageData.name}`)
        .put(this.imageData);
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
            this.img1 = url;
            console.log(this.img1);
          });
        }
      );
    },
    changeTab() {
      this.isUserInfoVisible = !this.isUserInfoVisible;
    },
    isNumber(evt) {
      isNumber(evt);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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

#upload-photo {
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
  border-radius: 55%;
  min-width : 200px;
  max-width : 300px;
  min-height: 200px;
  max-height: 300px;
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
  left: 29%;
  top: 29%;
}
</style>
<style>
@import "../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

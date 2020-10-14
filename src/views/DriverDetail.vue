<template>
  <div class="content-wrapper">
    <div class="page-header">
      <h3 class="page-title test">
        <router-link to="/drivers">
          Drivers
        </router-link>
        <span class="text-secondary">/</span>
        <span>
          {{ this.userId }}
        </span>
      </h3>
    </div>
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <!-- Image -->
            <div class="row justify-content-center">
              <img
                :src="detail.image"
                class="ui medium circular image pro-img"
                alt="image"
              />
              <div class="col-12 text-center">
                <h2>{{ driver.fullName }}</h2>
                <h4 class="text-secondary">ID : {{ driver.userId }}</h4>
              </div>
            </div>
            <div class="right floated edit-btn">
              <button class="ui icon button" v-on:click="handleUpdIconClick()">
                <i class="edit icon"></i>
              </button>
            </div>

            <!-- Detailed information -->
            <div class="pro-devider">
              <h4 class="ui horizontal divider header text-secondary">
                <i class="id card outline icon"></i>
              </h4>
            </div>

            <div class="row">
              <div class="form-group col-sm">
                <label class="col-md-6 col-form-label">Full name</label>
                <div class="col-sm-12">
                  <input
                    type="text"
                    class="form-control"
                    v-model="driver.fullName"
                    :disabled="!isUpdateVisible"
                  />
                </div>
              </div>
              <div class="form-group col-sm">
                <label class="col-md-6 col-form-label">Birth Date</label>
                <div class="col-sm-12">
                  <input
                    type="date"
                    class="form-control"
                    v-model="driver.dateOfBirth"
                    :disabled="!isUpdateVisible"
                  />
                </div>
              </div>
              <div class="form-group col-sm">
                <label class="col-md-8 col-form-label">Gender</label>
                <div class="col-12">
                  <select
                    class="form-control"
                    v-model="driver.gender"
                    :disabled="!isUpdateVisible"
                  >
                    <option :value="true">Male</option>
                    <option :value="false">Female</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-sm">
                <label class="col-md-6 col-form-label">Base Salary</label>
                <div class="col-sm-12">
                  <input
                    type="text"
                    class="form-control"
                    v-model="driver.baseSalary"
                    @keypress="isNumber($event)"
                    :disabled="!isUpdateVisible"
                  />
                </div>
              </div>
              <div class="form-group col-sm">
                <label class="col-md-8 col-form-label">Phone number</label>
                <div class="col-sm-12">
                  <input
                    type="text"
                    class="form-control"
                    v-model="driver.phoneNumber"
                    :disabled="!isUpdateVisible"
                    @keypress="isNumber($event)"
                    maxlength="10"
                  />
                </div>
              </div>
              <div class="form-group col-sm">
                <label class="col-md-8 col-form-label">Address</label>
                <div class="col-sm-12">
                  <input
                    type="text"
                    class="form-control"
                    v-model="driver.address"
                    :disabled="!isUpdateVisible"
                  />
                </div>
              </div>
            </div>
            <!-- Button group -->
            <div class="row justify-content-center mt-4" v-if="isUpdateVisible">
              <div class="col-4">
                <button
                  class="btn btn-gradient-info btn-fw"
                  type="button"
                  v-on:click="update()"
                >
                  Update
                </button>
                <button
                  class="btn btn-gradient-danger btn-fw ml-2"
                  type="button"
                  v-on:click="cancelUpdate()"
                >
                  Cancel
                </button>
              </div>
            </div>
            <vue-confirm-dialog class="confirm-dialog"></vue-confirm-dialog>
          </div>
        </div>
      </div>
    </div>

    <!-- Document -->
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="form-group col-sm ">
                <h4 class="col-md-8 ">Documents</h4>

                <div class="ui cards col-lg-12 justify-content-center mt-4">
                  <div class="row">
                    <div
                      class=" col-4 mb-5 document"
                      v-for="(userDocument, index) in this.userDocumentList"
                      :key="userDocument.userDocumentId"
                    >
                      <div class="ui slide masked reveal image">
                        <img
                          :src="userDocument.documentImages[0].imageLink"
                          class="visible content document-img"
                          @click="openGallery(index)"
                        />
                        <img
                          :src="userDocument.documentImages[1].imageLink"
                          class="hidden content document-img"
                          @click="openGallery(index)"
                        />
                      </div>

                      <div class="content mt-2">
                        <div class="Header mt-3">
                          <h3 class="header">
                            {{ userDocument.userDocumentType }}
                          </h3>
                        </div>
                        <div class="pro-devider">
                          <h4
                            class="ui horizontal divider header text-secondary"
                          >
                            <i class="id card outline icon"></i>
                          </h4>
                        </div>
                        <div class="extra">
                           <p>
                            <span>Register ID:</span>
                            {{ userDocument.userDocumentId }}
                          </p>
                          <p>
                            <span>Register Date:</span>
                            {{ userDocument.registerDate }}
                          </p>
                          <p>
                            <span>Register Location:</span>
                            {{ userDocument.registerLocation }}
                          </p>
                          <p class="mb-3">
                            <span>Register Date:</span>
                            {{ userDocument.expiryDate }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <LightBox
                    ref="lightbox"
                    :media="media"
                    :showLightBox="false"
                  ></LightBox>
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
import { RepositoryFactory } from "../repositories/RepositoryFactory";
import moment from "moment";
import LightBox from "vue-image-lightbox";

require("vue-image-lightbox/dist/vue-image-lightbox.min.css");

const DriverRepository = RepositoryFactory.get("drivers");
export default {
  components: { LightBox },
  data() {
    return {
      imageHeight: "150px",
      imageWidth: "185px",
      media: [
        {
          thumb: "",
          src: "",
        },
      ],
      driver: {},
      // TODO: DELETE THIS detail
      detail: {
        image:
          "https://nghesiviet.vn/storage/files/7/kieutrinh/hot-girl-kieu-trinh.jpg",
      },
      tempDriver: {},
      userId: "",
      isUpdateVisible: false,
      isImageVisible: false,
      userDocumentList: [
        {
          documentImages: [
            {
              documentImageId: 0,
              imageLink:
                "https://media.doisongphapluat.com/thumb_x500x/517/2017/10/11/3-khong-mang-giay-to-tuy-than-ra-duong-co-bi-phat-dspl.php.jpg",
            },
            {
              documentImageId: 1,
              imageLink:
                "https://media.doisongphapluat.com/thumb_x500x/517/2017/10/11/3-khong-mang-giay-to-tuy-than-ra-duong-co-bi-phat-dspl.php.jpg",
            },
          ],
          expiryDate: "2020-10-13T13:12:35.641Z",
          registerDate: "2020-10-13T13:12:35.641Z",
          registerLocation: "HCM",
          userDocumentId: "1",
          userDocumentType: "Document 1",
          userId: "1",
        },
        {
          documentImages: [
            {
              documentImageId: 0,
              imageLink:
                "https://media.doisongphapluat.com/thumb_x500x/517/2017/10/11/3-khong-mang-giay-to-tuy-than-ra-duong-co-bi-phat-dspl.php.jpg",
            },
            {
              documentImageId: 1,
              imageLink:
                "https://media.doisongphapluat.com/thumb_x500x/517/2017/10/11/3-khong-mang-giay-to-tuy-than-ra-duong-co-bi-phat-dspl.php.jpg",
            },
          ],
          expiryDate: "2020-10-13T13:12:35.641Z",
          registerDate: "2020-10-13T13:12:35.641Z",
          registerLocation: "HCM",
          userDocumentId: "2",
          userDocumentType: "Document 1",
          userId: "1",
        },
        {
          documentImages: [
            {
              documentImageId: 0,
              imageLink:
                "https://media.doisongphapluat.com/thumb_x500x/517/2017/10/11/3-khong-mang-giay-to-tuy-than-ra-duong-co-bi-phat-dspl.php.jpg",
            },
            {
              documentImageId: 1,
              imageLink:
                "https://media.doisongphapluat.com/thumb_x500x/517/2017/10/11/3-khong-mang-giay-to-tuy-than-ra-duong-co-bi-phat-dspl.php.jpg",
            },
          ],
          expiryDate: "2020-10-13T13:12:35.641Z",
          registerDate: "2020-10-13T13:12:35.641Z",
          registerLocation: "HCM",
          userDocumentId: "3",
          userDocumentType: "Document 1",
          userId: "1",
        },
      ],
    };
  },
  mounted() {
    this.userId = this.$route.params.userId;
    this.initDriverData();
  },
  methods: {
    isNumber(evt) {
      isNumber(evt);
    },
    // Handle document image light box
    openGallery(index) {
      this.isImageVisible = true;
      this.$refs.lightbox.showImage(0);
      this.media = [];
      let documentImages = this.userDocumentList[index].documentImages;
      documentImages.forEach((img) => {
        let temp = {
          thumb: img.imageLink,
          src: img.imageLink,
        };
        this.media.push(temp);
      });
      this.isImageVisible = true;
    },
    // Handle update icon click
    handleUpdIconClick() {
      this.isUpdateVisible = !this.isUpdateVisible;
      this.tempDriver = Object.assign({}, this.driver);
    },
    // Init data for driver's detailed information
    async initDriverData() {
      this.driver = await DriverRepository.getDetailDriver(this.userId);
      if (this.driver) {
        this.driver.dateOfBirth = moment(this.driver.dateOfBirth).format(
          "YYYY-MM-DD"
        );
      }
    },
    // Cancel update
    cancelUpdate() {
      this.driver = Object.assign({}, this.tempDriver);
      console.log(this.tempDriver);
      this.isUpdateVisible = !this.isUpdateVisible;
    },
    // Update driver
    update() {
      this.$confirm({
        title: "Update Confirmation",
        message: "Do you want to update this driver?",
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            // ... do something
          }
        },
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>
<style>
.pro-img {
  width: 180px !important;
  margin-bottom: 1%;
}
.edit-btn {
  position: absolute;
  top: 2%;
  right: 1%;
}
.pro-devider {
  margin: 2% 30% 4% 30%;
}

.form-control {
  font-size: 14px;
}

.col-form-label {
  color: #242323;
  font-weight: 600;
}

.btn {
  font-size: 17px;
}
.ui.card {
  margin: 0%;
}
.document-img:hover {
  cursor: pointer;
}

.document .content {
  border: #cecdcd 1px solid;
}
.document .content .extra p {
  font-size: 14px !important;
}

.document .content .extra span {
  font-weight: 700;
  margin-left: 10px;
}

.document .header {
  text-align: center;
}
</style>

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
        <a @click="$router.go(-1)" href="javascript:void(0)">
          {{ this.prevRoute === null ? "Contributors" : this.prevRoute.name }}
        </a>
        <span class="text-secondary">/</span>
        <span>
          {{ this.$route.params.userId }}
        </span>
      </h3>
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
    <div class="row" v-if="isUserInfoVisible">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <h4 class="ui dividing header">BASIC INFORMATION</h4>

              <div class="field">
                <label>Profile image</label>
              </div>
              <div class="row justify-content-center">
                <div class="upload-pro ">
                  <img
                    :src="contributor.imageLink"
                    class="ui medium circular image pro-img"
                    alt="image"
                    @click="viewProfilePhoto()"
                    v-if="
                      contributor.imageLink !== null &&
                        contributor.imageLink.length > 0
                    "
                  />
                  <img
                    src="../../assets/images/unnamed.png"
                    class="ui medium circular image pro-img"
                    alt="image"
                    v-else-if="profileImagePrev == null"
                  />
                </div>
              </div>

              <div class="row justify-content-center mt-4">
                <h4 class="col-12 text-center">ID: {{ contributor.userId }}</h4>
                <p
                  class="badge ml-2"
                  v-if="contributor.userStatus"
                  v-bind:class="{
                    'badge-info': contributor.userStatus === 'ACTIVE',
                    'badge-danger': contributor.userStatus === 'INACTIVE',
                    'badge-dark': contributor.userStatus === 'DISABLE',
                  }"
                >
                  {{ contributor.userStatus }}
                </p>
              </div>

              <div class="two fields mt-4">
                <!-- Full name -->
                <div class="field">
                  <label>Full Name</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="contributor.fullName"
                      readonly
                    />
                  </div>
                </div>
                <!-- Phone number -->
                <div class="field">
                  <label>Phone Number</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="contributor.phoneNumber"
                      readonly
                    />
                  </div>
                </div>
              </div>
              <div class="three fields">
                <!-- Gender  -->
                <div class="field">
                  <label>Gender</label>
                  <input
                    type="text"
                    :value="contributor.gender ? 'Male' : 'Female'"
                    readonly
                  />
                </div>

                <!-- Birthdate -->
                <div class="field">
                  <label>Birthdate</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="contributor.dateOfBirth"
                      class="form-control"
                      readonly
                    />
                  </div>
                </div>
                <!-- Total Vehicle -->
                <div class="field">
                  <label>Total Vehicles</label>
                  <div class="ui action input">
                    <input
                      type="text"
                      :value="
                        contributor.totalVehicles
                          ? contributor.totalVehicles
                          : 'N/A'
                      "
                      readonly
                    />
                    <button
                      class="ui right labeled icon button"
                      @click="
                        () => {
                          this.$router.push({
                            name: 'Vehicles',
                            params: { ownerId: contributor.userId },
                          });
                        }
                      "
                    >
                      <i class="truck icon"></i>
                      View All
                    </button>
                  </div>
                </div>
              </div>
              <!-- Adress -->
              <div class="field">
                <label>Address</label>
                <div class="ui corner labeled input">
                  <input
                    type="text"
                    v-model="contributor.address"
                    maxlength="30"
                    readonly
                  />
                </div>
              </div>
              <!-- Button group -->
              <div class="row justify-content-center mt-5">
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
    <!-- User document -->
    <div class="row" v-else>
      <div
        class="col-lg-12 grid-margin stretch-card"
        v-for="document in contributor.userDocumentList"
        :key="document.userDocumentId"
      >
        <UserDocument :title="document.userDocumentType" :document="document" />
      </div>
      <!-- Confirm Group -->
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <!-- Button group -->
              <div class="row justify-content-center">
                <button
                  class="btn btn-gradient-danger btn-fw ml-2"
                  type="button"
                  v-on:click="changeTab()"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Light box -->
    <LightBox ref="lightbox" :media="media" :showLightBox="false"></LightBox>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Loading from "vue-loading-overlay";
import LightBox from "vue-image-lightbox";
require("vue-image-lightbox/dist/vue-image-lightbox.min.css");
import UserDocument from "../../components/UserDocument/ReadOnlyDocument";

export default {
  name: "CustomerDetail",
  components: {
    Loading,
    LightBox,
    UserDocument,
  },
  data() {
    return {
      contributor: {
        userId: "",
        fullName: "",
        address: "",
        phoneNumber: "",
        gender: true,
        dateOfBirth: "",
        imageLink: "",
        baseSalary: "",
        userStatusId: 2,
        userDocumentReqList: [],
      },
      // Profile image
      profileImage: null,
      profileImagePrev: null,
      isUserInfoVisible: true,
      isLoading: false,
      media: [
        {
          thumb: "",
          src: "",
        },
      ],
      prevRoute: null,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  async mounted() {
    await this.initDetailContributor();
  },
  methods: {
    // Map actions
    ...mapActions("Contributor", ["_getDetailContributor"]),
    // Get contributor's detailed information
    async initDetailContributor() {
      this.isLoading = true;
      await this._getDetailContributor(this.$route.params.userId).then(
        (res) => {
          this.contributor = res;
          this.isUserComLoading = true;
        }
      );
      this.isLoading = false;
    },
    changeTab() {
      document.getElementById("app").scrollIntoView();
      this.isUserInfoVisible = !this.isUserInfoVisible;
    },
    viewProfilePhoto() {
      this.media = [];
      let temp = {
        thumb: this.contributor.imageLink,
        src: this.contributor.imageLink,
      };
      this.media.push(temp);
      this.$refs.lightbox.showImage(0);
    },
    openGallery(img, index) {
      this.media = img;
      this.$refs.lightbox.showImage(index);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.field label {
  margin-top: 10px !important;
}

.step i {
  color: #047edf !important;
}

.ui.large.image:hover {
  cursor: pointer;
}
.pro-img:hover {
  cursor: pointer;
}
.badge {
  font-size: 13px;
}

.ui.right.labeled {
  background-color: #3497e9;
  color: rgb(255, 255, 255);
}
.upload-pro img {
  border-radius: 50%;
  width: 280px !important;
  height: 280px !important;
}
</style>
<style>
@import "../../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>

<template>
  <div class="content-wrapper" ref="container">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <!-- Wirthdraw confimation -->
    <Confirmation
      icon="bus"
      title="Vehicle Withdraw Confirmation"
      subTitle="Do you want to withdraw the vehicle from this driver?"
      rightBtnTitle="Withdraw"
      rightBtnIcon="trash alternate"
      rightBtnColor="red"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="blue"
      :handleLeftBtn="
        () => {
          this.isWithdrawVisible = !this.isWithdrawVisible;
        }
      "
      :handleRightBtn="handleWithdrawVehicle"
      v-if="isWithdrawVisible"
    />
    <!-- Success message -->
    <MessageModal
      title="Withdraw Vehicle Successfully!"
      icon="check circle"
      :subTitle="`Withdraw vehicle successfully`"
      :proFunc="
        () => {
          this.isSuccess = !this.isSuccess;
        }
      "
      v-if="isSuccess"
    />
    <!-- Error message -->
    <MessageModal
      title="Withdraw Vehicle Fail!"
      icon="frown outline "
      :subTitle="errMsg"
      :proFunc="
        () => {
          this.isError = !this.isError;
        }
      "
      v-if="isError"
    />

    <div class="page-header">
      <h3 class="page-title test">
        <a @click="$router.go(-1)" href="javascript:void(0)">
          <!-- {{ this.prevRoute === null ? "Drivers" : this.prevRoute.name }} -->
          Drivers
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
                    :src="driver.imageLink"
                    class="ui medium circular image pro-img"
                    alt="image"
                    @click="viewProfilePhoto()"
                    v-if="
                      driver.imageLink !== null && driver.imageLink.length > 0
                    "
                  />
                  <img
                    src="../../assets/images/unnamed.png"
                    class="ui medium circular image pro-img"
                    alt="image"
                    v-else
                  />
                </div>
              </div>

              <div class="row justify-content-center mt-4">
                <h4 class="col-12 text-center">ID: {{ driver.userId }}</h4>
                <p
                  class="badge ml-2"
                  v-if="driver.userStatus"
                  v-bind:class="{
                    'badge-info': driver.userStatus === 'ACTIVE',
                    'badge-danger': driver.userStatus === 'INACTIVE',
                    'badge-dark': driver.userStatus === 'DISABLE',
                  }"
                >
                  {{ driver.userStatus }}
                </p>
              </div>

              <div class="two fields mt-4">
                <!-- Full name -->
                <div class="field">
                  <label>Full Name</label>
                  <div class="ui corner labeled input">
                    <input type="text" v-model="driver.fullName" readonly />
                  </div>
                </div>
                <!-- Phone number -->
                <div class="field">
                  <label>Phone Number</label>
                  <div class="ui corner labeled input">
                    <input type="text" v-model="driver.phoneNumber" readonly />
                  </div>
                </div>
                <!-- Vehicle ID -->
                <div class="field">
                  <label>Vehicle ID</label>
                  <div class="ui action input">
                    <template v-if="driver.vehicleId">
                      <input
                        type="text"
                        :value="driver.vehicleId ? driver.vehicleId : 'N/A'"
                        readonly
                      />
                      <button
                        class="ui right labeled red icon button"
                        @click="
                          () => {
                            this.isWithdrawVisible = !this.isWithdrawVisible;
                          }
                        "
                      >
                        <i class="truck icon"></i>
                        Wirthdraw
                      </button>
                    </template>
                    <template v-else>
                      <input type="text" value="N/A" readonly />
                      <button
                        class="ui right labeled blue icon button"
                        :disabled="driver.userStatus === 'DISABLE'"
                        @click="handAssignVehicle"
                      >
                        <i class="truck icon"></i>
                        Assign
                      </button>
                    </template>
                  </div>
                </div>
              </div>
              <div class="three fields">
                <!-- Gender  -->
                <div class="field">
                  <label>Gender</label>
                  <input
                    type="text"
                    :value="driver.gender ? 'Male' : 'Female'"
                    readonly
                  />
                </div>

                <!-- Birthdate -->
                <div class="field">
                  <label>Birthdate</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="driver.dateOfBirth"
                      class="form-control"
                      readonly
                    />
                  </div>
                </div>
                <!-- Base Salary -->
                <div class="field ">
                  <label>Base Salary</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      name="Salary"
                      v-model="driver.baseSalary"
                      readonly
                    />
                  </div>
                </div>
              </div>
              <!-- Adress -->
              <div class="field">
                <label>Address</label>
                <div class="ui corner labeled input">
                  <input
                    type="text"
                    v-model="driver.address"
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
        v-for="document in driver.userDocumentList"
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
import { RepositoryFactory } from "../../repositories/RepositoryFactory";
require("vue-image-lightbox/dist/vue-image-lightbox.min.css");
import Confirmation from "../../components/Modal/Confirmation";
import MessageModal from "../../components/Modal/MessageModal";
import UserDocument from "../../components/UserDocument/ReadOnlyDocument";

const AssignVehicleRepository = RepositoryFactory.get("assignVehicle");

export default {
  name: "DriverDetail",
  components: {
    Loading,
    LightBox,
    UserDocument,
    Confirmation,
    MessageModal,
  },
  data() {
    return {
      driver: {
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
      isUserInfoVisible: true,
      isLoading: false,
      // Modal
      isWithdrawVisible: false,
      isSuccess: false,
      errMsg: "",
      isError: "",
      media: [
        {
          thumb: "",
          src: "",
        },
      ],
      prevRoute: null,
      userId: this.$route.params.userId,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      3;
      vm.prevRoute = from;
    });
  },
  async mounted() {
    await this.initDetailDriver();
  },
  methods: {
    ...mapActions("Driver", ["_getDetailDriver"]),
    // Init driver's information
    async initDetailDriver() {
      this.isLoading = true;
      await this._getDetailDriver(this.userId)
        .then((res) => {
          console.log(res);
          this.driver = res;
          this.isUserLoading = true;
        })
        .catch((err) => {
          if (err) {
            this.isError = true;
            this.errMsg = err.debugMessage;
          }
        });
      this.isLoading = false;
    },
    // Handle assgin vehicle
    handAssignVehicle() {
      this.$router.push({
        name: "AssignedVehicles",
        params: {
          driver: {
            userId: this.driver.userId,
            fullName: this.driver.fullName,
          },
        },
      });
    },
    // handle withdraw vehicle
    async handleWithdrawVehicle() {
      this.isWithdrawVisible = !this.isWithdrawVisible;
      this.isLoading = true;
      await AssignVehicleRepository.withdrawVehicle(this.driver.vehicleId)
        .then((res) => {
          if (res) {
            this.isSuccess = !this.isSuccess;
          }
        })
        .catch((err) => {
          this.isError = !this.isError;
          this.errMsg = err.message;
          console.log(err);
        });
      this.isLoading = false;
    },
    changeTab() {
      document.getElementById("app").scrollIntoView();
      this.isUserInfoVisible = !this.isUserInfoVisible;
    },
    viewProfilePhoto() {
      this.media = [];
      let temp = {
        thumb: this.driver.imageLink,
        src: this.driver.imageLink,
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

.ui.right.labeled.blue {
  background-color: #3497e9;
  color: rgb(255, 255, 255);
}
.ui.right.labeled.red {
  background-color: #eb362a;
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

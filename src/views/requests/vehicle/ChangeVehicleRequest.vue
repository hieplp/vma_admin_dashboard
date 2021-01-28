<template>
  <div class="content-wrapper" ref="container">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <VehiclesModal
      v-if="isVehicleModalVisible"
      :cancelFunction="handleVehicleModal"
      :doneFunction="getVehicleId"
      :vehicleId="changeVehicle"
      :propSeatMax="licenseClass.seat"
      propStatus="AVAILABLE_NO_DRIVER"
      ref="vehicleModal"
    />
    <!-- Reject confimation -->
    <Confirmation
      icon="x"
      title="Deny Confirmation"
      subTitle="Do you want to deny this request?"
      rightBtnTitle="Deny"
      rightBtnIcon="trash alternate"
      rightBtnColor="red"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="blue"
      v-if="isRejectConVisible"
      :handleLeftBtn="
        () => {
          this.isRejectConVisible = !this.isRejectConVisible;
        }
      "
      :handleRightBtn="
        () => {
          this.updateRequestStatus('DENIED');
        }
      "
    />
    <!-- Accept confimation -->
    <Confirmation
      icon="clipboard check"
      title="Accept Confirmation"
      subTitle="Do you want to accept this request?"
      rightBtnTitle="Accept"
      rightBtnIcon="check"
      rightBtnColor="blue"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="red"
      v-if="isAcceptConVisible"
      :handleLeftBtn="
        () => {
          this.isAcceptConVisible = !this.isAcceptConVisible;
        }
      "
      :handleRightBtn="
        () => {
          this.updateRequestStatus('ACCEPTED');
        }
      "
    />

    <!-- Error message -->
    <MessageModal
      :title="errTitle"
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
      :title="successTitle"
      icon="check circle"
      :subTitle="successSubTitle"
      :proFunc="
        () => {
          this.isSuccess = !this.isSuccess;
          this.searchRequests();
        }
      "
      v-if="isSuccess"
    />

    <div class="page-header">
      <h3 class="page-title test">
        <router-link to="/requests/vehicles"> Vehicle Request </router-link>
        <span class="text-secondary">/</span>
        <span>
          {{ this.$route.params.requestId }}
        </span>
      </h3>
    </div>

    <!-- User Information -->
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <h4 class="ui dividing header">REQUEST INFORMATION</h4>

              <div class="two fields mt-4">
                <!-- Request Id -->
                <div class="field">
                  <label>Request Id</label>
                  <div class="ui corner labeled input">
                    <input type="text" v-model="request.requestId" readonly />
                  </div>
                </div>
                <!-- Request Status -->
                <div class="field">
                  <label>Request Status</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      class="pending-req"
                      :class="{
                        'blue-req': request.requestStatus === 'ACCEPTED',
                        'red-req': request.requestStatus === 'DENIED',
                        'yellow-req': request.requestStatus === 'PENDING',
                      }"
                      v-model="request.requestStatus"
                      readonly
                    />
                  </div>
                </div>

                <!-- Request Type -->
                <div class="field">
                  <label>Request Type</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      :class="{
                        'blue-req': request.requestType === 'ADD_NEW_VEHICLE',
                        'yellow-req': request.requestType === 'CHANGE_VEHICLE',
                      }"
                      v-model="request.requestType"
                      readonly
                    />
                  </div>
                </div>

                <!-- Vehicle  -->
                <div class="field" v-if="request.vehicleId">
                  <label>Vehicle</label>
                  <div class="ui action input">
                    <input
                      type="text"
                      :value="request.vehicleId ? request.vehicleId : 'N/A'"
                      readonly
                    />
                    <button
                      class="ui right labeled blue icon button"
                      @click="
                        () => {
                          this.$router.push({
                            name: 'VehicleDetail',
                            params: { vehicleId: request.vehicleId },
                          });
                        }
                      "
                    >
                      <i class="bus icon"></i>
                      View
                    </button>
                  </div>
                </div>
              </div>
              <div class="two fields">
                <!-- User  -->
                <div class="field">
                  <label>User</label>
                  <div class="ui action input">
                    <input
                      type="text"
                      :value="request.fullName ? request.fullName : 'N/A'"
                      readonly
                    />
                    <button
                      class="ui right labeled blue icon button"
                      @click="
                        () => {
                          if (request.requestType === 'CHANGE_VEHICLE') {
                            this.$router.push({
                              name: 'DriverDetail',
                              params: { userId: request.userId },
                            });
                          } else {
                            this.$router.push({
                              name: 'ContributorDetail',
                              params: { userId: request.userId },
                            });
                          }
                        }
                      "
                    >
                      <i class="user icon"></i>
                      View
                    </button>
                  </div>
                </div>

                <!-- Create Date -->
                <div class="field">
                  <label>Create Date</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="request.createDate"
                      class="form-control"
                      readonly
                    />
                  </div>
                </div>

                <!-- Vehicle  -->
                <div
                  class="field"
                  v-if="request.requestType === 'NEED_BACKUP_VEHICLE'"
                >
                  <label>Vehicle</label>
                  <div class="ui action input">
                    <input
                      type="text"
                      :value="vehicleData.vehiclesId"
                      readonly
                    />
                    <button
                      class="ui right labeled blue icon button"
                      @click="
                        () => {
                          this.$router.push({
                            name: 'VehicleTracking',
                            params: {
                              vehicleId: request.vehicleId,
                              coordinates: request.coordinates,
                              minSeat: vehicle.seatsModel.seats,
                              requestId: request.requestId,
                              vehiclesId: vehicleData.vehiclesId,
                            },
                          });
                        }
                      "
                    >
                      <i class="bus icon"></i>
                      Pick
                    </button>
                  </div>
                  <div class="ui pointing red basic label" v-if="isVehicleErr">
                    Vehicle is required!
                  </div>
                </div>

                <!-- User Document Id -->
                <div
                  class="field"
                  v-if="request.requestType.includes('DOCUMENT')"
                >
                  <label>Vehicle Document Id</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="request.vehicleDocumentId"
                      class="form-control"
                      readonly
                    />
                  </div>
                </div>
                <!-- Vehicle -->
                <div
                  class="field"
                  v-if="request.requestType === 'CHANGE_VEHICLE'"
                >
                  <label>Vehicle Change</label>
                  <div class="ui action input">
                    <input
                      v-model="changeVehicle"
                      type="text"
                      readonly
                      placeholder="Pick an vehicle"
                    />
                    <button
                      class="ui right labeled icon button"
                      @click="handleVehicleModal"
                    >
                      <i class="bus icon"></i>
                      Pick
                    </button>
                  </div>
                  <div class="ui pointing red basic label" v-if="isVehicleErr">
                    Vehicle is required!
                  </div>
                </div>
              </div>
              <!-- Discription -->
              <div class="field">
                <label>Description</label>
                <textarea
                  rows="3"
                  readonly
                  :value="request.description"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- User Document  -->
      <div
        class="col-lg-12 grid-margin stretch-card"
        v-if="isUserInfoVisible && document"
      >
        <VehicleDocument
          :title="document.vehicleDocumentType"
          :document="document"
        />
      </div>
      <!-- Reject/Accept Group -->
      <div
        class="col-lg-12 grid-margin stretch-card"
        v-if="request.requestStatus === 'PENDING'"
      >
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <div class="row justify-content-center">
                <div class="col-4">
                  <!-- Reject button -->
                  <button
                    class="btn btn-gradient-danger btn-fw"
                    type="button"
                    v-on:click="
                      () => {
                        this.isRejectConVisible = !this.isRejectConVisible;
                      }
                    "
                  >
                    Deny
                  </button>
                  <!-- Accept button -->
                  <button
                    class="btn btn-gradient-info btn-fw ml-2"
                    type="button"
                    v-on:click="
                      () => {
                        this.isAcceptConVisible = !this.isAcceptConVisible;
                      }
                    "
                  >
                    Accept
                  </button>
                </div>
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
import { RepositoryFactory } from "../../../repositories/RepositoryFactory";
require("vue-image-lightbox/dist/vue-image-lightbox.min.css");
import Confirmation from "../../../components/Modal/Confirmation";
import MessageModal from "../../../components/Modal/MessageModal";
import VehiclesModal from "../../../components/Modal/AssignVehicleModal";
import VehicleDocument from "../../../components/Vehicle/ReadOnlyDocument";

const RequestRepository = RepositoryFactory.get("requests");
const DocumentRepository = RepositoryFactory.get("documents");

export default {
  name: "VehicleDocumentRequestDetail",
  components: {
    Loading,
    LightBox,
    VehicleDocument,
    Confirmation,
    MessageModal,
    VehiclesModal,
  },
  data() {
    return {
      request: {
        requestId: "",
        userId: "",
        userDocumentId: "",
        vehicleId: "",
        vehicleDocumentId: "",
        requestStatus: "",
        requestType: "",
        description: "",
        createDate: "",
      },
      vehicle: null,
      document: null,
      isUserInfoVisible: true,
      isLoading: false,
      isRejectConVisible: false,
      isAcceptConVisible: false,
      // Error modal
      isError: false,
      isVehicleErr: false,
      errTitle: "",
      errMsg: "",
      // Success modal
      isSuccess: false,
      successSubTitle: "",
      successTitle: "",
      // data for vehicle backup request
      vehicleData: {
        brokenVehicleLocation: "",
        far: true,
        requestId: this.$route.params.requestId,
        requestStatus: "ACCEPTED",
        vehiclesId: [],
      },
      media: [
        {
          thumb: "",
          src: "",
        },
      ],
      prevRoute: null,
      // Change request
      isVehicleModalVisible: false,
      changeVehicle: "",
      // For change vehicle
      drivingLicenseInfor: null,
      licenseClass: "",
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      3;
      vm.prevRoute = from;
    });
  },
  async mounted() {
    this.isLoading = true;

    await this.initRequest();

    if (this.request.requestType === "CHANGE_VEHICLE") {
      await this.initDataDocument();
      let drivingLicenseClasses = require("../../../assets/json/indentify/type.json");
      this.licenseClass =
        drivingLicenseClasses[this.drivingLicenseInfor.otherInformation];
    } else if (this.request.requestType === "NEED_BACKUP_VEHICLE") {
      await this.initVehicle();
      if (this.$route.params.vehicleData) {
        this.vehicleData = this.$route.params.vehicleData;
      }
    } else {
      await this.initDocument();
    }
    this.isUserInfoVisible = true;
    this.isLoading = false;
  },
  methods: {
    // Map actions
    ...mapActions("Request", [
      "_updateStatus",
      "_getRequestById",
      "_updateChangeReqStatus",
      "_handleBackUpReq",
    ]),
    ...mapActions("Document", ["_getDocuments"]),
    ...mapActions("Vehicle", ["_getDetailVehicle"]),
    // Init vehicle information
    async initVehicle() {
      await this._getDetailVehicle(this.request.vehicleId).then((res) => {
        this.vehicle = res;
        this.isVehiclenfoLoading = true;
      });
    },
    // Init request's information
    async initRequest() {
      await this._getRequestById(this.$route.params.requestId)
        .then((res) => {
          this.request = res;
        })
        .catch((err) => {
          this.errTitle = "Something went wrong!";
          this.errMsg = err.debugMessage;
          this.isError = !this.isError;
        });
    },
    // Init user document
    async initDocument() {
      await DocumentRepository.getVehicleDocumentById(
        this.request.vehicleId
      ).then((res) => {
        this.document = res;
      });
    },
    // Update request status
    async updateRequestStatus(requestStatus) {
      this.isLoading = true;
      // Set message for error dialog and success dialog
      switch (requestStatus) {
        case "ACCEPTED":
          this.errTitle = "Accept Request Fail!";
          this.successTitle = "Accept Request Successfully!";
          this.successSubTitle = `Request with id ${this.request.requestId} is accepted successfully!`;
          this.isAcceptConVisible = false;
          break;
        case "DENIED":
          this.errTitle = "Deny Request Fail!";
          this.successTitle = "Deny Request Successfully!";
          this.successSubTitle = `Request with id ${this.request.requestId} is denied successfully!`;
          this.isRejectConVisible = false;
          break;
      }
      if (
        this.request.requestType === "CHANGE_VEHICLE" &&
        requestStatus === "ACCEPTED"
      ) {
        if (this.changeVehicle.length > 0) {
          await this._updateChangeReqStatus({
            requestId: this.request.requestId,
            driverId: this.request.userId,
            targetVehicleId: this.changeVehicle,
          })
            .then(() => {
              this.isSuccess = true;
              this.request.requestStatus = requestStatus;
            })
            .catch((err) => {
              this.isError = !this.isError;
              this.errMsg = err.debugMessage;
            });
        } else {
          this.isVehicleErr = true;
        }
      } else if (this.request.requestType === "NEED_BACKUP_VEHICLE") {
        this.vehicleData.requestStatus = requestStatus;
        if (requestStatus === "DENIED") {
          this.vehicleData.vehiclesId = [];
        } else {
          this.isVehicleErr = this.vehicleData.vehiclesId.length === 0;
          if (this.isVehicleErr) {
            this.isLoading = false;
            return;
          }
        }

        await this._handleBackUpReq(this.vehicleData)
          .then(() => {
            this.isSuccess = true;
            this.request.requestStatus = requestStatus;
          })
          .catch((err) => {
            this.isError = !this.isError;
            this.errMsg = err.debugMessage;
          });
      } else {
        // update status
        await RequestRepository.updateStatus(
          this.request.requestId,
          requestStatus
        )
          .then(() => {
            this.isSuccess = true;
            this.request.requestStatus = requestStatus;
          })
          .catch((err) => {
            this.isError = !this.isError;
            this.errMsg = err.debugMessage;
          });
      }

      this.isLoading = false;
    },
    // Get vehicle
    getVehicleId() {
      this.changeVehicle = this.$refs.vehicleModal.getSelectedVehicle();

      this.handleVehicleModal();
    },
    handleVehicleModal() {
      this.isVehicleModalVisible = !this.isVehicleModalVisible;
    },
    openGallery(img, index) {
      this.media = img;
      this.$refs.lightbox.showImage(index);
    },

    // Init data for document
    async initDataDocument() {
      let documents = await this._getDocuments({
        userId: this.request.userId,
        option: 0,
      });

      this.drivingLicenseInfor = this.findDocumentByName(
        documents,
        "DRIVING_LICENSE"
      );
    },
    // Find document
    findDocumentByName(contributorDocument, userDocumentType) {
      for (let doc of contributorDocument) {
        if (doc.userDocumentType === userDocumentType) {
          return doc;
        }
      }
      return null;
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
.ui.right.labeled {
  background-color: #3497e9;
  color: rgb(255, 255, 255);
}
</style>

<template>
  <div class="content-wrapper" ref="container">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

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
        }
      "
      v-if="isSuccess"
    />

    <div class="page-header">
      <h3 class="page-title test">
        <a @click="$router.go(-1)" href="javascript:void(0)">
          <!-- {{ this.prevRoute === null ? "Drivers" : this.prevRoute.name }} -->
          Vehicle Document Requests
        </a>
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
                        'blue-req':
                          request.requestType === 'NEW_VEHICLE_DOCUMENT',
                        'red-req':
                          request.requestType === 'DELETE_VEHICLE_DOCUMENT',
                      }"
                      v-model="request.requestType"
                      readonly
                    />
                  </div>
                </div>

                <!-- Vehicle  -->
                <div class="field">
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
              <div class="three fields">
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
                          this.$router.push({
                            name: 'ContributorDetail',
                            params: { userId: request.userId },
                          });
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
                <!-- User Document Id -->
                <div class="field">
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
require("vue-image-lightbox/dist/vue-image-lightbox.min.css");
import Confirmation from "../../components/Modal/Confirmation";
import MessageModal from "../../components/Modal/MessageModal";

import VehicleDocument from "../../components/Vehicle/ReadOnlyDocument";

export default {
  name: "VehicleDocumentRequestDetail",
  components: {
    Loading,
    LightBox,
    VehicleDocument,
    Confirmation,
    MessageModal,
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
      document: null,
      isUserInfoVisible: true,
      isLoading: false,
      isRejectConVisible: false,
      isAcceptConVisible: false,
      // Error modal
      isError: false,
      errTitle: "",
      errMsg: "",
      // Success modal
      isSuccess: false,
      successSubTitle: "",
      successTitle: "",

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
      3;
      vm.prevRoute = from;
    });
  },
  async mounted() {
    this.isLoading = true;

    await this.initRequest();
    await this.initDocument();
    this.isUserInfoVisible = true;
    this.isLoading = false;
  },
  methods: {
    // Map actions
    ...mapActions("Request", ["_updateStatus", "_getRequestById"]),
    ...mapActions("Document", ["_getVehicleDocumentById"]),
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
      await this._getVehicleDocumentById(this.request.vehicleDocumentId).then(
        (res) => {
          this.document = res;
        }
      );
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
      // update status
      await this._updateStatus({
        requestId: this.request.requestId,
        requestStatus: requestStatus,
      })
        .then(() => {
          this.isSuccess = true;
          this.request.requestStatus = requestStatus;
        })
        .catch((err) => {
          this.isError = !this.isError;
          this.errMsg = err.debugMessage;
          console.log(err);
        });
      this.isLoading = false;
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
</style>

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
        <router-link to="/contracts">
          Contracts
        </router-link>
        <span class="text-secondary">/</span>
        <span>
          Update Contract
        </span>
      </h3>
    </div>
    <!-- Update Confirmation -->
    <Confirmation
      icon="edit outline"
      title="Update Confirmation"
      subTitle="Do you want to update this contract?"
      rightBtnTitle="Update"
      rightBtnIcon="check"
      rightBtnColor="blue"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="red"
      v-if="isUpdConVisible"
      :handleLeftBtn="
        () => {
          this.isUpdConVisible = !this.isUpdConVisible;
        }
      "
      :handleRightBtn="update"
    />
    <!-- Error message -->
    <MessageModal
      title="Update Contract Fail!"
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
      title="Update Contract Successfully!"
      icon="check circle"
      :subTitle="
        `Contract with id ${this.propContract.contractId} is updated successfully！`
      "
      :proFunc="
        () => {
          this.isUpdatedSuccessfully = !this.isUpdatedSuccessfully;
        }
      "
      v-if="isUpdatedSuccessfully"
    />

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
                <i class="flag checkered icon"></i>
                <div class="content">
                  <div class="title">CONTRACT INFORMATION</div>
                </div>
              </button>
              <button
                class="step"
                v-on:click="changeTab()"
                v-bind:class="{ active: !isUserInfoVisible }"
              >
                <i class="bus icon"></i>
                <div class="content">
                  <div class="title">VEHICLE</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ContractInformation
      ref="contractInfo"
      :propContract="propContract"
      v-if="propContract"
    />

    <div class="row" v-if="propContract">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <!-- Button group -->
              <div class="row justify-content-center">
                <button
                  class="btn btn-gradient-danger btn-fw ml-2"
                  type="button"
                  @click="cancel"
                >
                  Cancel
                </button>
                <button
                  class="btn btn-gradient-info btn-fw ml-2"
                  type="button"
                  @click="
                    () => {
                      this.isUpdConVisible = !this.isUpdConVisible;
                    }
                  "
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User document -->
    <div class="row" v-if="!isUserInfoVisible">
      <!-- Confirm Group -->
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <!-- Button group -->
              <div class="row justify-content-center mt-5">
                <div class="col-4">
                  <button
                    class="btn btn-gradient-danger btn-fw"
                    type="button"
                    @click="cancel"
                  >
                    Back
                  </button>
                  <button
                    class="btn btn-gradient-info btn-fw ml-2"
                    type="button"
                    v-on:click="() => {}"
                  >
                    Update
                  </button>
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
import { isNumber } from "../../assets/js/input.js";
// import * as firebase from "firebase";
import Loading from "vue-loading-overlay";
import ContractInformation from "../../components/Contract/ContractInformation";
import { RepositoryFactory } from "../../repositories/RepositoryFactory";
import Confirmation from "../../components/Modal/Confirmation";
import MessageModal from "../../components/Modal/MessageModal";
const ContractRepository = RepositoryFactory.get("contracts");

export default {
  name: "UpdateContract",
  components: {
    Loading,
    ContractInformation,
    Confirmation,
    MessageModal,
  },
  data() {
    return {
      contract: null,
      propContract: null,

      // Profile image
      isUserInfoVisible: true,

      isAddressLoading: false,

      // Basic Information Error
      ownerErr: false,
      departureTimeErr: false,
      destinationTimeErr: false,
      durationFromErr: false,
      durationToErr: false,
      otherInformationErr: false,
      signedDateErr: false,
      totalPriceErr: false,

      isLoading: false,
      isUpdatedSuccessfully: false,
      isUpdConVisible: false,
      isError: false,
      errMsg: "",

      documentExpiryDate: [],

      // Vehicle Owner
      isOwnerModalVisible: false,
      // Owner
      owner: {
        userId: "",
        fullName: "",
      },
    };
  },
  async mounted() {
    this.isLoading = true;
    await this.initContract();
    this.isLoading = false;
  },
  methods: {
    // Init contract
    async initContract() {
      await ContractRepository.getDetail(this.$route.params.contractId).then(
        (res) => {
          this.propContract = res;
        }
      );
    },
    // Update contract
    async update() {
      this.isUpdConVisible = false;
      let isValid = this.$refs.contractInfo.checkBasicInformation();
      if (!isValid) {
        this.isLoading = true;
        let contract = this.$refs.contractInfo.getData();
        await ContractRepository.update(contract)
          .then((res) => {
            if (res) {
              this.isUpdatedSuccessfully = true;
            }
          })
          .catch((ex) => {
            if (ex.debugMessage) {
              this.isError = true;
              this.errMsg = ex.debugMessage;
            }
            console.error(ex);
          });
        this.isLoading = false;
      }
    },
    // Cancel
    cancel() {
      this.$refs.contractInfo.initContract();
    },
    changeTab() {
      let isValid = this.checkBasicInformation();
      // let isValid = false;
      if (!isValid) {
        document.getElementById("app").scrollIntoView();
        this.isUserInfoVisible = !this.isUserInfoVisible;
      }
    },

    isNumber(evt) {
      isNumber(evt);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

.upload-photo {
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
  border-radius: 50%;
  width: 280px !important;
  height: 280px !important;
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
  left: 35%;
  top: 35%;
}

.cus-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(92, 90, 87, 0.637);
  z-index: 10000;
  width: 100%;
  height: 100%;
  padding-top: 12%;
  color: white;
}
.cus-modal .header {
  color: white;
  font-size: 35px !important;
}

.cus-select {
  padding-left: 26px !important;
}
.cus-disable {
  background-color: #858585 !important;
  color: white;
}
.ui.right.labeled {
  background-color: #3497e9;
  color: rgb(255, 255, 255);
}
</style>
<style>
@import "../../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

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
        <a class="nav-link">
          Configuration
        </a>
      </h3>
    </div>

    <Confirmation
      icon="edit outline"
      title="Update Confirmation"
      subTitle="Do you want to update this customer?"
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
      :subTitle="`Contract is updated successfully!`"
      :proFunc="
        () => {
          this.isUpdatedSuccessfully = !this.isUpdatedSuccessfully;
          this.$router.push({
            name: 'Contracts',
          });
        }
      "
      v-if="isUpdatedSuccessfully"
    />

    <MapPickerModal
      ref="mapPickerModal"
      v-if="isMapPickerVisible"
      :lat="config.companyLat"
      :lng="config.companyLng"
      :cancelFunction="
        () => {
          this.isMapPickerVisible = false;
        }
      "
      :doneFunction="
        () => {
          this.getCompanyCoordinate();
        }
      "
    />

    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <h4 class="ui dividing header">CONFIGURATION</h4>

              <div class="two fields mt-2">
                <!-- Driver time hour -->
                <div class="field">
                  <label>
                    Driver Time Break (Hour)
                    <span class="red-require"> *</span>
                  </label>
                  <input
                    type="text"
                    v-model="config.driverBreakHour"
                    @keypress="isNumber($event)"
                    placeholder="Driver Time Break (Hour)"
                  />
                  <div
                    class="ui pointing red basic label"
                    v-if="driverBreakHourErr"
                  >
                    Driver Time Break (Hour) is required!
                  </div>
                </div>
                <!-- Min time minute -->
                <div class="field">
                  <label>
                    Driver Time Break (Minute)
                    <span class="red-require"> *</span>
                  </label>
                  <select
                    type="text"
                    v-model="config.driverBreakMinute"
                    placeholder="Driver Time Break (Minute)"
                  >
                    <option value="0">0 minute</option>
                    <option v-for="index in 59" :value="index" :key="index">
                      {{ index + " minute(s)" }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="two fields mt-2">
                <!-- Contract time hour -->
                <div class="field">
                  <label>
                    Contract Pre Break Time (Hour)
                    <span class="red-require"> *</span>
                  </label>
                  <input
                    type="text"
                    @keypress="isNumber($event)"
                    v-model="config.contractPreBreakTime"
                    placeholder="Contract Time Break (Hour)"
                  />
                  <div
                    class="ui pointing red basic label"
                    v-if="contractPreBreakHourErr"
                  >
                    Contract Pre Break Time (Hour) is required!
                  </div>
                </div>
                <!-- Contract time minute -->
                <div class="field">
                  <label>
                    Contract Post Break Time (Hour)
                    <span class="red-require"> *</span>
                  </label>
                  <input
                    type="text"
                    @keypress="isNumber($event)"
                    v-model="config.contractPostBreakTime"
                    placeholder="Contract Time Break (Hour)"
                  />
                  <div
                    class="ui pointing red basic label"
                    v-if="contractPostBreakHourErr"
                  >
                    Contract Post Break Time (Hour) is required!
                  </div>
                </div>
              </div>

              <div class="two fields mt-2">
                <!-- Contract time hour -->
                <div class="field">
                  <label>
                    Max Driving Time (Hour)
                    <span class="red-require"> *</span>
                  </label>
                  <input
                    type="text"
                    @keypress="isNumber($event)"
                    v-model="config.maxDrivingHour"
                    placeholder="Contract Time Break (Hour)"
                  />
                  <div
                    class="ui pointing red basic label"
                    v-if="maxDrivingHourErr"
                  >
                    Max Driving Time (Hour) is required!
                  </div>
                </div>
                <!-- Contract time minute -->
                <div class="field">
                  <label>
                    Max Driving Time (Minute)
                    <span class="red-require"> *</span>
                  </label>
                  <select
                    type="text"
                    v-model="config.maxDrivingMinute"
                    placeholder="Contract Time Break (Minute)"
                  >
                    <option value="0">0 minute</option>
                    <option v-for="index in 59" :value="index" :key="index">
                      {{ index + " minute(s)" }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="two fields mt-2">
                <!-- Min contract start time hour -->
                <div class="field">
                  <label>
                    Min Contract Start Time (Hour)
                    <span class="red-require"> *</span>
                  </label>
                  <select
                    type="text"
                    v-model="config.minContractStartHour"
                    @change="
                      () => {
                        this.config.maxContractEndHour = '';
                      }
                    "
                    placeholder="Max contract end time (Minute)"
                  >
                    <option value="0">0</option>
                    <option v-for="index in 23" :value="index" :key="index">
                      {{ index }}
                    </option>
                  </select>
                  <div
                    class="ui pointing red basic label"
                    v-if="minContractStartHourErr"
                  >
                    Min Contract Start Time (Hour) is required!
                  </div>
                </div>
                <!-- Contract time minute -->
                <div class="field">
                  <label>
                    Min Contract Start Time (Minute)
                    <span class="red-require"> *</span>
                  </label>
                  <select
                    type="text"
                    v-model="config.minContractStartMinute"
                    placeholder="Min Contract Start Time (Minute)"
                  >
                    <option value="0">0 minute</option>
                    <option v-for="index in 59" :value="index" :key="index">
                      {{ index + " minute(s)" }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="two fields mt-2">
                <!-- Max working hour -->
                <div class="field">
                  <label>
                    Max Working Time (Hour)
                    <span class="red-require"> *</span>
                  </label>
                  <select
                    type="text"
                    v-model="config.maxWorkingHour"
                    placeholder="Max Working Time (Minute)"
                  >
                    <option value="0">0</option>
                    <option v-for="index in 23" :value="index" :key="index">
                      {{ index }}
                    </option>
                  </select>
                </div>
                <!-- Max Working Time (Minute) -->
                <div class="field">
                  <label>
                    Max Working Time (Minute)
                    <span class="red-require"> *</span>
                  </label>
                  <select
                    type="text"
                    v-model="config.maxWorkingMinute"
                    placeholder="Max Working Time (Minute)"
                  >
                    <option value="0">0 minute</option>
                    <option v-for="index in 59" :value="index" :key="index">
                      {{ index + " minute(s)" }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="two fields mt-2">
                <!-- Max contract end time hour -->
                <div class="field">
                  <label>
                    Max Contract End Time (Hour)
                    <span class="red-require"> *</span>
                  </label>
                  <select
                    type="text"
                    v-model="config.maxContractEndHour"
                    placeholder="Max contract end time (Minute)"
                  >
                    <option
                      value="0"
                      :disabled="disableMaxContractEndHourOpt(0)"
                      >0</option
                    >
                    <option
                      v-for="index in 23"
                      :value="index"
                      :key="index"
                      :disabled="disableMaxContractEndHourOpt(index)"
                    >
                      {{ index }}
                    </option>
                  </select>
                  <div
                    class="ui pointing red basic label"
                    v-if="maxContractEndHourErr"
                  >
                    Max Contract End Time (Hour) is required!
                  </div>
                </div>
                <!-- Max contract end time minute -->
                <div class="field">
                  <label>
                    Max contract end time (Minute)
                    <span class="red-require"> *</span>
                  </label>
                  <select
                    type="text"
                    v-model="config.maxContractEndMinute"
                    placeholder="Max contract end time (Minute)"
                  >
                    <option value="0">0 minute</option>
                    <option v-for="index in 59" :value="index" :key="index">
                      {{ index + " minute(s)" }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="two fields ">
                <!-- Max Distance -->
                <div class="field ">
                  <label>
                    Max Distance Support (KM)
                    <span class="red-require"> *</span>
                  </label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      @keypress="isNumber($event)"
                      v-model="config.maxDistanceSupport"
                      placeholder="N/A"
                    />
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="maxDistanceSupportErr"
                  >
                    Max Distance Support (KM) is required!
                  </div>
                </div>
                <!-- Max Distance -->
                <div class="field ">
                  <label>
                    Company Coordinates
                    <span class="red-require"> *</span>
                  </label>
                  <div class="ui action  input">
                    <input
                      type="text"
                      @keypress="isNumber($event)"
                      v-model="companyCoordinate"
                      placeholder="N/A"
                    />
                    <button
                      class="ui right labeled blue icon button"
                      @click="
                        () => {
                          this.isMapPickerVisible = true;
                        }
                      "
                    >
                      <i class="map marker alternate icon"></i>
                      Pick
                    </button>
                  </div>

                  <div
                    class="ui pointing red basic label"
                    v-if="maxDistanceSupportErr"
                  >
                    Max Distance Support (KM) is required!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirm Group -->
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <!-- Button group -->
              <div class="row justify-content-center">
                <div class="col-4">
                  <button class="btn btn-gradient-danger btn-fw" type="button">
                    Back
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import Confirmation from "../../components/Modal/Confirmation";
import { isNumber } from "../../assets/js/input.js";
import * as firebase from "firebase";
import MessageModal from "../../components/Modal/MessageModal";
import MapPickerModal from "../../components/Modal/MapPickerModal";

export default {
  name: "UpdateCustomer",
  components: {
    Loading,
    Confirmation,
    MessageModal,
    MapPickerModal,
  },
  data() {
    return {
      config: {
        // Driver time break
        driverBreakHour: "",
        driverBreakMinute: "0",
        // Contract time break
        contractBreakHour: "",
        contractBreakMinute: "0",
        // Max driving time
        maxDrivingHour: "",
        maxDrivingMinute: "0",
        // Min contract start time
        minContractStartHour: "",
        minContractStartMinute: "0",
        // Max contract start time
        maxContractEndHour: "",
        maxContractEndMinute: "0",
        // Max distance support
        maxDistanceSupport: "",
        companyLat: 0,
        companyLng: 0,
      },
      // Error
      driverBreakHourErr: false,
      contractPreBreakHourErr: false,
      contractPostBreakHourErr: false,
      maxDrivingHourErr: false,
      minContractStartHourErr: false,
      maxContractEndHourErr: false,
      maxDistanceSupportErr: false,

      isLoading: false,
      isCustomerLoading: false,
      isUpdatedSuccessfully: false,
      isUpdConVisible: false,
      isMapPickerVisible: false,
      isError: false,
      errMsg: "",
    };
  },
  computed: {
    companyCoordinate() {
      return this.config.companyLat + ", " + this.config.companyLng;
    },
  },
  async mounted() {
    this.isLoading = true;
    await this.initData();
    this.isLoading = false;
  },
  methods: {
    // Init data
    async initData() {
      const db = firebase.firestore();
      const config = db.collection("Config").doc("Contract");
      let seft = this;
      await config.get().then((doc) => {
        seft.config = doc.data();
      });
    },
    isNumber(evt) {
      isNumber(evt);
    },
    // Disable max contract end hour option
    disableMaxContractEndHourOpt(index) {
      return index <= Number(this.config.minContractStartHour);
    },
    // Check
    checkValid() {
      this.driverBreakHourErr = this.config.driverBreakHour.length === 0;
      this.contractPreBreakHourErr =
        this.config.contractPreBreakTime.length === 0;
      this.contractPostBreakHourErr =
        this.config.contractPostBreakTime.length === 0;
      this.maxDrivingHourErr = this.config.maxDrivingHour.length === 0;
      this.maxDistanceSupportErr = this.config.maxDistanceSupport.length === 0;
      this.minContractStartHourErr =
        this.config.minContractStartHour.length === 0;
      this.maxContractEndHourErr = this.config.maxContractEndHour.length === 0;

      return (
        this.driverBreakHourErr ||
        this.contractPreBreakHourErr ||
        this.contractPostBreakHourErr ||
        this.maxDrivingHourErr ||
        this.minContractStartHourErr ||
        this.maxContractEndHourErr ||
        this.maxDistanceSupportErr
      );
    },

    // Get coordinate
    getCompanyCoordinate() {
      let coord = this.$refs.mapPickerModal.changePlace;
      this.config.companyLat = coord.lat;
      this.config.companyLng = coord.lng;
      this.isMapPickerVisible = false;
    },
    async update() {
      this.isLoading = true;
      if (!this.checkValid()) {
        const db = firebase.firestore();
        const config = db.collection("Config").doc("Contract");
        await config
          .set(this.config)
          .then(() => {
            console.log("Document successfully written!");
          })
          .catch((err) => {
            console.error("Error writing document: ", err);
          });
      }

      this.isLoading = false;
    },

    // Cancel
    cancel() {
      this.$refs.customer.initData();
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

.cus-select {
  padding-left: 26px !important;
}
.cus-disable {
  background-color: #858585 !important;
  color: white;
}
.red-require {
  color: red;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

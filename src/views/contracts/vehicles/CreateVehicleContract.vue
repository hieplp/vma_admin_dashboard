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
      <h3 class="page-title">
        <a @click="$router.go(-1)" href="javascript:void(0)">
          Vehicle Detail
        </a>
        <span class="text-secondary">/</span>
        <span>
          Create contract
        </span>
      </h3>
    </div>

    <!-- Error message -->
    <MessageModal
      title="Create Contract Fail!"
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
      title="Create Contract Successfully!"
      icon="check circle"
      :subTitle="`Contract is created successfully.`"
      :proFunc="
        () => {
          this.handleSucess();
        }
      "
      v-if="isSuccess"
    />

    <!-- User Information -->
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <h4 class="ui dividing header">
                VEHICLE CONTRACT INFORMATION
              </h4>
              <div class="three fields">
                <!-- Contributor Share Money -->
                <div class="field">
                  <label>Shared Money</label>
                  <div class="ui corner labeled input">
                    <input
                      v-model="contract.value"
                      type="text"
                      placeholder="Shared Money"
                      @keypress="isNumber($event)"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="isContributorMoneyErr"
                  >
                    Shared money is required!
                  </div>
                </div>
                <!-- Contract Start Date -->
                <div class="field">
                  <label>Start Date</label>
                  <div class="ui corner labeled input">
                    <input
                      v-model="contract.startDate"
                      type="date"
                      :min="maxDate"
                      placeholder="Start Date"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div
                    class="ui pointing red basic label"
                    v-if="isStartDateErr"
                  >
                    Start date is required!
                  </div>
                </div>
                <!-- Contract End Date -->
                <div class="field">
                  <label>End Date</label>
                  <div class="ui corner labeled input">
                    <input
                      v-model="contract.endDate"
                      type="date"
                      :disabled="!contract.startDate"
                      :min="contract.startDate"
                      placeholder="End Date"
                    />
                    <div class="ui corner label">
                      <i class="asterisk icon"></i>
                    </div>
                  </div>
                  <div class="ui pointing red basic label" v-if="isEndDateErr">
                    End date is required!
                  </div>
                </div>
              </div>

              <!-- Button group -->
              <div class="row justify-content-center mt-5">
                <!-- If update user is call -->
                <div class="col-4">
                  <button
                    class="btn btn-gradient-danger btn-fw"
                    type="button"
                    @click="cancel()"
                  >
                    Cancel
                  </button>
                  <button
                    class="btn btn-gradient-info btn-fw ml-2"
                    type="button"
                    v-on:click="create()"
                  >
                    Create
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
import { mapActions } from "vuex";
import Loading from "vue-loading-overlay";
import moment from "moment";
import { isNumber } from "../../../assets/js/input.js";
import MessageModal from "../../../components/Modal/MessageModal";
export default {
  name: "CreateVehicleContract",
  components: {
    Loading,
    MessageModal,
  },
  data() {
    return {
      contract: {
        endDate: "",
        startDate: "",
        value: "",
        vehicleId: this.$route.params.vehicleId,
      },
      // If vehicle belongs to a contributor
      isContributorMoneyErr: false,
      isStartDateErr: false,
      isEndDateErr: false,

      isLoading: false,
      isSuccess: false,
      isError: false,
      errMsg: "",
      // let max date
      maxDate: "",
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  mounted() {
    this.maxDate = moment(new Date()).format("YYYY-MM-DD");
  },
  methods: {
    // Map state
    ...mapActions("Vehicle", ["_insertContract"]),
    // Cancel
    cancel() {
      this.contract = {
        endDate: "",
        startDate: "",
        value: "",
        vehicleId: this.$route.params.vehicleId,
      };
    },
    // Check valid
    check() {
      this.isContributorMoneyErr = this.contract.value.length === 0;
      this.isStartDateErr = this.contract.startDate.length === 0;
      this.isEndDateErr = this.contract.endDate.length === 0;

      return (
        this.isContributorMoneyErr || this.isStartDateErr || this.isEndDateErr
      );
    },
    // Update contract
    async create() {
      this.isLoading = true;
      let isValid = this.check();
      if (!isValid) {
        console.log(this.contract);
        await this._insertContract(this.contract)
          .then((res) => {
            console.log("create -> res", res);
            if (res) {
              console.log(res);
              this.isSuccess = true;
            }
          })
          .catch((ex) => {
            if (ex) {
              this.errMsg = ex.debugMessage;
            }
            this.isError = true;
          });
      }

      this.isLoading = false;
    },
    // Handle success
    handleSucess() {
      this.isSuccess = !this.isSuccess;
      this.$router.go(-1);
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

.cus-select {
  padding-left: 26px !important;
}
.cus-disable {
  background-color: #858585 !important;
  color: white;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

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
  </div>
</template>

<script>
import { isNumber } from "../assets/js/input.js";
import { RepositoryFactory } from "../repositories/RepositoryFactory";
import moment from "moment";

const DriverRepository = RepositoryFactory.get("drivers");

export default {
  components: {},
  data() {
    return {
      driver: {},
      // TODO: DELETE THIS detail
      detail: {
        image:
          "https://nghesiviet.vn/storage/files/7/kieutrinh/hot-girl-kieu-trinh.jpg",
      },
      tempDriver: {},
      userId: "",
      isUpdateVisible: false,
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
  color: #746d6d;
}

.btn {
  font-size: 17px;
}
</style>

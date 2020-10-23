<template>
  <div class="content-wrapper">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <!-- Delete confimation -->
    <div
      class="ui basic cus-modal justify-content-center"
      v-if="isDeleteConVisible"
    >
      <div class="ui icon header col-12">
        <i class="user times icon mb-3"></i>
        Delete Confirmation
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>Do you want to delete vehicle with id {{ this.deleteUserID }}?</h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <button
          type="button"
          class="ui blue primary button"
          @click="handleDialog('isDeleteConVisible', '')"
        >
          <i class="checkmark icon"></i>
          Cancel
        </button>
        <button type="button" class="ui red  button" @click="deleteVehicle()">
          <i class="trash alternate icon"></i>
          Delete
        </button>
      </div>
    </div>
    <!-- Error message -->
    <div class="ui basic cus-modal justify-content-center" v-if="isError">
      <div class="ui icon header col-12">
        <i class="frown outline icon mb-3"></i>
        Delete Vehicle Fail!
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>
          {{ this.errMsg }}
        </h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <button @click="isError = !isError" class="ui blue primary button">
          <i class="checkmark icon"></i>
          Ok
        </button>
      </div>
    </div>

    <!-- Success message -->
    <div class="ui basic cus-modal justify-content-center" v-if="isSuccess">
      <div class="ui icon header col-12">
        <i class="check circle icon mb-3"></i>
        Delete successfully!
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>
          Vehicle with id {{ this.deleteUserID }} is deleted successfully.
        </h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <button
          @click="
            () => {
              isSuccess = !isSuccess;
              this.searchVehicles();
            }
          "
          class="ui blue primary button"
        >
          <i class="checkmark icon"></i>
          Ok
        </button>
      </div>
    </div>

    <div class="page-header">
      <h3 class="page-title">
        <router-link to="/vehicles" class="nav-link">Vehicles</router-link>
      </h3>
      <div class="dropdown">
        <router-link
          to="/create-vehicle"
          class="btn btn-gradient-info btn-icon-text mr-2"
          type="button"
          v-on:click="clickToViewFilter()"
        >
          <i class="mdi mdi-account-plus btn-icon-prepend"></i>
          Create
        </router-link>
        <button
          class="btn btn-gradient-info dropdown-toggle"
          type="button"
          v-on:click="clickToViewFilter()"
        >
          Filter
        </button>
      </div>
    </div>
    <div class="row">
      <!-- Vehicles table -->
      <div
        class="grid-margin stretch-card"
        v-bind:class="{
          'col-lg-12': isTableVisible,
          'col-lg-9': !isTableVisible,
        }"
      >
        <div class="card" v-if="vehiclesList.length > 0">
          <div class="card-body">
            <h4 class="card-title">Vehicle List</h4>
            <p class="card-description">{{ this.totalVehicles }} total</p>
            <table class="table ">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <th>ID</th>
                  <th>MODEL</th>
                  <th>TYPE</th>
                  <th>STATUS</th>
                  <th>TOTAL DISTANCE</th>
                  <th class="text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(vehicle, index) in this.vehiclesList"
                  :key="vehicle.vehicleId"
                >
                  <td class="text-secondary">{{ page * 15 + index + 1 }}</td>
                  <td>{{ vehicle.model }}</td>
                  <td>{{ vehicle.vehicleTypeId }}</td>
                  <td>{{ vehicle.vehicleStatusId }}</td>

                  <td>
                    <!-- <label
                      class="badge"
                      v-bind:class="{
                        'badge-info': vehicle.userStatusName === 'Active',
                        'badge-danger': vehicle.userStatusName === 'Inactive',
                        'badge-warning':
                          vehicle.userStatusName === 'Pending Approval',
                        'badge-dark': vehicle.userStatusName === 'Disabled',
                      }"
                      >{{ vehicle.userStatusName }}</label
                    > -->
                  </td>
                  <td>{{ vehicle.vehicleDistance }}</td>
                  <td class="row justify-content-center btn-action">
                    <!-- <router-link
                      :to="{
                        name: 'VehicleDetail',
                        params: { userId: vehicle.userId },
                      }"
                      >Manage</router-link
                    > -->
                    <button
                      class="btn btn-gradient-info btn-rounded btn-icon mr-1"
                      @click="viewDetail(vehicle.userId)"
                    >
                      <i class="mdi mdi-account-box-outline"></i>
                    </button>
                    <button
                      class="btn btn-gradient-warning btn-rounded btn-icon mr-1"
                      @click="updateVehicle(vehicle.userId)"
                    >
                      <i class="mdi mdi-grease-pencil"></i>
                    </button>
                    <button
                      class="btn btn-gradient-danger btn-rounded btn-icon mr-1"
                      :disabled="vehicle.userStatusName === 'Disabled'"
                      @click="handleDialog('isDeleteConVisible', vehicle.userId)"
                    >
                      <i class="mdi mdi-delete-forever"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="this.totalVehicles > 15">
            <paginate
              v-model="currentPage"
              :page-count="Math.floor(this.totalVehicles / 15) + 1"
              :page-range="3"
              :margin-pages="1"
              :click-handler="clickCallback"
              :first-last-button="true"
              :prev-text="'Prev'"
              :next-text="'Next'"
              :container-class="'pagination'"
              :page-class="'page-item'"
              :next-class="'page-item'"
              :prev-class="'page-item'"
              :active-class="'page-active'"
            >
            </paginate>
          </div>
        </div>
        <!-- Empty list -->
        <div class="card empty-list" v-else-if="!isLoading">
          <i class="mdi mdi-account-off"></i>
          <h1>NOTHING</h1>
          <h3>Your list is empty.</h3>
        </div>
      </div>

      <!-- Filter -->
      <transition name="slide-fade">
        <div class="col-3 card filter" v-if="isFilterVisible">
          <div class="form-group">
            <h4 class="card-title mt-4">Filter</h4>
            <div class="col-sm-12">
              <!-- Search Vehicle ID -->
              <label>Vehicle ID</label>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Vehicle ID"
                v-model="searchVehicleID"
                @keypress="isNumber($event)"
                maxlength="12"
              />
            </div>
            <div class="col-12 mt-3">
              <label>Vehicle Name</label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="searchVehicleName"
                placeholder="Vehicle name"
              />
            </div>
            <!-- Phone number dropdown-->
            <div class="col-12 mt-3">
              <label>Phone Number</label>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Phone Number"
                v-model="searchPhoneNumber"
                @keypress="isNumber($event)"
                maxlength="10"
              />
            </div>
            <!-- Vehicle status dropdown -->
            <div class="col-12 mt-3">
              <label>Status</label>
              <select
                class="form-control form-control-sm"
                name="status"
                v-model="searchStatusID"
              >
                <option
                  v-for="status in this.statusList"
                  :key="status.userStatusId"
                  :value="status.userStatusId"
                  >{{ status.userStatusName }}</option
                >
              </select>
            </div>

            <br />
            <div class="col-12 mt-3">
              <button
                class="btn btn-outline-info w-100"
                type="button"
                v-on:click="searchVehicles()"
              >
                Filter
              </button>
            </div>
            <div class="col-12 mt-2">
              <button
                class="btn btn-outline-danger w-100"
                type="button"
                v-on:click="clearSearchValue()"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { isNumber } from "../assets/js/input.js";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { RepositoryFactory } from "../repositories/RepositoryFactory";

const VehicleRepository = RepositoryFactory.get("vehicles");
const UserStatusRepository = RepositoryFactory.get("userStatus");

export default {
  name: "Vehicles",
  props: {},
  components: {
    Loading,
  },
  data() {
    return {
      isFilterVisible: false,
      isTableVisible: true,
      statusList: [],
      vehiclesList: [],
      searchPhoneNumber: "",
      searchVehicleID: "",
      searchVehicleName: "",
      searchStatusID: "",
      isLoading: true,
      totalVehicles: 0,
      page: 0,
      currentPage: 1,
      isDeleteConVisible: false,
      isError: false,
      isSuccess: false,
      errMsg: "",
      deleteUserID: "",

      model: "",
      ownerId: "",
      vehicleId: "",
      vehicleMinDis: "",
      vehicleMaxDis: "",
      vehicleStatus: "",
      vehicleType: "",
      viewOption: 0,
    };
  },
  async mounted() {
    // await this.initStatusList();
    await this.initVehiclesList();
  },
  methods: {
    isNumber(evt) {
      isNumber(evt);
    },
    // pagination handle
    async clickCallback(page) {
      this.isLoading = true;
      this.currentPage = page;
      this.page = page - 1;
      this.initVehiclesList();
      this.isLoading = false;
    },
    // Init data for Vehicle Status Dropdown
    async initStatusList() {
      // wait for api
      this.statusList = await UserStatusRepository.get();
      this.statusList.push({
        userStatusId: "",
        userStatusName: "None",
      });
    },
    // Clear search item value
    clearSearchValue() {
      this.searchVehicleID = "";
      this.searchVehicleName = "";
      this.searchPhoneNumber = "";
      this.searchStatusID = "";
    },
    // Search vehicle
    async searchVehicles() {
      this.isLoading = true;
      this.page = 0;
      this.currentPage = 1;
      await this.initVehiclesList();
    },
    // Init data for vehicle list
    async initVehiclesList() {
      this.vehiclesList = await VehicleRepository.get(
        this.page,
        this.model,
        this.ownerId,
        this.vehicleId,
        this.vehicleMinDis,
        this.vehicleMaxDis,
        this.vehicleStatus,
        this.vehicleType,
        this.viewOption
      );
      this.totalVehicles = await VehicleRepository.getTotalVehicle(
        this.model,
        this.ownerId,
        this.vehicleId,
        this.vehicleMinDis,
        this.vehicleMaxDis,
        this.vehicleStatus,
        this.vehicleType,
        this.viewOption
      );
      this.isLoading = false;
    },
    // Set filter to visible
    clickToViewFilter() {
      if (this.isFilterVisible && !this.isTableVisible) {
        this.isFilterVisible = !this.isFilterVisible;
        setTimeout(() => {
          this.isTableVisible = !this.isTableVisible;
        }, 300);
      } else if (!this.isFilterVisible && this.isTableVisible) {
        this.isTableVisible = !this.isTableVisible;
        setTimeout(() => {
          this.isFilterVisible = !this.isFilterVisible;
        }, 300);
      }
    },
    // View vehicle detail
    viewDetail(userId) {
      this.$router.push({
        name: "VehicleDetail",
        params: { userId: userId },
      });
    },
    // View vehicle detail
    updateVehicle(userId) {
      this.$router.push({
        name: "UpdateVehicle",
        params: { userId: userId },
      });
    },
    // Delete vehicle
    async deleteVehicle() {
      this.handleDialog("isDeleteConVisible", "");
      this.isLoading = true;
      await VehicleRepository.delete(this.deleteUserID)
        .then((res) => {
          if (res) {
            this.isSuccess = true;
          }
        })
        .catch((err) => {
          this.isError = !this.isError;
          this.errMsg = err.message;
          console.log(err);
        });
      this.isLoading = false;
    },
    // Close delete vehicle confimation dialog
    handleDialog(dialogName, userId) {
      if (userId.length !== 0) {
        this.deleteUserID = userId;
      }
      this.$data[dialogName] = !this.$data[dialogName];
    },
  },
};
</script>
<style>
.filter {
  max-height: 450px !important;
}
.label {
  font-size: 13px;
}
.form-control {
  font-size: 13px;
}
.btn-action .btn i {
  font-size: 20px;
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
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

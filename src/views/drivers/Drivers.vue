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
    <Confirmation
      icon="user times"
      title="Delete Confirmation"
      subTitle="Do you want to delete this driver?"
      rightBtnTitle="Delete"
      rightBtnIcon="trash alternate"
      rightBtnColor="red"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="blue"
      v-if="isDeleteConVisible"
      :handleLeftBtn="
        () => {
          this.isDeleteConVisible = !this.isDeleteConVisible;
        }
      "
      :handleRightBtn="deleteDriver"
    />
    <!-- Error message -->
    <MessageModal
      title="Delete Driver Fail!"
      icon="frown outline "
      :subTitle="errMsg"
      :proFunc="handleErrorModal"
      v-if="isError"
    />
    <!-- Success message -->
    <MessageModal
      title="Delete Driver Successfully!"
      icon="check circle"
      :subTitle="`Driver with id ${this.deleteUserID} is deleted successfully.`"
      :proFunc="handleSuccessModal"
      v-if="isSuccess"
    />

    <div class="page-header">
      <h3 class="page-title">
        <router-link to="/drivers" class="nav-link">Drivers</router-link>
      </h3>
      <div class="dropdown">
        <!-- Create new driver -->
        <button
          class="btn btn-gradient-info btn-icon-text mr-2 dropdown-toggle"
          type="button"
          data-toggle="dropdown"
        >
          <i class="mdi mdi-account-plus btn-icon-prepend"></i>
          Create
        </button>
        <ul class="dropdown-menu ">
          <button
            @click="
              () => {
                this.$router.push({
                  name: 'CreateDriver',
                });
              }
            "
            class="mb-1"
          >
            New
          </button>
          <li class="divider"></li>
          <button class="mt-1" @click="viewPromoteContributor">
            From contributor
          </button>
        </ul>
        <!-- Filter group -->
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
      <!-- Drivers table -->
      <div
        class="grid-margin stretch-card"
        v-bind:class="{
          'col-lg-12': isTableVisible,
          'col-lg-9': !isTableVisible,
        }"
      >
        <div class="card" v-if="drivers.length > 0">
          <div class="card-body">
            <h4 class="card-title">Driver List</h4>
            <p class="card-description">{{ this.totalDrivers }} total</p>
            <table class="table ">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <!-- <th>ID</th> -->
                  <th>NAME</th>
                  <th>PHONE NUMBER</th>
                  <th>VEHICLE ID</th>
                  <th>STATUS</th>
                  <th class="text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(driver, index) in this.drivers"
                  :key="driver.userId"
                >
                  <td class="text-secondary">{{ page * 15 + index + 1 }}</td>
                  <!-- <td>{{ driver.userId }}</td> -->
                  <td>{{ driver.fullName }}</td>
                  <td>{{ driver.phoneNumber }}</td>
                  <td>
                    <p v-if="driver.vehicleId">
                      {{ driver.vehicleId }}
                    </p>
                    <p v-else>N/A</p>
                  </td>
                  <td>
                    <label
                      class="badge"
                      v-bind:class="{
                        'badge-info': driver.userStatus === 'ACTIVE',
                        'badge-danger': driver.userStatus === 'INACTIVE',
                        'badge-dark': driver.userStatus === 'DISABLE',
                      }"
                    >
                      {{ driver.userStatus }}
                    </label>
                  </td>
                  <td class="row justify-content-center btn-action">
                    <button
                      class="btn btn-gradient-info btn-rounded btn-icon mr-1"
                      @click="viewDetail(driver.userId)"
                    >
                      <i class="mdi mdi-account-box-outline"></i>
                    </button>
                    <button
                      class="btn btn-gradient-warning btn-rounded btn-icon mr-1"
                      :disabled="driver.userStatus === 'DISABLE'"
                      @click="updateDriver(driver.userId)"
                    >
                      <i class="mdi mdi-grease-pencil"></i>
                    </button>
                    <button
                      class="btn btn-gradient-danger btn-rounded btn-icon mr-1"
                      :disabled="driver.userStatus === 'DISABLE'"
                      @click="handleDialog('isDeleteConVisible', driver.userId)"
                    >
                      <i class="mdi mdi-delete-forever"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="this.totalDrivers > 15">
            <paginate
              v-model="currentPage"
              :page-count="Math.floor(this.totalDrivers / 15) + 1"
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
            <!-- Search Driver ID -->
            <!-- 
            <div class="col-sm-12">
              <label>Driver ID</label>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Driver ID"
                v-model="searchDriverID"
                @keypress="isNumber($event)"
                maxlength="12"
              />
            </div> -->
            <div class="col-12 mt-4">
              <label>Driver Name</label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="searchDriverName"
                placeholder="Driver name"
              />
            </div>
            <!-- Phone number dropdown-->
            <div class="col-12 mt-4">
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
            <!-- Driver status dropdown -->
            <div class="col-12 mt-4">
              <label>Status</label>
              <select
                class="form-control form-control-sm"
                name="status"
                v-model="searchStatusID"
              >
                <option value="" selected>NONE</option>
                <option
                  v-for="status in this.statusList"
                  :key="status"
                  :value="status"
                  >{{ status }}</option
                >
              </select>
            </div>

            <br />
            <div class="col-12 mt-4">
              <button
                class="btn btn-outline-info w-100"
                type="button"
                v-on:click="searchDrivers()"
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
import { mapState, mapActions } from "vuex";
import { isNumber } from "../../assets/js/input.js";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import Confirmation from "../../components/Modal/Confirmation";
import MessageModal from "../../components/Modal/MessageModal";

export default {
  name: "Drivers",
  props: {},
  components: {
    Loading,
    Confirmation,
    MessageModal,
  },
  computed: {
    // Map state
    ...mapState("Driver", ["drivers", "totalDrivers"]),
  },
  data() {
    return {
      isFilterVisible: false,
      isTableVisible: true,
      statusList: [],
      // Filter
      searchPhoneNumber: "",
      searchDriverID: "",
      searchDriverName: "",
      searchStatusID: "",
      isLoading: true,
      // Pagination
      page: 0,
      currentPage: 1,
      // Delete
      isDeleteConVisible: false,
      // Error and success modal
      isError: false,
      isSuccess: false,
      errMsg: "",
      deleteUserID: "",
    };
  },
  async mounted() {
    // await this.initStatusList();
    if (this.$route.params.status) {
      this.searchStatusID = this.$route.params.status;
    }
    await this.initDriversList();
  },
  methods: {
    // Map actions
    ...mapActions("Driver", ["_getDrivers", "_getTotalDriversCount"]),
    ...mapActions("User", ["_delete"]),

    // pagination handle
    async clickCallback(pageNum) {
      this.currentPage = pageNum;
      this.page = pageNum - 1;
      this.initDriversList();
    },
    // Init data for driver Status Dropdown
    async initStatusList() {
      this.statusList = require("../../assets/json/user/driverStatus.json");
    },
    // Clear search item value
    clearSearchValue() {
      this.searchDriverID = "";
      this.searchDriverName = "";
      this.searchPhoneNumber = "";
      this.searchStatusID = "";
    },
    // Search driver
    async searchDrivers() {
      this.page = 0;
      this.currentPage = 1;
      await this.initDriversList();
    },
    // Init data for driver list
    async initDriversList() {
      this.isLoading = true;
      await this._getDrivers({
        page: this.page,
        name: this.searchDriverName,
        phoneNumber: this.searchPhoneNumber,
        userStatus: this.searchStatusID,
        userId: this.searchDriverID,
        viewOption: 1,
      });
      await this._getTotalDriversCount({
        name: this.searchDriverName,
        phoneNumber: this.searchPhoneNumber,
        userStatus: this.searchStatusID,
        userId: this.searchDriverID,
        viewOption: 1,
      });
      this.isLoading = false;
    },
    // Delete driver
    async deleteDriver() {
      this.handleDialog("isDeleteConVisible", "");
      this.isLoading = true;
      await this._delete(this.deleteUserID)
        .then((res) => {
          if (res) {
            this.isSuccess = true;
          }
        })
        .catch((err) => {
          this.isError = !this.isError;
          this.errMsg = err.debugMessage;
        });
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
    // go to promote user lis
    viewPromoteContributor() {
      this.$router.push({
        name: "PromoteDrivers",
        params: { roleId: "2" },
      });
    },
    // View driver detail
    viewDetail(userId) {
      this.$router.push({
        name: "DriverDetail",
        params: { userId: userId },
      });
    },
    // View driver detail
    updateDriver(userId) {
      this.$router.push({
        name: "UpdateDriver",
        params: { userId: userId },
      });
    },
    isNumber(evt) {
      isNumber(evt);
    },
    // Close Error Modal
    handleErrorModal() {
      this.isError = !this.isError;
    },
    // Close Error Modal
    handleSuccessModal() {
      this.isSuccess = !this.isSuccess;
      this.searchDrivers();
    },
    // Close delete driver confimation dialog
    handleDialog(dialogName, userId) {
      if (userId.length !== 0) {
        this.deleteUserID = userId;
      }
      this.$data[dialogName] = !this.$data[dialogName];
    },
  },
};
</script>
<style scoped>
.filter {
  max-height: 420px !important;
}
.label {
  font-size: 13px;
}
.form-control {
  font-size: 13px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

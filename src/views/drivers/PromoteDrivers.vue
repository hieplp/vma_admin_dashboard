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
      icon="angle double up"
      title="Add Role Confirmation"
      :subTitle="`Do you want to add ${this.roleName} role for this user?`"
      rightBtnTitle="Add"
      rightBtnIcon="angle double up"
      rightBtnColor="blue"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="red"
      v-if="isDeleteConVisible"
      :handleLeftBtn="
        () => {
          this.isDeleteConVisible = !this.isDeleteConVisible;
        }
      "
      :handleRightBtn="addNewRoleForUser"
    />
    <!-- Error message -->
    <MessageModal
      title="Add Role Fail!"
      icon="frown outline "
      :subTitle="errMsg"
      :proFunc="handleErrorModal"
      v-if="isError"
    />
    <!-- Success message -->
    <MessageModal
      title="Add Role Successfully!"
      icon="check circle"
      :subTitle="
        `The ${this.roleName} role is added to user with id ${this.deleteUserID} successfully!`
      "
      :proFunc="handleSuccessModal"
      v-if="isSuccess"
    />

    <div class="page-header">
      <h3 class="page-title">
        <a class="nav-link">{{ this.userRole }}</a>
      </h3>
      <div class="dropdown">
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
        <div class="card" v-if="users.length > 0">
          <div class="card-body">
            <h4 class="card-title">{{ this.userRole }} List</h4>
            <p class="card-description">{{ this.usersCount }} total</p>
            <table class="table ">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <!-- <th>ID</th> -->
                  <th>NAME</th>
                  <th>PHONE NUMBER</th>
                  <!-- <th>VEHICLE ID</th> -->
                  <th>STATUS</th>
                  <th class="text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in this.users" :key="user.userId">
                  <td class="text-secondary">{{ page * 15 + index + 1 }}</td>
                  <!-- <td>{{ user.userId }}</td> -->
                  <td>{{ user.fullName }}</td>
                  <td>{{ user.phoneNumber }}</td>
                  <!-- <td>
                    <p v-if="user.vehicleId">
                      {{ user.vehicleId }}
                    </p>
                    <p v-else>N/A</p>
                  </td> -->
                  <td>
                    <label
                      class="badge"
                      v-bind:class="{
                        'badge-info': user.userStatus === 'ACTIVE',
                        'badge-danger': user.userStatus === 'INACTIVE',
                        'badge-dark': user.userStatus === 'DISABLE',
                      }"
                    >
                      {{ user.userStatus }}
                    </label>
                  </td>
                  <td class="row justify-content-center btn-action">
                    <button
                      class="btn btn-gradient-info btn-rounded btn-icon mr-1"
                      @click="viewDetail(user.userId)"
                    >
                      <i class="mdi mdi-account-box-outline"></i>
                    </button>
                    <button
                      class="btn btn-gradient-success btn-rounded btn-icon mr-1"
                      @click="handleDialog('isDeleteConVisible', user.userId)"
                    >
                      <i class="mdi mdi-chevron-double-up"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="this.usersCount > 15">
            <paginate
              v-model="currentPage"
              :page-count="Math.floor(this.usersCount / 15) + 1"
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
    ...mapState("User", ["users", "usersCount"]),
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
      page: 0,
      currentPage: 1,
      isDeleteConVisible: false,
      isError: false,
      isSuccess: false,
      errMsg: "",
      deleteUserID: "",
      // Default role id is user
      roleId: this.$route.params.roleId,
      promoteRole: "",
      // Message
      roleName: "",
      userRole: "",
    };
  },
  async mounted() {
    // console.log(this.$route.params.roleId);
    this.initRole();
    await this.initStatusList();
    await this.initUsers();
  },
  methods: {
    // Map actions
    ...mapActions("User", [
      "_getUsersCountByRole",
      "_getUsersByRole",
      "_addNewRoleForUser",
    ]),

    // pagination handle
    async clickCallback(pageNum) {
      this.currentPage = pageNum;
      this.page = pageNum - 1;
      this.initUsers();
    },
    // Init role
    initRole() {
      switch (this.roleId) {
        case "2":
          this.roleName = "user";
          this.userRole = "Contributor";
          this.promoteRole = "3";
          break;
        case "3":
          this.roleName = "contributor";
          this.userRole = "Driver";
          this.promoteRole = "2";
          break;
      }
    },
    // Init data for Driver Status Dropdown
    async initStatusList() {
      this.statusList = ["ACTIVE", "INACTIVE"];
    },
    // Clear search item value
    clearSearchValue() {
      this.searchDriverID = "";
      this.searchDriverName = "";
      this.searchPhoneNumber = "";
      this.searchStatusID = "";
    },
    // Search user
    async searchDrivers() {
      this.page = 0;
      this.currentPage = 1;
      await this.initUsers();
    },
    // Init data for user list
    async initUsers() {
      this.isLoading = true;

      await this._getUsersByRole({
        page: this.page,
        name: this.searchDriverName,
        phoneNumber: this.searchPhoneNumber,
        userStatus: this.searchStatusID,
        userId: this.searchDriverID,
        roleId: this.roleId,
      });

      await this._getUsersCountByRole({
        name: this.searchDriverName,
        phoneNumber: this.searchPhoneNumber,
        userStatus: this.searchStatusID,
        userId: this.searchDriverID,
        roleId: this.roleId,
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
    // View user detail
    viewDetail(userId) {
      switch (this.roleId) {
        case "2":
          this.$router.push({
            name: "ContributorDetail",
            params: { userId: userId },
          });
          break;
        case "3":
          this.$router.push({
            name: "DriverDetail",
            params: { userId: userId },
          });
          break;
      }
    },
    // View user detail
    updateDriver(userId) {
      this.$router.push({
        name: "UpdateDriver",
        params: { userId: userId },
      });
    },
    isNumber(evt) {
      isNumber(evt);
    },
    // add new role user
    async addNewRoleForUser() {
      this.handleDialog("isDeleteConVisible", "");
      this.isLoading = true;
      this._addNewRoleForUser({
        userId: this.deleteUserID,
        roleId: this.promoteRole,
      })
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
    // Close Error Modal
    handleErrorModal() {
      this.isError = !this.isError;
    },
    // Close Error Modal
    handleSuccessModal() {
      this.isSuccess = !this.isSuccess;
      this.searchDrivers();
    },
    // Close delete user confimation dialog
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
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

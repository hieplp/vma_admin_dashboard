<template>
  <div class="content-wrapper">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <div class="page-header">
      <h3 class="page-title">
        <router-link to="/contributors" class="nav-link"
          >Contributors</router-link
        >
      </h3>
      <div class="dropdown">
        <router-link
          to="/create-contributor"
          class="btn btn-gradient-info btn-icon-text mr-2"
          type="button"
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

    <!-- Delete confimation -->
    <Confirmation
      icon="user times"
      title="Delete Confirmation"
      subTitle="Do you want to delete this customer?"
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
      :handleRightBtn="deleteContributor"
    />

    <!-- Error message -->
    <div class="ui basic cus-modal justify-content-center" v-if="isError">
      <div class="ui icon header col-12">
        <i class="frown outline icon mb-3"></i>
        Delete Customer Fail!
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
          Contributor with id {{ this.deleteUserID }} is deleted successfully.
        </h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <button
          @click="
            () => {
              isSuccess = !isSuccess;
              this.searchContributors();
            }
          "
          class="ui blue primary button"
        >
          <i class="checkmark icon"></i>
          Ok
        </button>
      </div>
    </div>

    <div class="row">
      <!-- Contributors table -->
      <div
        class="grid-margin stretch-card"
        v-bind:class="{
          'col-lg-12': isTableVisible,
          'col-lg-9': !isTableVisible,
        }"
      >
        <div class="card" v-if="contributorsList.length > 0">
          <div class="card-body">
            <h4 class="card-title">Contributor List</h4>
            <p class="card-description">{{ this.totalContributors }} total</p>
            <table class="table ">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <!-- <th>ID</th> -->
                  <th>NAME</th>
                  <th>PHONE NUMBER</th>
                  <th>TOTAL VEHICLES</th>
                  <th>STATUS</th>
                  <th class="text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(contributor, index) in this.contributorsList"
                  :key="contributor.userId"
                >
                  <td class="text-secondary">{{ page * 15 + index + 1 }}</td>
                  <!-- <td>{{ contributor.userId }}</td> -->
                  <td>{{ contributor.fullName }}</td>
                  <td>{{ contributor.phoneNumber }}</td>
                  <td>
                    <p v-if="contributor.totalVehicles">
                      {{ contributor.totalVehicles }}
                    </p>
                    <p v-else>N/A</p>
                  </td>
                  <td>
                    <label
                      class="badge"
                      v-bind:class="{
                        'badge-info': contributor.userStatus === 'ACTIVE',
                        'badge-danger': contributor.userStatus === 'INACTIVE',
                        'badge-dark': contributor.userStatus === 'DISABLE',
                      }"
                    >
                      {{ contributor.userStatus }}
                    </label>
                  </td>
                  <td class="row justify-content-center btn-action">
                    <button
                      class="btn btn-gradient-info btn-rounded btn-icon mr-1"
                      @click="viewDetail(contributor.userId)"
                    >
                      <i class="mdi mdi-account-box-outline"></i>
                    </button>
                    <button
                      class="btn btn-gradient-warning btn-rounded btn-icon mr-1"
                      @click="updateContributor(contributor.userId)"
                    >
                      <i class="mdi mdi-grease-pencil"></i>
                    </button>
                    <button
                      class="btn btn-gradient-danger btn-rounded btn-icon mr-1"
                      :disabled="contributor.userStatus === 'DISABLE'"
                      @click="
                        handleDialog('isDeleteConVisible', contributor.userId)
                      "
                    >
                      <i class="mdi mdi-delete-forever"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="this.totalContributors > 15">
            <paginate
              v-model="currentPage"
              :page-count="Math.floor(this.totalContributors / 15) + 1"
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
            <!-- Search Contributor ID -->
            <!-- <div class="col-sm-12">
              <label>Contributor ID</label>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Contributor ID"
                v-model="searchContributorID"
                @keypress="isNumber($event)"
                maxlength="12"
              />
            </div> -->
            <div class="col-12 mt-4">
              <label>Contributor Name</label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="searchContributorName"
                placeholder="Contributor name"
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
                maxlength="11"
              />
            </div>
            <!-- Total vehicles-->
            <div class="col-12 mt-4">
              <label>Total Vehicles</label>
              <div class="row">
                <div class="col-5">
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    @keypress="isNumber($event)"
                    v-model="searchTotalVehicles[0]"
                  />
                </div>
                <div class="col-2">
                  <h1>-</h1>
                </div>
                <div class="col-5">
                  <input
                    type="text"
                    @keypress="isNumber($event)"
                    class="form-control form-control-sm"
                    v-model="searchTotalVehicles[1]"
                  />
                </div>
              </div>
              <!-- <vue-slider
                :min="minTotalVehicles"
                :max="maxTotalVehicles"
                v-model="searchTotalVehicles"
              /> -->
            </div>
            <!-- Contributor status dropdown -->
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
            <div class="col-12 mt-4">
              <button
                class="btn btn-outline-info w-100"
                type="button"
                v-on:click="searchContributors()"
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
import { isNumber } from "../../assets/js/input.js";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { RepositoryFactory } from "../../repositories/RepositoryFactory";
// import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";
import Confirmation from "../../components/Modal/Confirmation";

const ContributorRepository = RepositoryFactory.get("contributors");
const UserRepository = RepositoryFactory.get("users");
// const UserStatusRepository = RepositoryFactory.get("userStatus");

export default {
  name: "Contributors",
  props: {},
  components: {
    Loading,
    // VueSlider,
    Confirmation,
  },
  data() {
    return {
      isFilterVisible: false,
      isDeleteConVisible: false,
      isError: false,
      isSuccess: false,
      isTableVisible: true,
      statusList: [],
      contributorsList: [],
      searchPhoneNumber: "",
      searchContributorID: "",
      searchContributorName: "",
      searchTotalVehicles: ["", ""],
      searchStatusID: "",
      minTotalVehicles: 0,
      maxTotalVehicles: 0,
      isLoading: true,
      totalContributors: 0,
      page: 0,
      currentPage: 1,
    };
  },
  async mounted() {
    // await this.initTotalVehicleSlider();
    await this.initStatusList();
    await this.initContributorsList();
  },
  methods: {
    isNumber(evt) {
      isNumber(evt);
    },
    // pagination handle
    async clickCallback(pageNum) {
      this.isLoading = true;
      this.currentPage = pageNum;
      this.page = pageNum - 1;
      this.contributorsList = await ContributorRepository.get(
        this.page,
        this.searchContributorName,
        this.searchPhoneNumber,
        this.searchStatusID,
        this.searchContributorID,
        this.searchTotalVehicles
      );
      this.isLoading = false;
    },
    // Init data for Contributor Status Dropdown
    async initStatusList() {
      this.statusList = require("../../assets/json/user/driverStatus.json");
    },
    // Clear search item value
    clearSearchValue() {
      this.searchContributorID = "";
      this.searchContributorName = "";
      this.searchPhoneNumber = "";
      this.searchStatusID = "";
      this.searchTotalVehicles = ["", ""];
    },
    // Search contributor
    async searchContributors() {
      this.isLoading = true;
      this.page = 0;

      if (
        this.searchTotalVehicles[0].length > 0 &&
        this.searchTotalVehicles[1].length > 0 &&
        this.searchTotalVehicles[0] > this.searchTotalVehicles[1]
      ) {
        let temp = this.searchTotalVehicles[1];
        this.searchTotalVehicles[1] = this.searchTotalVehicles[0];
        this.searchTotalVehicles[0] = temp;
      }

      await this.initContributorsList();

      this.isLoading = false;
    },
    // Init data for contributor list
    async initContributorsList() {
      this.contributorsList = await ContributorRepository.get(
        this.page,
        this.searchContributorName,
        this.searchPhoneNumber,
        this.searchStatusID,
        this.searchContributorID,
        this.searchTotalVehicles
      );

      this.totalContributors = await ContributorRepository.getTotalContributor(
        this.searchContributorName,
        this.searchPhoneNumber,
        this.searchStatusID,
        this.searchContributorID,
        this.searchTotalVehicles
      );

      this.isLoading = false;
    },
    // View contributor detail
    viewDetail(userId) {
      this.$router.push({
        name: "ContributorDetail",
        params: { userId: userId },
      });
    },
    // View contributor detail
    updateContributor(userId) {
      this.$router.push({
        name: "UpdateContributor",
        params: { userId: userId },
      });
    },
    // Delete customer
    async deleteContributor() {
      this.handleDialog("isDeleteConVisible", "");
      this.isLoading = true;
      await UserRepository.delete(this.deleteUserID)
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
    // Close delete customer confimation dialog
    handleDialog(dialogName, userId) {
      if (userId.length !== 0) {
        this.deleteUserID = userId;
      }
      this.$data[dialogName] = !this.$data[dialogName];
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
  },
};
</script>
<style>
.filter {
  min-height: 550px !important;
}
.btn-action .btn i {
  font-size: 20px;
}
.label {
  font-size: 13px;
}
</style>

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
        <router-link :to="`/vehicles/${vehicleId}`">Vehicle Detail</router-link>
        <span class="text-secondary">/</span>
        <span>
          Drivers History
        </span>
      </h3>
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
        <div class="card" v-if="assignedDrivers.length > 0">
          <div class="card-body">
            <h4 class="card-title">Driver List</h4>
            <table class="table ">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <!-- <th>ID</th> -->
                  <th>ID</th>
                  <th>NAME</th>
                  <th>ISSUED DATE</th>
                  <th>RETURNED DATE</th>
                  <th class="text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(driver, index) in this.assignedDrivers"
                  :key="driver.userId"
                >
                  <td class="text-secondary">{{ page * 15 + index + 1 }}</td>
                  <!-- <td>{{ driver.userId }}</td> -->
                  <td>{{ driver.driver.userId }}</td>
                  <td>{{ driver.driver.userName }}</td>
                  <td>{{ driver.issuedDate }}</td>
                  <td>
                    <label
                      class="badge"
                      v-bind:class="{
                        'badge-info': driver.returnedDate === null,
                      }"
                    >
                      {{ driver.returnedDate ? driver.returnedDate : "ACTIVE" }}
                    </label>
                  </td>

                  <td class="row justify-content-center btn-action">
                    <button
                      class="btn btn-gradient-info btn-rounded btn-icon mr-1"
                      @click="viewDetail(driver.driver.userId)"
                    >
                      <i class="mdi mdi-account-box-outline"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Empty list -->
        <div class="card empty-list" v-else-if="!isLoading">
          <i class="mdi mdi-account-off"></i>
          <h1>NOTHING</h1>
          <h3>Your list is empty.</h3>
        </div>
      </div>
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
    ...mapState("Vehicle", ["assignedDrivers"]),
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

      vehicleId: this.$route.params.vehicleId,
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
    ...mapActions("Vehicle", ["_getDriverHistoryByVehicleId"]),
    // Init data for driver list
    async initDriversList() {
      this.isLoading = true;
      await this._getDriverHistoryByVehicleId(this.vehicleId);
      this.isLoading = false;
    },

    // View driver detail
    viewDetail(userId) {
      this.$router.push({
        name: "DriverDetail",
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

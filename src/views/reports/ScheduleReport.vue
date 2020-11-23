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
        <router-link to="/drivers" class="nav-link"
          >Schedule Report</router-link
        >
      </h3>
      <div class="dropdown">
        <!-- Download report -->
        <a
          :href="`${baseUrl}?quarter=${this.quarter}&year=${this.year}`"
          class="btn btn-gradient-info btn-icon-text mr-2"
          type="button"
        >
          <i class="mdi mdi-download btn-icon-prepend"></i>
          Download
        </a>

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
        <div class="card">
          <div class="card-body">
            <!-- <h4 class="card-title">Driver List</h4> -->
            <!-- <input type="file" id="input" @change="previewFiles($event)" /> -->
            <vue-excel-editor
              width="100%"
              v-model="schedulesData"
              remember
              readonly
              no-header-edit
            >
              <vue-excel-column field="contractId" label="ID" />
              <vue-excel-column field="date" label="Date" />
              <vue-excel-column
                field="departureLocation"
                label="Departure Location"
              />
              <vue-excel-column
                field="destinationLocation"
                label="Destination Location"
              />
              <vue-excel-column field="contractValue" label="Contract Value" />
              <vue-excel-column
                field="contractStatus"
                label="Contract Status"
              />
            </vue-excel-editor>
          </div>
        </div>
      </div>

      <!-- Filter -->
      <transition name="slide-fade">
        <div class="col-3 card filter" v-if="isFilterVisible">
          <div class="form-group">
            <h4 class="card-title mt-4">Filter</h4>
            <div class="col-12 mt-4">
              <label>Year</label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="year"
                placeholder="Year"
              />
            </div>

            <!-- Quarter -->
            <div class="col-12 mt-4">
              <label>Quarter</label>
              <select
                class="form-control form-control-sm"
                name="status"
                v-model="quarter"
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
                v-on:click="intiScheduleData()"
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
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import Confirmation from "../../components/Modal/Confirmation";
import MessageModal from "../../components/Modal/MessageModal";
import CONSTANT from "../../constant";

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
      isLoading: false,
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
      // Report
      schedulesData: [],
      quarter: "",
      year: "",

      vehicleId: "",
      baseUrl: `${CONSTANT.BASE_URL}/reports/schedule`,
    };
  },
  async mounted() {
    this.initStatusList();
    await this.intiScheduleData();
  },
  methods: {
    // Map actions
    ...mapActions("Report", ["_getScheduleReport"]),
    // Init schedule data
    async intiScheduleData() {
      this.isLoading = true;
      await this._getScheduleReport({
        quarter: this.quarter,
        year: this.year,
      }).then((res) => {
        this.schedulesData = res;
      });
      this.isLoading = false;
    },
    // Init data for driver Status Dropdown
    initStatusList() {
      this.statusList = ["FIRST", "SECOND", "THIRD", "FOURTH"];
    },
    // Clear search item value
    clearSearchValue() {
      this.quarter = "";
      this.year = "";
    },
    // Get excel file

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

.vue-excel-editor {
  width: 100% !important;
}
.vue-excel-editor .component-content {
  width: 100% !important;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<template>
  <div class="content-wrapper">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <!-- Error message -->
    <MessageModal
      title="Delete Driver Fail!"
      icon="frown outline "
      :subTitle="errMsg"
      :proFunc="handleErrorModal"
      v-if="isError"
    />

    <div class="page-header">
      <h3 class="page-title">
        <router-link to="/drivers" class="nav-link"
          >Vehicles Report</router-link
        >
      </h3>
      <div class="dropdown">
        <!-- Create new driver -->
        <a
          :href="`${baseUrl}`"
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
              v-model="vehiclesData"
              remember
              readonly
            >
              <vue-excel-column field="vehicleId" label="ID" />
              <vue-excel-column field="vehicleType" label="Type" />
              <vue-excel-column field="brand" label="Brand" />
              <vue-excel-column field="ownerId" label="Owner Id" />
              <vue-excel-column field="ownerName" label="Owner Name" />
            </vue-excel-editor>
          </div>
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
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import MessageModal from "../../components/Modal/MessageModal";
import CONSTANT from "../../constant";

export default {
  name: "Drivers",
  props: {},
  components: {
    Loading,
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
      isLoading: true,
      statusList: [],
      // Error and success modal
      isError: false,
      isSuccess: false,
      errMsg: "",
      deleteUserID: "",
      //
      vehiclesData: [],

      quarter: "",
      vehicleId: "",
      year: "",
      baseUrl: `${CONSTANT.BASE_URL}/reports/vehicles`,
    };
  },
  async mounted() {
    await this.intiVehicleData();
  },
  methods: {
    // Map actions
    ...mapActions("Report", ["_getVehiclesReport"]),

    async intiVehicleData() {
      this.isLoading = true;
      await this._getVehiclesReport().then((res) => {
        this.vehiclesData = res;
      });
      this.isLoading = false;
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

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
            <input type="file" id="input" @change="previewFiles($event)" />
            <vue-excel-editor v-model="jsondata" remember>
              <vue-excel-column field="vehicleId" label="" width="80px" />
              <vue-excel-column field="type" label="" />
              <vue-excel-column field="brand" label="" />
              <vue-excel-column field="ownerId" label="" />
              <vue-excel-column field="ownerName" label="" />
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
import Confirmation from "../../components/Modal/Confirmation";
import MessageModal from "../../components/Modal/MessageModal";
// import readXlsxFile from "read-excel-file";
// eslint-disable-next-line no-unused-vars
import XLSX from "xlsx";

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
      //
      jsondata: [],

      quarter: "",
      vehicleId: "",
      year: "",
    };
  },
  async mounted() {
    let file = await this._getVehiclesReport({
      quarter: this.quarter,
      vehicleId: this.vehicleId,
      year: this.year,
    });
    // let reader = new FileReader();
    // reader.readAsDataURL(file);
    // let blob = new File([file], "filename");
    // console.log("mounted -> blob", blob);
    // console.log("mounted -> file", file);
    this.previewFiles(file);
    // var workbook = XLSX.read(file, { type: "array" });
    // console.log("mounted -> workbook", workbook);
  },
  methods: {
    // Map actions
    ...mapActions("Driver", ["_getDrivers", "_getTotalDriversCount"]),
    ...mapActions("User", ["_delete"]),
    ...mapActions("Report", ["_getVehiclesReport"]),

    // Get excel file

    previewFiles(files) {
      // var f = new File([files], "REPORT_CONTRACTS_2020-11-17_00_53_35.xls", {
      //   type: "application/vnd.ms-excel",
      // });
      // console.log(files);
      var reader = new FileReader();
      reader.onload = function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        console.log("previewFiles -> e.target.result", e.target.result);
        let sheetName = workbook.SheetNames[0];
        /* DO SOMETHING WITH workbook HERE */
        let worksheet = workbook.Sheets[sheetName];
        console.log(XLSX.utils.sheet_to_json(worksheet));
      };
      reader.readAsArrayBuffer(files);
    },

    // previewFiles(e) {
    //   var files = e.target.files,
    //     f = files[0];
    //   console.log(f);
    //   var reader = new FileReader();
    //   reader.onload = function(e) {
    //     var data = new Uint8Array(e.target.result);
    //     var workbook = XLSX.read(data, { type: "array" });
    //     console.log("previewFiles -> e.target.result", e.target.result);
    //     let sheetName = workbook.SheetNames[0];
    //     /* DO SOMETHING WITH workbook HERE */
    //     console.log(workbook);
    //     let worksheet = workbook.Sheets[sheetName];
    //     console.log(XLSX.utils.sheet_to_json(worksheet));
    //   };
    //   reader.readAsArrayBuffer(f);
    // },
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

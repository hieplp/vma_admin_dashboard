/* eslint-disable no-unused-vars */
<template>
  <div class="content-wrapper">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :color="'#2e5bff'"
    ></loading>

    <div class="page-header">
      <h3 class="page-title">Driver Dashboard</h3>
      <div class="dropdown">
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
        v-if="driversList.length > 0"
      >
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Driver List</h4>
            <p class="card-description">{{ this.totalDrivers }} total</p>
            <table class="table ">
              <thead>
                <tr class="">
                  <th>No.</th>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PHONE NUMBER</th>
                  <th>VEHICLE ID</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(driver, index) in this.driversList"
                  :key="driver.userId"
                >
                  <td class="text-secondary">{{ index + 1 }}</td>
                  <td>{{ driver.userId }}</td>
                  <td>{{ driver.fullName }}</td>
                  <td>{{ driver.phoneNumber }}</td>
                  <td>{{ driver.vehicleId }}</td>
                  <td><label class="badge badge-warning">On Route</label></td>
                  <td>
                    <a href="#"><i class="mdi mdi-pencil"></i>Manage</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="this.totalDrivers > 15">
            <!-- The css class comes from semantic ui. -->
            <paginate
              :page-count="Math.round(this.totalDrivers / 15)"
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
      </div>

      <!-- Filter -->
      <transition name="slide-fade">
        <div class="col-3 card filter" v-if="isFilterVisible">
          <div class="form-group">
            <h4 class="card-title mt-4">Filter</h4>
            <div class="col-sm-12">
              <!-- Search Driver ID -->
              <label>Driver ID</label>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Driver name"
                v-model="searchDriverID"
                @keypress="isNumber($event)"
                maxlength="12"
              />
            </div>
            <div class="col-12 mt-3">
              <label>Driver Name</label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="searchDriverName"
                placeholder="Driver name"
              />
            </div>
            <!-- Phone number dropdown-->
            <div class="col-12 mt-3">
              <!-- Search Driver ID -->
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
            <!-- Driver status dropdown -->
            <div class="col-12 mt-3">
              <label>Status</label>
              <select class="form-control form-control-sm" name="status">
                <option
                  v-for="status in this.statusList"
                  :key="status.statusID"
                  :value="status.statusID"
                  >{{ status.statusName }}</option
                >
              </select>
            </div>

            <br />
            <div class="col-12 mt-1">
              <button
                class="btn btn-outline-info w-100"
                type="button"
                v-on:click="clickToViewFilter()"
              >
                Filter
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { RepositoryFactory } from "../repositories/RepositoryFactory";

const DriverRepository = RepositoryFactory.get("drivers");

export default {
  name: "Drivers",
  props: {},
  components: {
    Loading,
  },
  data() {
    return {
      isFilterVisible: false,
      isTableVisible: true,
      driverIDs: [],
      vehicleIDs: [],
      statusList: [],
      driversList: [],
      searchPhoneNumber: "",
      searchDriverID: "",
      searchDriverName: "",
      isLoading: true,
      totalDrivers: 0,
    };
  },
  mounted() {
    this.initDriverIDs();
    this.initVehicleIDs();
    this.initStatusList();
    this.initDriversList();
  },
  methods: {
    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    // pagination handle
    clickCallback(pageNum) {
      console.log(pageNum);
    },
    // Init data for Driver ID Dropdown
    initDriverIDs() {
      this.driverIDs = ["D01", "D02", "D03"];
      // wait for api
    },
    // Init data for Vehicle ID Dropdown
    initVehicleIDs() {
      this.vehicleIDs = ["V01", "V02", "V03"];
      // wait for api
    },
    // Init data for Driver Status Dropdown
    initStatusList() {
      // wait for api
      this.statusList = [
        {
          statusID: "S01",
          statusName: "Available",
        },
        {
          statusID: "S02",
          statusName: "On Route",
        },
        {
          statusID: "S03",
          statusName: "On leave",
        },
      ];
    },
    async initDriversList() {
      const { data } = await DriverRepository.get();
      this.driversList = data.driverList;
      this.totalDrivers = data.totalDrivers;
      if (this.driversList.length > 0) {
        this.isLoading = false;
      }
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

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style>
@import "../assets/vendors/mdi/css/materialdesignicons.min.css";
</style>
<style>
@import "../assets/vendors/css/vendor.bundle.base.css";
</style>
<style>
@import "../assets/css/style.css";
</style>

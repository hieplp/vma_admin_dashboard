/* eslint-disable no-unused-vars */
<template>
  <div class="content-wrapper">
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
            <p class="card-description">103 total</p>
            <table class="table ">
              <thead>
                <tr class="text-secondary">
                  <th>ID</th>
                  <th>NAME</th>
                  <th>VEHICLE ID</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="driver in this.driversList" :key="driver.driverID">
                  <td>{{ driver.userId }}</td>
                  <td>{{ driver.fullname }}</td>
                  <td>{{ driver.vehicleID }}</td>
                  <td><label class="badge badge-warning">On Route</label></td>
                  <td>
                    <a href="#"><i class="mdi mdi-pencil"></i>Manage</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <!-- The css class comes from semantic ui. -->
            <paginate
              :page-count="Math.round(driversTotalSize/15)"
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
              <label for="exampleDropdownFormPassword1">Driver name</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="exampleInputCity1"
                placeholder="Driver name"
              />
            </div>
            <br />
            <!-- Driver ID Dropdown-->
            <div class="col-sm-12">
              <label>Driver ID</label>
              <input
                class="form-control form-control-sm"
                type="text"
                name="driverID"
                list="driverIDsList"
                placeholder="Driver ID"
              />
              <datalist id="driverIDsList">
                <option
                  v-for="driverID in this.driverIDs"
                  :key="driverID"
                  :value="driverID"
                >
                </option>
              </datalist>
            </div>
            <br />
            <!-- Vehicle id dropdown -->
            <div class="col-sm-12">
              <label>Vehicle ID</label>
              <input
                class="form-control form-control-sm"
                type="text"
                name="vehicleID"
                list="vehicleIDsList"
                placeholder="Vehicle ID"
              />
              <datalist id="vehicleIDsList">
                <option
                  v-for="vehicleID in this.vehicleIDs"
                  :key="vehicleID"
                  :value="vehicleID"
                >
                </option>
              </datalist>
            </div>
            <br />
            <!-- Driver status dropdown -->
            <div class="col-12">
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
            <div class="col-12 ">
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
import "../assets/vendors/js/vendor.bundle.base.js";
import "../assets/js/off-canvas.js";
import "../assets/js/hoverable-collapse.js";
import "../assets/js/misc.js";
import axios from "axios";

export default {
  name: "Drivers",
  props: {},
  data() {
    return {
      isFilterVisible: false,
      isTableVisible: true,
      driverIDs: [],
      vehicleIDs: [],
      statusList: [],
      driversList: [],
      driversTotalSize: 99,
    };
  },
  mounted() {
    this.initDriverIDs();
    this.initVehicleIDs();
    this.initStatusList();
    this.initDriversList();
  },
  methods: {
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
    initDriversList() {
      axios
        .get(
          "https://vehiclemanagementapplication.azurewebsites.net/api/v1/users?roleName=Driver"
        )
        .then((response) => {
          this.driversList = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
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
<style>
@import "../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>

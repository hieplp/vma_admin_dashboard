/* eslint-disable no-unused-vars */
<template>
  <div>
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>
    <div class="content-wrapper">
      <!-- <div class="row">
        <div class="col-md-7 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <div class="clearfix">
                <h4 class="card-title float-left">
                  Visit And Sales Statistics
                </h4>
                <div
                  id="visit-sale-chart-legend"
                  class="rounded-legend legend-horizontal legend-top-right float-right"
                ></div>
              </div>
              <canvas id="visit-sale-chart" class="mt-4"></canvas>
            </div>
          </div>
        </div>
        <div class="col-md-5 grid-margin stretch-card">
          <div class="card cus-card">
            <div class="card-body">
              <h4 class="card-title">Notice</h4>
              <div class="notice-list">
                <a href="">
                  <div class="notice notice-border-blue">
                    <p class="notice-name">Truck #14</p>
                    <p class="notice-content">
                      Trip completed <span>1 second ago</span>
                    </p>
                  </div>
                </a>
                <a href="">
                  <div class="notice notice-border-red">
                    <p class="notice-name">Truck #14</p>
                    <p class="notice-content">
                      Trip completed <span>1 second ago</span>
                    </p>
                  </div>
                </a>
                <a href="">
                  <div class="notice notice-border-green">
                    <p class="notice-name">Truck #14</p>
                    <p class="notice-content">
                      Trip completed <span>1 second ago</span>
                    </p>
                  </div>
                </a>
              </div>
              <div class="notice-seemore">
                <a href="">See more</a>
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <div class="row">
        <div class="col-md-4 stretch-card grid-margin">
          <!-- Vehicle on track -->
          <div class="card bg-gradient-success card-img-holder text-white">
            <div class="card-body">
              <img
                src="../assets/images/dashboard/circle.png"
                class="card-img-absolute"
                alt="circle-image"
              />
              <h4 class="font-weight-normal mb-3">
                Vehicle On Route
                <i class="mdi mdi-car-wash mdi-24px float-right"></i>
              </h4>
              <h1 class="mt-5 card-large-content">
                {{ this.vehicleOnRoute
                }}<span class="card-small-content">vehicles</span>
              </h1>
              <!-- <h6 class="card-text">Increased by 60%</h6> -->
            </div>
          </div>
        </div>
        <!-- Today's distance driven -->
        <div class="col-md-4 stretch-card grid-margin">
          <div class="card bg-gradient-info card-img-holder text-white">
            <div class="card-body">
              <img
                src="../assets/images/dashboard/circle.png"
                class="card-img-absolute"
                alt="circle-image"
              />
              <h4 class="font-weight-normal mb-3">
                Today's Distance Driven<i
                  class="mdi mdi-cube-unfolded mdi-24px float-right"
                ></i>
              </h4>
              <h1 class="mt-5 card-large-content">
                158.3<span class="card-small-content">km</span>
              </h1>
              <!-- <h6 class="card-text">Decreased by 10%</h6> -->
            </div>
          </div>
        </div>
        <!-- Incompleted Requests -->
        <div class="col-md-4 stretch-card grid-margin">
          <div class="card bg-gradient-warning card-img-holder text-white">
            <div class="card-body">
              <img
                src="../assets/images/dashboard/circle.png"
                class="card-img-absolute"
                alt="circle-image"
              />
              <h4 class="font-weight-normal mb-3">
                Incompleted Requests<i
                  class="mdi mdi-message-alert mdi-24px float-right"
                ></i>
              </h4>
              <h1 class="mt-5 card-large-content">
                {{ this.pendingReqCount
                }}<span class="card-small-content">requests</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <!-- revenue chart
      <div class="row">
        <div class="col-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">REVENUE</h4>
              <canvas id="revenueChart" style="height: 250px"></canvas>
            </div>
          </div>
        </div>
      </div> -->
      <div class="row">
        <!-- Status pie chart -->
        <div class="col-lg-6 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">Drivers</h4>
              <canvas id="driver-status-chart"></canvas>
              <div
                id="driver-status-chart-legend"
                class="rounded-legend legend-vertical legend-bottom-left pt-4"
              ></div>
            </div>
          </div>
        </div>
        <!-- Status pie chart -->
        <div class="col-lg-6 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">Request</h4>
              <canvas id="request-status-chart"></canvas>
              <div
                id="request-status-chart-legend"
                class="rounded-legend legend-vertical legend-bottom-left pt-4"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <!-- Vehicle Document Requests table -->
        <div class="grid-margin stretch-card col-lg-12">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">Requests List</h4>
              <table class="table" v-if="requests.length > 0">
                <thead>
                  <tr class="">
                    <th>NO.</th>
                    <th>ID</th>
                    <!-- <th>USER ID</th> -->
                    <th>CREATE DATE</th>
                    <th>TYPE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(request, index) in this.requests.slice(0, 6)"
                    :key="request.requestId"
                  >
                    <td class="text-secondary">{{ index + 1 }}</td>
                    <td>{{ request.requestId }}</td>
                    <!-- <td>{{ request.requestId }}</td> -->
                    <td>{{ formatDate(request.createDate) }}</td>
                    <td>
                      <label
                        class="badge"
                        v-bind:class="{
                          'badge-info':
                            request.requestType === 'ADD_NEW_VEHICLE' ||
                            request.requestType === 'NEW_VEHICLE_DOCUMENT' ||
                            request.requestType === 'NEW_DOCUMENT',
                          'badge-danger':
                            request.requestType === 'DELETE_VEHICLE_DOCUMENT' ||
                            request.requestType === 'DELETE_DOCUMENT' ||
                            request.requestType === 'VEHICLE_NEEDS_REPAIR',
                          'badge-warning':
                            request.requestType === 'CHANGE_VEHICLE' ||
                            request.requestType === 'UPDATE_DOCUMENT',
                          'badge-dark':
                            request.requestType === 'WITHDRAW_VEHICLE',
                        }"
                        >{{ request.requestType.replaceAll("_", " ") }}</label
                      >
                    </td>
                    <td>
                      <label
                        class="badge"
                        v-bind:class="{
                          'badge-info': request.requestStatus === 'ACCEPTED',
                          'badge-danger': request.requestStatus === 'DENIED',
                          'badge-warning': request.requestStatus === 'PENDING',
                        }"
                        >{{ request.requestStatus }}</label
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- Empty list -->
              <div class="card empty-list " v-else-if="!isLoading">
                <div class="mt-5">
                  <i class="icon clipboard list ui text-center mt-5"></i>
                </div>
                <h1>NOTHING</h1>
                <h3>Your list is empty.</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- revenue chart -->
      <div class="row">
        <div class="col-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">Vehicle Types</h4>
              <canvas id="revenueChart" style="height: 250px"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="row">
        <div class="col-lg-4 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">ACTIVE DRIVERS</h4>

              <div class="active-drivers-list">
                <div class="active-driver row">
                  <div style="width: 14%" class="driver-image">
                    <img src="../assets/images/faces/face1.jpg" alt="image" />
                  </div>
                  <div style="width: 40%" class="driver-info">
                    <div style="width: 100%" class="black-color">
                      David Grey. H
                    </div>
                    <div class="grey-color">Container</div>
                  </div>
                  <div style="width: 40%" class="driver-info">
                    <div class="col-12">
                      <span class="float-right black-color">5.5 h</span>
                    </div>
                    <div class="col-12">
                      <span class="float-right grey-color">1,232 km</span>
                    </div>
                  </div>
                </div>

                <div class="active-driver row">
                  <div style="width: 14%" class="driver-image">
                    <img src="../assets/images/faces/face1.jpg" alt="image" />
                  </div>
                  <div style="width: 40%" class="driver-info">
                    <div style="width: 100%" class="black-color">
                      David Grey. H
                    </div>
                    <div class="grey-color">Container</div>
                  </div>
                  <div style="width: 40%" class="driver-info">
                    <div class="col-12">
                      <span class="float-right black-color">5.5 h</span>
                    </div>
                    <div class="col-12">
                      <span class="float-right grey-color">1,232 km</span>
                    </div>
                  </div>
                </div>

                <div class="active-driver row">
                  <div style="width: 14%" class="driver-image">
                    <img src="../assets/images/faces/face1.jpg" alt="image" />
                  </div>
                  <div style="width: 40%" class="driver-info">
                    <div style="width: 100%" class="black-color">
                      David Grey. H
                    </div>
                    <div class="grey-color">Container</div>
                  </div>
                  <div style="width: 40%" class="driver-info">
                    <div class="col-12">
                      <span class="float-right black-color">5.5 h</span>
                    </div>
                    <div class="col-12">
                      <span class="float-right grey-color">1,232 km</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">TRIPS BY TYPE</h4>
              <canvas id="driver-status-chart"></canvas>
              <div
                id="driver-status-chart-legend"
                class="rounded-legend legend-vertical legend-bottom-left pt-4"
              ></div>
            </div>
          </div>
        </div>
        <div class="col-lg-4 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">REMINDERS</h4>
              <ul style="width: 100%">
                <li class="row">
                  <div class="col-6">222</div>
                  <div class="col-6">222</div>
                  <div class="col-6">222</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";
import $ from "jquery";
import moment from "moment";
import Loading from "vue-loading-overlay";
import { mapActions } from "vuex";
import { RepositoryFactory } from "../repositories/RepositoryFactory";
const VehicleRepository = RepositoryFactory.get("vehicles");

export default {
  name: "OverView",
  components: {
    Loading,
  },
  props: {},
  data() {
    return {
      prevRoute: null,
      // Request
      pendingReqCount: 0,
      acceptedReqCount: 0,
      deniedReqCount: 0,
      requests: [],
      //
      vehicleOnRoute: 0,
      // Driver
      activeDrivers: 0,
      inactiveDrivers: 0,
      disableDrivers: 0,
      isLoading: true,
    };
  },
  async mounted() {
    if (this.prevRoute && this.prevRoute.name === "Login") {
      window.location.reload();
    }
    this.isLoading = true;
    this.activeDrivers = await this._getTotalDriverByStatus("ACTIVE");
    this.inactiveDrivers = await this._getTotalDriverByStatus("INACTIVE");
    this.disableDrivers = await this._getTotalDriverByStatus("DISABLE");

    await this.initPendingRequestCount();
    await this.initVehicleCount();
    await this.initTotalVehicleTypeChart();
    await this.initRequests();
    this.initDriverStatusChart();
    this.initRequestStatusChart();
    this.isLoading = false;
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    // Map actions
    ...mapActions("Driver", ["_getTotalDriverByStatus"]),
    ...mapActions("Request", ["_getRequest", "_getRequestCount"]),
    ...mapActions("Vehicle", ["_getTotalVehicleByStatus"]),
    // Init request count
    async initPendingRequestCount() {
      this.pendingReqCount = await this._getRequestCount({
        fromDate: "",
        toDate: "",
        requestType: "",
        userId: "",
        requestStatus: "PENDING",
      });
      this.acceptedReqCount = await this._getRequestCount({
        fromDate: "",
        toDate: "",
        requestType: "",
        userId: "",
        requestStatus: "ACCEPTED",
      });
      this.deniedReqCount = await this._getRequestCount({
        fromDate: "",
        toDate: "",
        requestType: "",
        userId: "",
        requestStatus: "DENIED",
      });
    },
    // Get request list
    async initRequests() {
      await this._getRequest({
        fromDate: "",
        toDate: "",
        requestType: "",
        userId: "",
        page: "",
        requestStatus: "",
      }).then((res) => {
        this.requests = res;
      });
    },
    // Init request count
    async initVehicleCount() {
      this.vehicleOnRoute = await this._getTotalVehicleByStatus("ON_ROUTE");
    },
    // Init total vehicle type
    async initTotalVehicleTypeChart() {
      let types = await VehicleRepository.getVehicleType();
      let typesCount = [];
      let typeName = [];
      for (const type of types) {
        let count = await VehicleRepository.getTotalVehicleByType(
          type.vehicleTypeId
        );
        typesCount.push(count);
        typeName.push(type.vehicleTypeName);
      }
      console.log(typesCount);

      let revenueChart = document
        .getElementById("revenueChart")
        .getContext("2d");
      // Global Options
      Chart.defaults.global.defaultFontFamily = "Lato";
      Chart.defaults.global.defaultFontSize = 18;
      Chart.defaults.global.defaultFontColor = "#777";

      // gradient color
      let gradient = revenueChart.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "rgba(66, 135, 245, 0.4)");
      gradient.addColorStop(1, "rgba(66, 135, 245, 0.05)");

      new Chart(revenueChart, {
        type: "bar", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data: {
          labels: typeName,
          datasets: [
            {
              label: "Vehicles",
              lineTension: 0,
              data: typesCount,
              backgroundColor: gradient,
              borderWidth: 2,
              borderColor: "#2e5bff",
              hoverBorderWidth: 4,
            },
          ],
        },
        options: {
          responsive: true,
          animation: {
            animateScale: true,
            animateRotate: true,
          },
          legend: {
            display: false,
            position: "top",
            labels: {
              fontColor: "#000",
            },
          },
          tooltips: {
            enabled: true,
          },
        },
      });
    },
    // init trip by type chart
    initDriverStatusChart() {
      var tripsByTypeChartCanvas = $("#driver-status-chart")
        .get(0)
        .getContext("2d");
      // gradient color
      let gradientInfo = tripsByTypeChartCanvas.createLinearGradient(
        0,
        0,
        0,
        500
      );
      gradientInfo.addColorStop(0, "rgba(144, 202, 249, 1)");
      gradientInfo.addColorStop(1, "rgba(6, 92, 161, 1)");

      let gradientDanger = tripsByTypeChartCanvas.createLinearGradient(
        0,
        0,
        0,
        400
      );
      gradientDanger.addColorStop(0, "rgba(255, 191, 150, 1)");
      gradientDanger.addColorStop(1, "rgba(254, 112, 150, 1)");

      let gradientDark = tripsByTypeChartCanvas.createLinearGradient(
        0,
        0,
        0,
        400
      );
      gradientDark.addColorStop(0, "rgba(94, 113, 136, 1)");
      gradientDark.addColorStop(1, "rgba(62, 75, 91, 1)");

      var tripsByTypeChartData = {
        datasets: [
          {
            data: [
              this.activeDrivers,
              this.inactiveDrivers,
              this.disableDrivers,
            ],
            backgroundColor: [gradientInfo, gradientDanger, gradientDark],
            hoverBackgroundColor: [gradientInfo, gradientDanger, gradientDark],
            borderColor: [gradientInfo, gradientDanger, gradientDark],
            legendColor: ["#2496f2", "#fe7096", "#3e4b5b"],
          },
        ],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ["Active", "Inactive", "Disable"],
      };
      var tripsByTypeChartOptions = {
        responsive: true,
        animation: {
          animateScale: true,
          animateRotate: true,
        },
        // cutoutPercentage: 70,
        legend: false,
        legendCallback: function() {
          var text = [];
          text.push("<ul>");
          text.push('<div class="row">');
          for (
            var i = 0;
            i < tripsByTypeChartData.datasets[0].data.length;
            i++
          ) {
            text.push('<li class="col-4" style="font-size:18px">');
            text.push(
              '<span class="legend-dots" style="background:' +
                tripsByTypeChartData.datasets[0].legendColor[i] +
                '"></span>'
            );
            if (tripsByTypeChartData.labels[i]) {
              text.push(tripsByTypeChartData.labels[i]);
            }
          }
          text.push("</li>");
          text.push("</ul>");
          return text.join("");
        },
      };

      var trafficChart = new Chart(tripsByTypeChartCanvas, {
        type: "pie",
        data: tripsByTypeChartData,
        options: tripsByTypeChartOptions,
      });

      $("#driver-status-chart-legend").html(trafficChart.generateLegend());
    },
    // init request chart
    initRequestStatusChart() {
      var tripsByTypeChartCanvas = $("#request-status-chart")
        .get(0)
        .getContext("2d");
      // gradient color
      let gradientInfo = tripsByTypeChartCanvas.createLinearGradient(
        0,
        0,
        0,
        500
      );
      gradientInfo.addColorStop(0, "rgba(87, 176, 247, 1)");
      gradientInfo.addColorStop(1, "rgba(36, 150, 242, 1)");

      let gradientDanger = tripsByTypeChartCanvas.createLinearGradient(
        0,
        0,
        0,
        400
      );
      gradientDanger.addColorStop(0, "rgba(255, 191, 150, 1)");
      gradientDanger.addColorStop(1, "rgba(255, 213, 0, 1)");

      let gradientDark = tripsByTypeChartCanvas.createLinearGradient(
        0,
        0,
        0,
        400
      );
      gradientDark.addColorStop(0, "rgba(242, 48, 64, 1)");
      gradientDark.addColorStop(1, "rgba(245, 10, 29, 1)");

      var tripsByTypeChartData = {
        datasets: [
          {
            data: [
              this.acceptedReqCount,
              this.pendingReqCount,
              this.deniedReqCount,
            ],
            backgroundColor: [gradientInfo, gradientDanger, gradientDark],
            hoverBackgroundColor: [gradientInfo, gradientDanger, gradientDark],
            borderColor: [gradientInfo, gradientDanger, gradientDark],
            legendColor: ["#2496f2", "#ffd500", "#f50a1d"],
          },
        ],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ["Accepted", "Pending", "Denied"],
      };
      var tripsByTypeChartOptions = {
        responsive: true,
        animation: {
          animateScale: true,
          animateRotate: true,
        },
        // cutoutPercentage: 70,
        legend: false,
        legendCallback: function() {
          var text = [];
          text.push("<ul>");
          text.push('<div class="row">');
          for (
            var i = 0;
            i < tripsByTypeChartData.datasets[0].data.length;
            i++
          ) {
            text.push('<li class="col-4" style="font-size:18px">');
            text.push(
              '<span class="legend-dots" style="background:' +
                tripsByTypeChartData.datasets[0].legendColor[i] +
                '"></span>'
            );
            if (tripsByTypeChartData.labels[i]) {
              text.push(tripsByTypeChartData.labels[i]);
            }
          }
          text.push("</li>");
          text.push("</ul>");
          return text.join("");
        },
      };

      var trafficChart = new Chart(tripsByTypeChartCanvas, {
        type: "pie",
        data: tripsByTypeChartData,
        options: tripsByTypeChartOptions,
      });

      $("#request-status-chart-legend").html(trafficChart.generateLegend());
    },
    // format date
    formatDate(date) {
      return moment(date).format("YYYY-MM-DD HH:MM:SS");
    },
    // init revenue chart
    initRevenueChart() {
      let revenueChart = document
        .getElementById("revenueChart")
        .getContext("2d");
      // Global Options
      Chart.defaults.global.defaultFontFamily = "Lato";
      Chart.defaults.global.defaultFontSize = 18;
      Chart.defaults.global.defaultFontColor = "#777";

      // gradient color
      let gradient = revenueChart.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "rgba(66, 135, 245, 0.4)");
      gradient.addColorStop(1, "rgba(66, 135, 245, 0.05)");

      new Chart(revenueChart, {
        type: "line", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data: {
          labels: [
            "JANUARY",
            "FEBRUARY",
            "MARCH",
            "APRIL",
            "MAY",
            "JUNE",
            "JULY",
            "AUGUST",
            "SEPTEMBER",
            "OCTOBER",
            "NOVEMBER",
            "DECEMBER",
          ],
          datasets: [
            {
              label: "Revenue",
              lineTension: 0,
              data: [617594, 181045, 153060, 555555, 105162, 95072, 617594],
              backgroundColor: gradient,
              borderWidth: 2,
              borderColor: "#2e5bff",
              hoverBorderWidth: 4,
              hoverBorderColor: "#000",
            },
          ],
        },
        options: {
          responsive: true,
          animation: {
            animateScale: true,
            animateRotate: true,
          },
          legend: {
            display: true,
            position: "top",
            labels: {
              fontColor: "#000",
            },
          },
          tooltips: {
            enabled: true,
          },
        },
      });
    },

    // init trip by type chart
    initTripByTypeChart() {
      var tripsByTypeChartData = {
        datasets: [
          {
            data: [30, 30, 40, 30],
            backgroundColor: ["#2E5BFF", "#F7C137", "#8C54FF", "#00C1D4"],
            hoverBackgroundColor: ["#2E5BFF", "#F7C137", "#8C54FF", "#00C1D4"],
            borderColor: ["#2E5BFF", "#F7C137", "#8C54FF", "#00C1D4"],
            legendColor: ["#2E5BFF", "#F7C137", "#8C54FF", "#00C1D4"],
          },
        ],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ["Bus", "Truck", "Minivan", "Others"],
      };
      var tripsByTypeChartOptions = {
        responsive: true,
        animation: {
          animateScale: true,
          animateRotate: true,
        },
        // cutoutPercentage: 70,
        legend: false,
        legendCallback: function() {
          var text = [];
          text.push("<ul>");
          text.push('<div class="row">');
          for (
            var i = 0;
            i < tripsByTypeChartData.datasets[0].data.length;
            i++
          ) {
            text.push('<li class="col-6" style="font-size:18px">');
            text.push(
              '<span class="legend-dots" style="background:' +
                tripsByTypeChartData.datasets[0].legendColor[i] +
                '"></span>'
            );
            if (tripsByTypeChartData.labels[i]) {
              text.push(tripsByTypeChartData.labels[i]);
            }
          }
          text.push("</li>");
          text.push("</ul>");
          return text.join("");
        },
      };
      var tripsByTypeChartCanvas = $("#driver-status-chart")
        .get(0)
        .getContext("2d");
      var trafficChart = new Chart(tripsByTypeChartCanvas, {
        type: "pie",
        data: tripsByTypeChartData,
        options: tripsByTypeChartOptions,
      });
      $("#driver-status-chart-legend").html(trafficChart.generateLegend());
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../assets/css/overview.css";
</style>

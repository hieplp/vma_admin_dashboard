/* eslint-disable no-unused-vars */
<template>
  <div>
    <div class="content-wrapper">
      <div class="row">
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
        <!-- Notice  -->
        <div class="col-md-5 grid-margin stretch-card">
          <div class="card cus-card">
            <div class="card-body">
              <h4 class="card-title">Notice</h4>
              <!-- Notifications List -->
              <div class="notice-list">
                <!-- Notification item -->
                <a href="">
                  <div class="notice notice-border-blue">
                    <p class="notice-name">Truck #14</p>
                    <p class="notice-content">
                      Trip completed <span>1 second ago</span>
                    </p>
                  </div>
                </a>
                <!-- Notification item -->
                <a href="">
                  <div class="notice notice-border-red">
                    <p class="notice-name">Truck #14</p>
                    <p class="notice-content">
                      Trip completed <span>1 second ago</span>
                    </p>
                  </div>
                </a>
                <!-- Notification item -->
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
      </div>

      <div class="row">
        <div class="col-md-4 stretch-card grid-margin">
          <!-- Vehicle on track -->
          <div class="card bg-gradient-danger card-img-holder text-white">
            <div class="card-body">
              <img
                src="../assets/images/dashboard/circle.png"
                class="card-img-absolute"
                alt="circle-image"
              />
              <h4 class="font-weight-normal mb-3">
                Vehicle On Track
                <i class="mdi mdi-car-wash mdi-24px float-right"></i>
              </h4>
              <h1 class="mt-5 card-large-content">
                36<span class="card-small-content">vehicles</span>
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
          <div class="card bg-gradient-success card-img-holder text-white">
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
                22<span class="card-small-content">requests</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <!-- revenue chart -->
      <div class="row">
        <div class="col-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">REVENUE</h4>
              <canvas id="revenueChart" style="height: 250px"></canvas>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Currently Active Drivers -->
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
        <!-- Trips By Type -->
        <div class="col-lg-4 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">TRIPS BY TYPE</h4>
              <canvas id="trips-by-type-chart"></canvas>
              <div
                id="trips-by-type-chart-legend"
                class="rounded-legend legend-vertical legend-bottom-left pt-4"
              ></div>
            </div>
          </div>
        </div>
        <!-- Reminders -->
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
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";
import $ from "jquery";

export default {
  name: "OverView",
  props: {},
  data() {
    return {
      prevRoute: null,
    };
  },
  mounted() {
    if (this.prevRoute && this.prevRoute.name === "Login") {
      window.location.reload();
    }
    console.log("mounted -> this.prevRoute", this.prevRoute);
    this.initRevenueChart();
    this.initTripByTypeChart();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
      console.log("beforeRouteEnter -> to", to);
    });
  },
  methods: {
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
            "May 1",
            "May 2",
            "May 3",
            "May 4",
            "May 5",
            "May 6",
            "May 7",
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
      var tripsByTypeChartCanvas = $("#trips-by-type-chart")
        .get(0)
        .getContext("2d");
      var trafficChart = new Chart(tripsByTypeChartCanvas, {
        type: "pie",
        data: tripsByTypeChartData,
        options: tripsByTypeChartOptions,
      });
      $("#trips-by-type-chart-legend").html(trafficChart.generateLegend());
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../assets/css/overview.css";
</style>

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
      <div class="row">
        <!-- Active drivers -->
        <div class="col-md-4 stretch-card grid-margin">
          <OverviewCard
            title="Active Drivers"
            color="bg-gradient-info"
            :count="activeDrivers"
            countName="drivers"
            :goTo="
              () => {
                this.viewDrivers('ACTIVE');
              }
            "
          />
        </div>
        <!-- Inactive drivers -->
        <div class="col-md-4 stretch-card grid-margin">
          <OverviewCard
            title="Inactive Drivers"
            color="bg-gradient-danger"
            :count="inactiveDrivers"
            countName="drivers"
            :goTo="
              () => {
                this.viewDrivers('INACTIVE');
              }
            "
          />
        </div>
        <!-- Pending Appoval -->
        <div class="col-md-4 stretch-card grid-margin">
          <OverviewCard
            title="Disable Drivers"
            color="bg-gradient-dark"
            :count="disableDrivers"
            countName="drivers"
            :goTo="
              () => {
                this.viewDrivers('DISABLE');
              }
            "
          />
        </div>
      </div>

      <!-- revenue chart -->
      <div class="row">
        <div class="col-6 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-5">Drivers</h4>
              <canvas id="driverStatusChart" style="height: 250px"></canvas>
            </div>
          </div>
        </div>
        <!-- Status pie chart -->
        <div class="col-lg-6 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">Status</h4>
              <canvas id="trips-by-type-chart"></canvas>
              <div
                id="trips-by-type-chart-legend"
                class="rounded-legend legend-vertical legend-bottom-left pt-4"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Loading from "vue-loading-overlay";
import Chart from "chart.js";
import $ from "jquery";
import OverviewCard from "../../components/OverviewCard";
export default {
  name: "VehicleOverview",
  components: {
    OverviewCard,
    Loading,
  },
  data() {
    return {
      activeDrivers: 0,
      inactiveDrivers: 0,
      disableDrivers: 0,
      maintenanceVehicles: 0,
      isLoading: false,
    };
  },
  async mounted() {
    this.isLoading = true;
    this.activeDrivers = await this._getTotalDriverByStatus("ACTIVE");
    this.inactiveDrivers = await this._getTotalDriverByStatus("INACTIVE");
    this.disableDrivers = await this._getTotalDriverByStatus("DISABLE");
    // Set total vehicle bar char
    this.initTotalDriverChart();
    // this.initRevenueChart();
    this.initDriverStatusChart();
    this.isLoading = false;
  },
  methods: {
    // Map actions
    ...mapActions("Driver", ["_getTotalDriverByStatus"]),
    // View drivers
    viewDrivers(status) {
      this.$router.push({
        name: "Drivers",
        params: { status: status },
      });
    },
    // Init total vehicle type
    async initTotalDriverChart() {
      let driverStatusChart = document
        .getElementById("driverStatusChart")
        .getContext("2d");
      // Global Options
      Chart.defaults.global.defaultFontFamily = "Lato";
      Chart.defaults.global.defaultFontSize = 18;
      Chart.defaults.global.defaultFontColor = "#777";

      // gradient color
      let gradientInfo = driverStatusChart.createLinearGradient(0, 0, 0, 400);
      gradientInfo.addColorStop(0, "rgba(144, 202, 249, 1)");
      gradientInfo.addColorStop(1, "rgba(4, 126, 223, 1)");

      let gradientDanger = driverStatusChart.createLinearGradient(0, 0, 0, 400);
      gradientDanger.addColorStop(0, "rgba(255, 191, 150, 1)");
      gradientDanger.addColorStop(1, "rgba(254, 112, 150, 1)");

      let gradientDark = driverStatusChart.createLinearGradient(0, 0, 0, 400);
      gradientDark.addColorStop(0, "rgba(94, 113, 136, 1)");
      gradientDark.addColorStop(1, "rgba(62, 75, 91, 1)");

      new Chart(driverStatusChart, {
        type: "bar", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data: {
          labels: ["Active", "Inactive", "Disable"],
          datasets: [
            {
              label: "Drivers",
              lineTension: 0,
              data: [
                this.activeDrivers,
                this.inactiveDrivers,
                this.disableDrivers,
              ],
              backgroundColor: [gradientInfo, gradientDanger, gradientDark],
              borderWidth: 2,
              borderColor: [gradientInfo, gradientDanger, gradientDark],
              hoverBorderWidth: 4,
              hoverBorderColor: [gradientInfo, gradientDanger, gradientDark],
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
          },
          tooltips: {
            enabled: true,
          },
        },
      });
    },

    // init revenue chart
    initRevenueChart() {
      let driverStatusChart = document
        .getElementById("driverStatusChart")
        .getContext("2d");
      // Global Options
      Chart.defaults.global.defaultFontFamily = "Lato";
      Chart.defaults.global.defaultFontSize = 18;
      Chart.defaults.global.defaultFontColor = "#777";

      // gradient color
      let gradient = driverStatusChart.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "rgba(66, 135, 245, 0.4)");
      gradient.addColorStop(1, "rgba(66, 135, 245, 0.05)");

      new Chart(driverStatusChart, {
        type: "bar", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
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
    initDriverStatusChart() {
      var tripsByTypeChartCanvas = $("#trips-by-type-chart")
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

      $("#trips-by-type-chart-legend").html(trafficChart.generateLegend());
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

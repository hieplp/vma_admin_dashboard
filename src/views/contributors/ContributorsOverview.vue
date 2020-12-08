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
        <!-- Active contributors -->
        <div class="col-md-4 stretch-card grid-margin">
          <OverviewCard
            title="Active Contributors"
            color="bg-gradient-info"
            :count="activeContributors"
            countName="contributors"
            :goTo="
              () => {
                this.viewContributors('ACTIVE');
              }
            "
          />
        </div>
        <!-- Inactive contributors -->
        <div class="col-md-4 stretch-card grid-margin">
          <OverviewCard
            title="Inactive Contributors"
            color="bg-gradient-danger"
            :count="inactiveContributors"
            countName="contributors"
            :goTo="
              () => {
                this.viewContributors('INACTIVE');
              }
            "
          />
        </div>
        <!-- Pending Appoval -->
        <div class="col-md-4 stretch-card grid-margin">
          <OverviewCard
            title="Disable Contributors"
            color="bg-gradient-dark"
            :count="disableContributors"
            countName="contributors"
            :goTo="
              () => {
                this.viewContributors('DISABLE');
              }
            "
          />
        </div>
      </div>

      <!-- revenue chart -->
      <div class="row">
        <div class="col-lg-6 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-5">Contributors</h4>
              <canvas
                id="contributorStatusChart"
                style="height: 250px"
              ></canvas>
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
// import "../assets/vendors/js/vendor.bundle.base.js";
// import "../assets/js/off-canvas.js";
// import "../assets/js/hoverable-collapse.js";
// import "../assets/js/misc.js";
// import "../assets/js/misc.js";
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
      activeContributors: 0,
      inactiveContributors: 0,
      disableContributors: 0,
      maintenanceVehicles: 0,
      isLoading: false,
    };
  },
  async mounted() {
    this.isLoading = true;
    this.activeContributors = await this._getTotalContributorByStatus("ACTIVE");
    this.inactiveContributors = await this._getTotalContributorByStatus(
      "INACTIVE"
    );
    this.disableContributors = await this._getTotalContributorByStatus(
      "DISABLE"
    );
    // Set total vehicle bar char
    this.initTotalContributorChart();
    // this.initRevenueChart();
    this.initContributorStatusChart();
    this.isLoading = false;
  },
  methods: {
    // Map actions
    ...mapActions("Contributor", ["_getTotalContributorByStatus"]),
    // View driver detail
    viewContributors(status) {
      this.$router.push({
        name: "Contributors",
        params: { status: status },
      });
    },
    // Init total vehicle type
    async initTotalContributorChart() {
      let contributorStatusChart = document
        .getElementById("contributorStatusChart")
        .getContext("2d");
      // Global Options
      Chart.defaults.global.defaultFontFamily = "Lato";
      Chart.defaults.global.defaultFontSize = 18;
      Chart.defaults.global.defaultFontColor = "#777";

      // gradient color
      let gradientInfo = contributorStatusChart.createLinearGradient(
        0,
        0,
        0,
        400
      );
      gradientInfo.addColorStop(0, "rgba(144, 202, 249, 1)");
      gradientInfo.addColorStop(1, "rgba(4, 126, 223, 1)");

      let gradientDanger = contributorStatusChart.createLinearGradient(
        0,
        0,
        0,
        400
      );
      gradientDanger.addColorStop(0, "rgba(255, 191, 150, 1)");
      gradientDanger.addColorStop(1, "rgba(254, 112, 150, 1)");

      let gradientDark = contributorStatusChart.createLinearGradient(
        0,
        0,
        0,
        400
      );
      gradientDark.addColorStop(0, "rgba(94, 113, 136, 1)");
      gradientDark.addColorStop(1, "rgba(62, 75, 91, 1)");

      new Chart(contributorStatusChart, {
        type: "bar", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data: {
          labels: ["Active", "Inactive", "Disable"],
          datasets: [
            {
              label: "Contributors",
              lineTension: 0,
              data: [
                this.activeContributors,
                this.inactiveContributors,
                this.disableContributors,
              ],
              backgroundColor: [gradientInfo, gradientDanger, gradientDark],
              borderWidth: 1,
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

    initContributorStatusChart() {
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
              this.activeContributors,
              this.inactiveContributors,
              this.disableContributors,
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

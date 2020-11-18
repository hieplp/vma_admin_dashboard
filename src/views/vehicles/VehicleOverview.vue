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
        <!-- Vehicle On Route -->
        <div class="col-md-3 stretch-card grid-margin">
          <OverviewCard
            title="Vehicle On Route"
            color="bg-gradient-success"
            :count="vehicleOnRoute"
            countName="vehicles"
            :goTo="
              () => {
                this.viewVehicles('ON_ROUTE');
              }
            "
          />
        </div>
        <!-- Available Vehicles -->
        <div class="col-md-3 stretch-card grid-margin">
          <OverviewCard
            title="Available Vehicles"
            color="bg-gradient-info"
            :count="availableVehicles"
            countName="vehicles"
            :goTo="
              () => {
                this.viewVehicles('AVAILABLE');
              }
            "
          />
        </div>
        <!-- Pending Appoval -->
        <div class="col-md-3 stretch-card grid-margin">
          <OverviewCard
            title="Pending Appoval"
            color="bg-gradient-warning"
            :count="pendingVehicles"
            countName="vehicles"
            :goTo="
              () => {
                this.viewVehicles('PENDING_APPROVAL');
              }
            "
          />
        </div>
        <!-- Maintenance Vehicles -->
        <div class="col-md-3 stretch-card grid-margin">
          <OverviewCard
            title="Maintenance Vehicles"
            color="bg-gradient-danger"
            :count="maintenanceVehicles"
            countName="vehicles"
            :goTo="
              () => {
                this.viewVehicles('MAINTENANCE');
              }
            "
          />
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
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Chart from "chart.js";
import $ from "jquery";
import Loading from "vue-loading-overlay";
import OverviewCard from "../../components/OverviewCard";
import { RepositoryFactory } from "../../repositories/RepositoryFactory";
const VehicleRepository = RepositoryFactory.get("vehicles");
export default {
  name: "VehicleOverview",
  components: {
    OverviewCard,
    Loading,
  },
  data() {
    return {
      vehicleOnRoute: 0,
      availableVehicles: 0,
      pendingVehicles: 0,
      maintenanceVehicles: 0,
      isLoading: true,
    };
  },
  async mounted() {
    this.isLoading = true;
    this.vehicleOnRoute = await this._getTotalVehicleByStatus("ON_ROUTE");
    this.availableVehicles = await this._getTotalVehicleByStatus("AVAILABLE");
    this.pendingVehicles = await this._getTotalVehicleByStatus(
      "PENDING_APPROVAL"
    );
    this.maintenanceVehicles = await this._getTotalVehicleByStatus(
      "MAINTENANCE"
    );
    // Set total vehicle bar char
    await this.initTotalVehicleTypeChart();
    // this.initRevenueChart();
    // this.initTripByTypeChart();
    this.isLoading = false;
  },
  methods: {
    // Map actions
    ...mapActions("Vehicle", ["_getTotalVehicleByStatus"]),
    // View vehicles
    viewVehicles(status) {
      this.$router.push({
        name: "Vehicles",
        params: { status: status },
      });
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

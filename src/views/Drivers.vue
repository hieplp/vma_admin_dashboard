/* eslint-disable no-unused-vars */
<template>
  <div class="content-wrapper">
    <div class="page-header">
      <h3 class="page-title">Driver Dashboard</h3>
      <div class="dropdown">
        <button
          class="btn btn-primary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          data-target="filter"
        >
          + Filter List
        </button>
        <div class="dropdown-menu" id="filter">
          <form class="forms-sample">
            <div class="form-group">
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
              <div class="col-sm-12">
                <label for="exampleDropdownFormPassword1">Driver id</label>

                <select
                  class="form-control form-control-sm"
                  id="exampleFormControlSelect3"
                >
                  <option>#001</option>
                  <option>#002</option>
                  <option>#003</option>
                  <option>#004</option>
                  <option>#005</option>
                </select>
              </div>
              <br />
              <div class="col-sm-12">
                <label for="exampleDropdownFormPassword1">Vehicle id</label>

                <select
                  class="form-control form-control-sm"
                  id="exampleFormControlSelect3"
                >
                  <option>#001</option>
                  <option>#002</option>
                  <option>#003</option>
                  <option>#004</option>
                  <option>#005</option>
                </select>
              </div>
              <br />
              <div class="col-sm-12">
                <label for="exampleDropdownFormPassword4">Status</label>

                <select
                  class="form-control form-control-sm"
                  id="exampleFormControlSelect3"
                >
                  <option>Available</option>
                  <option>On route</option>
                  <option>On leave</option>
                </select>
              </div>
              <br />
            </div>
            <button
              type="submit"
              class="btn btn-primary form-control form-control-sm"
            >
              Filter
            </button>
          </form>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Driver List</h4>
            <p class="card-description">103 total</p>
            <table class="table table-striped">
              <thead>
                <tr class="text-secondary">
                  <th>ID</th>
                  <th>NAME</th>
                  <th>VEHICLE ID</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <img
                      src="../assets/images/faces-clipart/pic-1.png"
                      alt="image"
                    />#015
                  </td>
                  <td>DungNH</td>
                  <td>Truck#1</td>
                  <td><label class="badge badge-warning">On Route</label></td>
                  <td>
                    <a href="#"><i class="mdi mdi-pencil"></i>Manage</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img
                      src="../assets/images/faces-clipart/pic-2.png"
                      alt="image"
                    />#023
                  </td>
                  <td>HungND</td>
                  <td>Container#3</td>
                  <td><label class="badge badge-success">Available</label></td>
                  <td>
                    <a href="#"><i class="mdi mdi-pencil"></i>Manage</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img
                      src="../assets/images/faces-clipart/pic-3.png"
                      alt="image"
                    />#008
                  </td>
                  <td>HiepLP</td>
                  <td>SUV#4</td>
                  <td><label class="badge badge-warning">On Route</label></td>
                  <td>
                    <a href="#"><i class="mdi mdi-pencil"></i>Manage</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img
                      src="../assets/images/faces-clipart/pic-4.png"
                      alt="image"
                    />#010
                  </td>
                  <td>NganLH</td>
                  <td>Bus#2</td>
                  <td><label class="badge badge-warning">On Route</label></td>
                  <td>
                    <a href="#"><i class="mdi mdi-pencil"></i>Manage</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img
                      src="../assets/images/faces-clipart/pic-1.png"
                      alt="image"
                    />#033
                  </td>
                  <td>ThanhPT</td>
                  <td>Minitruck#6</td>
                  <td><label class="badge badge-warning">On Route</label></td>
                  <td>
                    <a href="#"><i class="mdi mdi-pencil"></i>Manage</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img
                      src="../assets/images/faces-clipart/pic-2.png"
                      alt="image"
                    />#011
                  </td>
                  <td>ThanhNT</td>
                  <td>Truck#2</td>
                  <td><label class="badge badge-success">Available</label></td>
                  <td>
                    <a href="#"><i class="mdi mdi-pencil"></i>Manage</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img
                      src="../assets/images/faces-clipart/pic-3.png"
                      alt="image"
                    />#003
                  </td>
                  <td>HaiDN</td>
                  <td>Container#1</td>
                  <td><label class="badge badge-info">On Leave</label></td>
                  <td>
                    <a href="#"><i class="mdi mdi-pencil"></i>Manage</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img
                      src="../assets/images/faces-clipart/pic-2.png"
                      alt="image"
                    />#001
                  </td>
                  <td>ThanhNC</td>
                  <td>Bus#6</td>
                  <td><label class="badge badge-info">On Leave</label></td>
                  <td>
                    <a href="#"><i class="mdi mdi-pencil"></i>Manage</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/vendors/js/vendor.bundle.base.js";
import "../assets/js/off-canvas.js";
import "../assets/js/hoverable-collapse.js";
import "../assets/js/misc.js";
import Chart from "chart.js";
import $ from "jquery";

export default {
  name: "OverView",
  props: {
  },
  mounted() {
    this.initRevenueChart();
    this.initTripByTypeChart();
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
    initTripByTypeChart(){
    var tripsByTypeChartData = {
      datasets: [{
        data: [30, 30, 40, 30],
        backgroundColor: [
          '#2E5BFF',
          '#F7C137',
          '#8C54FF',
          '#00C1D4'
        ],
        hoverBackgroundColor: [
          '#2E5BFF',
          '#F7C137',
          '#8C54FF',
          '#00C1D4'
        ],
        borderColor: [
          '#2E5BFF',
          '#F7C137',
          '#8C54FF',
          '#00C1D4'
        ],
        legendColor: [
          '#2E5BFF',
          '#F7C137',
          '#8C54FF',
          '#00C1D4'
        ]

      }],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
        'Bus',
        'Truck',
        'Minivan',
        'Others'
      ]
    };
    var tripsByTypeChartOptions = {
      responsive: true,
      animation: {
        animateScale: true,
        animateRotate: true,
      },
      // cutoutPercentage: 70,
      legend: false,
      legendCallback: function () {
        var text = [];
        text.push('<ul>');
        text.push('<div class="row">');
        for (var i = 0; i < tripsByTypeChartData.datasets[0].data.length; i++) {
          text.push('<li class="col-6" style="font-size:18px">')
          text.push('<span class="legend-dots" style="background:' +
            tripsByTypeChartData.datasets[0].legendColor[i] +
            '"></span>');
          if (tripsByTypeChartData.labels[i]) {
            text.push(tripsByTypeChartData.labels[i]);
          }

        }
        text.push("</li>");
        text.push('</ul>');
        return text.join('');
      }
    };
    var tripsByTypeChartCanvas = $("#trips-by-type-chart").get(0).getContext("2d");
    var trafficChart = new Chart(tripsByTypeChartCanvas, {
      type: 'pie',
      data: tripsByTypeChartData,
      options: tripsByTypeChartOptions
    });
    $("#trips-by-type-chart-legend").html(trafficChart.generateLegend());
    }
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
@import "../assets/css/overview.css";
</style>

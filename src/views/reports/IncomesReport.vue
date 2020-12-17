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
      subTitle="Do you want to delete this income?"
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
        <a href="javascript:void(0)">Reports</a>
        <span class="text-secondary"> / </span>
        <span>
          Revenue - Expense
        </span>
      </h3>
    </div>
    <div class="row">
      <div class="col-md-6 stretch-card grid-margin">
        <OverviewCard
          title="Revenue"
          color="bg-gradient-info"
          :count="incomeSummary.totalRevenue"
          countName="VND"
          :goTo="
            () => {
              this.viewDrivers('ACTIVE');
            }
          "
        />
      </div>
      <div class="col-md-6 stretch-card grid-margin">
        <OverviewCard
          title="Expense"
          color="bg-gradient-danger"
          :count="incomeSummary.totalExpense"
          countName="VND"
          :goTo="
            () => {
              this.viewDrivers('ACTIVE');
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
            <h4 class="card-title">INCOMES</h4>
            <canvas id="revenueChart" style="height: 250px"></canvas>
          </div>
        </div>
      </div>
    </div>
    <!-- Handle this -->
    <div class="page-header" v-if="false">
      <h3 class="page-title"></h3>
      <div class="dropdown">
        <!-- Download report -->
        <!-- <a
          :href="`${baseUrl}?quarter=${this.quarter}&year=${this.year}`"
          class="btn btn-gradient-info btn-icon-text mr-2"
          type="button"
        >
          <i class="mdi mdi-download btn-icon-prepend"></i>
          Download
        </a> -->

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
    <div class="row" v-if="false">
      <div
        class="grid-margin stretch-card"
        v-bind:class="{
          'col-lg-12': isTableVisible,
          'col-lg-9': !isTableVisible,
        }"
      >
        <div class="card" v-if="incomesData.length > 0">
          <div class="card-body">
            <table class="table ">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <!-- <th>ID</th> -->
                  <th>CONTRACT</th>
                  <th>EARNED MONEY</th>
                  <th>VEHICLE ID</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(income, index) in this.incomesData" :key="index">
                  <td class="text-secondary">{{ index + 1 }}</td>
                  <!-- <td>{{ income.userId }}</td> -->
                  <td>{{ income.contractId }}</td>
                  <td>{{ income.driverEarned }}</td>

                  <td>
                    <p v-if="income.vehicleId">
                      {{ income.vehicleId }}
                    </p>
                    <p v-else>N/A</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Empty list -->
        <div class="card empty-list" v-else-if="!isLoading">
          <i class="mdi mdi-account-off"></i>
          <h1>NOTHING</h1>
          <h3>Your list is empty.</h3>
        </div>
      </div>

      <!-- Filter -->
      <transition name="slide-fade">
        <div class="col-3 card filter" v-if="isFilterVisible">
          <div class="form-group">
            <h4 class="card-title mt-4">Filter</h4>
            <div class="col-12 mt-4">
              <label>Year</label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="year"
                maxlength="4"
                placeholder="Year"
              />
            </div>

            <!-- Quarter -->
            <div class="col-12 mt-4">
              <label>Quarter</label>
              <select
                class="form-control form-control-sm"
                name="status"
                v-model="quarter"
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
                v-on:click="search()"
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
import CONSTANT from "../../constant";
import Chart from "chart.js";
import OverviewCard from "../../components/OverviewCard";

export default {
  name: "ContractReport",
  props: {},
  components: {
    Loading,
    Confirmation,
    MessageModal,
    OverviewCard,
  },
  computed: {
    // Map state
    ...mapState("Driver", ["incomes", "totalDrivers"]),
  },
  data() {
    return {
      isFilterVisible: false,
      isTableVisible: true,
      statusList: [],
      isLoading: false,
      // Delete
      isDeleteConVisible: false,
      // Error and success modal
      isError: false,
      isSuccess: false,
      errMsg: "",
      deleteUserID: "",
      // Report
      incomesData: [],
      quarter: "",
      year: "",
      driverId: this.$route.params.driverId,

      janIncome: 0,
      febIncome: 0,
      maIncome: 0,
      apIncome: 0,
      mayIncome: 0,
      juneIncome: 0,
      julyIncome: 0,
      augustIncome: 0,
      sepIncome: 0,
      ocIncome: 0,
      noIncome: 0,
      decIncome: 0,

      incomeSummary: [],

      vehicleId: "",
      baseUrl: `${CONSTANT.BASE_URL}/reports/contracts`,
    };
  },
  async mounted() {
    this.isLoading = true;
    this.initStatusList();
    await this.init12MonthIncomes();
    await this.intiScheduleData();
    this.initRevenueChart();
    this.isLoading = false;
  },
  methods: {
    // Map actions
    ...mapActions("Report", [
      "_getDriversIncomesByDriverId",
      "_getRevenueExpenseSummaryReportData",
      "_getTotalIncomesByDriverId",
    ]),
    // Init schedule data
    async intiScheduleData() {
      this.isLoading = true;
      await this._getDriversIncomesByDriverId({
        quarter: this.quarter,
        year: this.year,
        driverId: this.driverId,
      }).then((res) => {
        this.incomesData = res;
      });
      this.isLoading = false;
    },
    // Search
    async search() {
      this.isLoading = true;
      await this.init12MonthIncomes();
      await this.intiScheduleData();
      this.initRevenueChart();
      this.isLoading = false;
    },
    // Init data for income Status Dropdown
    initStatusList() {
      this.statusList = [
        "FIRST",
        "SECOND",
        "THIRD",
        "FOURTH",
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
      ];
    },
    // Clear search item value
    clearSearchValue() {
      this.quarter = "";
      this.year = "";
    },
    // Get excel file
    async init12MonthIncomes() {
      this.incomeSummary = await this._getRevenueExpenseSummaryReportData({
        year: this.year,
        quarter: "",
      });
    },
    // init revenue chart
    initRevenueChart() {
      let revenueSumList = this.incomeSummary.revenueExpenseSummaryMonthResList;

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
      // gradient color
      let redGradient = revenueChart.createLinearGradient(0, 0, 0, 400);
      redGradient.addColorStop(0, "rgba(245, 17, 17, 1)");
      redGradient.addColorStop(1, "rgba(242, 27, 27, 0.1)");

      new Chart(revenueChart, {
        type: "line", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data: {
          labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
          datasets: [
            {
              label: "Revenue",
              lineTension: 0,
              data: [
                revenueSumList[0].revenueExpenseReportRes.totalRevenue,
                revenueSumList[1].revenueExpenseReportRes.totalRevenue,
                revenueSumList[2].revenueExpenseReportRes.totalRevenue,
                revenueSumList[3].revenueExpenseReportRes.totalRevenue,
                revenueSumList[4].revenueExpenseReportRes.totalRevenue,
                revenueSumList[5].revenueExpenseReportRes.totalRevenue,
                revenueSumList[6].revenueExpenseReportRes.totalRevenue,
                revenueSumList[7].revenueExpenseReportRes.totalRevenue,
                revenueSumList[8].revenueExpenseReportRes.totalRevenue,
                revenueSumList[9].revenueExpenseReportRes.totalRevenue,
                revenueSumList[10].revenueExpenseReportRes.totalRevenue,
                revenueSumList[11].revenueExpenseReportRes.totalRevenue,
              ],
              backgroundColor: gradient,
              borderWidth: 2,
              borderColor: "#2e5bff",
              hoverBorderWidth: 4,
              hoverBorderColor: "#000",
            },
            {
              label: "Expense",
              lineTension: 0,
              data: [
                revenueSumList[0].revenueExpenseReportRes.totalExpense,
                revenueSumList[1].revenueExpenseReportRes.totalExpense,
                revenueSumList[2].revenueExpenseReportRes.totalExpense,
                revenueSumList[3].revenueExpenseReportRes.totalExpense,
                revenueSumList[4].revenueExpenseReportRes.totalExpense,
                revenueSumList[5].revenueExpenseReportRes.totalExpense,
                revenueSumList[6].revenueExpenseReportRes.totalExpense,
                revenueSumList[7].revenueExpenseReportRes.totalExpense,
                revenueSumList[8].revenueExpenseReportRes.totalExpense,
                revenueSumList[9].revenueExpenseReportRes.totalExpense,
                revenueSumList[10].revenueExpenseReportRes.totalExpense,
                revenueSumList[11].revenueExpenseReportRes.totalExpense,
              ],
              backgroundColor: redGradient,
              borderWidth: 2,
              borderColor: "#f21b1b",
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

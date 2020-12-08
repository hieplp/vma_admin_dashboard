import Repository from "../../repositories/Repository";
const REPORT_URL = "/reports";
export default {
  namespaced: true,
  state: {},
  mutations: {},

  actions: {
    // Get vehicles report
    _getVehiclesReport() {
      return new Promise((resolve, reject) => {
        Repository.get(`${REPORT_URL}/vehicles/data`)
          .then((res) => {
            resolve(res.data.vehicleReports);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get vehicles report
    _getScheduleReport(context, { quarter, year }) {
      return new Promise((resolve, reject) => {
        console.log();
        Repository.get(
          `${REPORT_URL}/schedule/data?quarter=${quarter}&year=${year}`
        )
          .then((res) => {
            resolve(res.data.schedules);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get contracts report
    _getContractsReport(context, { quarter, year }) {
      return new Promise((resolve, reject) => {
        console.log();
        Repository.get(
          `${REPORT_URL}/schedule/data?quarter=${quarter}&year=${year}`
        )
          .then((res) => {
            resolve(res.data.contractReports);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get driver income report
    _getDriversIncomesReportData(context, { quarter, year }) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${REPORT_URL}/driver-income/data?quarter=${quarter}&year=${year}`
        )
          .then((res) => {
            resolve(res.data.driverIncomes);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get driver income report by driver Id
    _getDriversIncomesByDriverId(context, { quarter, year, driverId }) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${REPORT_URL}/driver-income/${driverId}/data?quarter=${quarter}&year=${year}`
        )
          .then((res) => {
            resolve(res.data.driverIncomes);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get driver income report by driver Id
    _getTotalIncomesByDriverId(context, { quarter, year, driverId }) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${REPORT_URL}/driver-income/${driverId}/data?quarter=${quarter}&year=${year}`
        )
          .then((res) => {
            resolve(res.data.earnedValue);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    _getDriverInComeSummaryReportRes(context, { year, driverId }) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${REPORT_URL}/driver-income/${driverId}/summary/data?year=${year}`
        )
          .then((res) => {
            resolve(res.data.driverIncomeSummaryMonthResList);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
  },
};

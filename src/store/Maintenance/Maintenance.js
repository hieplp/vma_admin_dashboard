import Repository from "../../repositories/Repository";
const MAINTENANCE_URL = "/maintenances";
export default {
  namespaced: true,
  state: {
    totalMaintenance: 0,
    maintenanceList: [],
  },
  mutations: {
    // set total maintenance
    setTotalMaintenance(state, data) {
      state.totalMaintenance = data;
    },
    // set maintenanceList
    setMaintenanceList(state, data) {
      state.maintenanceList = data;
    },
  },
  actions: {
    // Get maintenance list
    _getMaintenanceList(
      context,
      {
        costMax,
        costMin,
        endDate,
        maintenanceType,
        pageNum,
        startDate,
        vehicleId,
        viewOption,
      }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${MAINTENANCE_URL}?costMax=${costMax}&costMin=${costMin}&endDate=${endDate}&maintenanceType=${maintenanceType}&pageNum=${pageNum}&startDate=${startDate}&vehicleId=${vehicleId}&viewOption=${viewOption}`
        )
          .then((res) => {
            context.commit("setMaintenanceList", res.data.maintenanceList);
            resolve();
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get maintenance list
    _getMaintenanceDetail(context, maintenanceId) {
      return new Promise((resolve, reject) => {
        Repository.get(`${MAINTENANCE_URL}/${maintenanceId}`)
          .then((res) => {
            resolve(res.data.maintenanceDetail);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get maintenance list count
    _getMaintenanceListCount(
      context,
      {
        costMax,
        costMin,
        endDate,
        maintenanceType,
        startDate,
        vehicleId,
        viewOption,
      }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${MAINTENANCE_URL}/count?costMax=${costMax}&costMin=${costMin}&endDate=${endDate}&maintenanceType=${maintenanceType}&startDate=${startDate}&vehicleId=${vehicleId}&viewOption=${viewOption}`
        )
          .then((res) => {
            context.commit("setTotalMaintenance", res.data);
            resolve();
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get maintenance list count
    _getMaintenanceListCountByType(
      context,
      {
        costMax,
        costMin,
        endDate,
        maintenanceType,
        startDate,
        vehicleId,
        viewOption,
      }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${MAINTENANCE_URL}/count?costMax=${costMax}&costMin=${costMin}&endDate=${endDate}&maintenanceType=${maintenanceType}&startDate=${startDate}&vehicleId=${vehicleId}&viewOption=${viewOption}`
        )
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Create maintenance
    _create(context, { maintenance }) {
      return new Promise((resolve, reject) => {
        Repository.post(MAINTENANCE_URL, maintenance)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // _delete maintenance
    _delete(context, maintenanceId) {
      return new Promise((resolve, reject) => {
        Repository.delete(`${MAINTENANCE_URL}?maintenanceId=${maintenanceId}`)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            console.log(
              "🚀 ~ file: Maintenance.js ~ line 130 ~ returnnewPromise ~ err",
              err
            );
            reject(err.response.data);
          });
      });
    },
    // update maintenance
    _updateMaintenance(context, { maintenance }) {
      return new Promise((resolve, reject) => {
        Repository.patch(MAINTENANCE_URL, maintenance)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
  },
};

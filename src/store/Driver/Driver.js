import Repository from "../../repositories/Repository";
const DRIVER_URL = "/drivers";
export default {
  namespaced: true,
  state: {
    totalDrivers: 0,
    drivers: [],
    driverDetail: {},
  },
  mutations: {
    // set total drivers
    setTotalDrivers(state, data) {
      state.totalDrivers = data;
    },
    // set drivers
    setDrivers(state, data) {
      state.drivers = data;
    },
    // set driver detail
    setDriverDetail(state, data) {
      state.driverDetail = data;
    },
  },

  actions: {
    // Get drivers
    _getDrivers(
      context,
      { page, name, phoneNumber, userStatus, userId, viewOption }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${DRIVER_URL}?name=${name}&page=${page}&phoneNumber=${phoneNumber}&userStatus=${userStatus}&userId=${userId}&viewOption=${viewOption}`
        )
          .then((res) => {
            context.commit("setDrivers", res.data.driverRes);
            resolve();
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get total drivers count
    _getTotalDriversCount(
      context,
      { name, phoneNumber, userStatus, userId, viewOption }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${DRIVER_URL}/count?name=${name}&phoneNumber=${phoneNumber}&userStatus=${userStatus}&userId=${userId}&viewOption=${viewOption}`
        )
          .then((res) => {
            context.commit("setTotalDrivers", res.data);
            resolve();
          })
          .catch((err) => {
            console.log(err);
            reject(err.response.data);
          });
      });
    },
    // Get driver's detailed information
    _getDetailDriver(context, userId) {
      return new Promise((resolve, reject) => {
        Repository.get(`${DRIVER_URL}/${userId}`)
          .then((res) => {
            // context.commit("setDriverDetail", res.data.driverDetail);
            resolve(res.data.driverDetail);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get total drivers count
    _getTotalDriverByStatus(context, userStatus) {
      return new Promise((resolve, reject) => {
        Repository.get(`${DRIVER_URL}/count?userStatus=${userStatus}`)
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
  },
};

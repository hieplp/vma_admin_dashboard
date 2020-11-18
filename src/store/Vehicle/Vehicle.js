import Repository from "../../repositories/Repository";
const VEHICLE_URL = "/vehicles";
export default {
  namespaced: true,
  state: {
    totalVehicles: 0,
    vehicles: [],
    vehiclerDetail: {},
  },
  mutations: {
    // set total vehicles
    setTotalVehicles(state, data) {
      state.totalVehicles = data;
    },
    // set vehicles
    setVehicles(state, data) {
      state.vehicles = data;
    },
    // set vehicler detail
    setVehicleDetail(state, data) {
      state.vehiclerDetail = data;
    },
  },

  actions: {
    // Get vehicles
    _getVehicles(
      context,
      { page, name, phoneNumber, userStatus, userId, viewOption }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${VEHICLE_URL}?name=${name}&page=${page}&phoneNumber=${phoneNumber}&userStatus=${userStatus}&userId=${userId}&viewOption=${viewOption}`
        )
          .then((res) => {
            context.commit("setVehicles", res.data.vehiclerRes);
            resolve();
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get total vehicles count
    _getTotalVehiclesCount(
      context,
      { name, phoneNumber, userStatus, userId, viewOption }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${VEHICLE_URL}/count?name=${name}&phoneNumber=${phoneNumber}&userStatus=${userStatus}&userId=${userId}&viewOption=${viewOption}`
        )
          .then((res) => {
            context.commit("setTotalVehicles", res.data);
            resolve();
          })
          .catch((err) => {
            console.log(err);
            reject(err.response.data);
          });
      });
    },
    // Get vehicler's detailed information
    _getDetailVehicle(context, userId) {
      return new Promise((resolve, reject) => {
        Repository.get(`${VEHICLE_URL}/${userId}`)
          .then((res) => {
            // context.commit("setVehicleDetail", res.data.vehiclerDetail);
            resolve(res.data.vehiclerDetail);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get total vehicles count
    _getTotalVehicleByStatus(context, vehicleStatus) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${VEHICLE_URL}/count?vehicleStatus=${vehicleStatus}&viewOption=1`
        )
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

import Repository from "../../repositories/Repository";
const VEHICLE_URL = "/vehicles";
export default {
  namespaced: true,
  state: {
    totalVehicles: 0,
    vehicles: [],
    vehiclerDetail: {},
    assignedDrivers: [],
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
    // set assigned drivers
    setAssignedDrivers(state, data) {
      state.assignedDrivers = data;
    },
  },

  actions: {
    // Get vehicles
    _getVehicles(
      context,
      {
        pageNum,
        model,
        vehicleId,
        vehicleMinDis,
        vehicleMaxDis,
        vehicleStatus,
        vehicleType,
        vehicleMinSeat,
        vehicleMaxSeat,
        viewOption,
        ownerId,
      }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${VEHICLE_URL}?model=${model}&pageNum=${pageNum}&vehicleId=${vehicleId}&vehicleMaxDis=${vehicleMaxDis}&vehicleMinDis=${vehicleMinDis}&vehicleStatus=${vehicleStatus}&vehicleTypeId=${vehicleType}&seatsMax=${vehicleMaxSeat}&seatsMin=${vehicleMinSeat}&viewOption=${viewOption}&ownerId=${ownerId}`
        )
          .then((res) => {
            context.commit("setVehicles", res.data.vehicleList);
            resolve();
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get vehicles
    _getVehiclesWithIdAndType(
      context,
      { pageNum, vehicleId, viewOption, vehicleStatus, vehicleType }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${VEHICLE_URL}?pageNum=${pageNum}&vehicleId=${vehicleId}&vehicleTypeId=${vehicleType}&viewOption=${viewOption}&vehicleStatus=${vehicleStatus}`
        )
          .then((res) => {
            context.commit("setVehicles", res.data.vehicleList);
            resolve();
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get vehicles
    _getVehiclesWithIdAndTypeCount(
      context,
      { vehicleId, viewOption, vehicleStatus, vehicleType }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${VEHICLE_URL}/count?vehicleId=${vehicleId}&vehicleTypeId=${vehicleType}&viewOption=${viewOption}&vehicleStatus=${vehicleStatus}`
        )
          .then((res) => {
            context.commit("setTotalVehicles", res.data);
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
            reject(err.response.data);
          });
      });
    },
    // Get vehicle type
    _getVehicleType() {
      return new Promise((resolve, reject) => {
        Repository.get(`${VEHICLE_URL}/misc/types`)
          .then((res) => {
            resolve(res.data.vehicleTypes);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get vehicler's detailed information
    _getDetailVehicle(context, vehicleId) {
      return new Promise((resolve, reject) => {
        Repository.get(`${VEHICLE_URL}/${vehicleId}`)
          .then((res) => {
            resolve(res.data.vehicleDetail);
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
    // Get assigned drivers history
    _getDriverHistoryByVehicleId(context, vehicleId) {
      return new Promise((resolve, reject) => {
        Repository.get(`${VEHICLE_URL}/${vehicleId}/drivers`)
          .then((res) => {
            context.commit("setAssignedDrivers", res.data.driverHistory);
            resolve();
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get assigned vehicle history by driver id
    _getVehicleHistoryByDriverId(context, driverId) {
      return new Promise((resolve, reject) => {
        Repository.get(`${VEHICLE_URL}/history?driverId=${driverId}`)
          .then((res) => {
            context.commit("setAssignedDrivers", res.data.vehicleHistory);
            resolve();
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Update vehicle status
    _updateVehicleStatus(context, { vehicleId, status }) {
      return new Promise((resolve, reject) => {
        Repository.patch(
          `${VEHICLE_URL}/${vehicleId}/status?vehicleStatus=${status}`
        )
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Delete contracts
    _deleteContract(context, vehicleValueId) {
      return new Promise((resolve, reject) => {
        Repository.delete(
          `${VEHICLE_URL}/value?vehicleValueId=${vehicleValueId}`
        )
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Insert contracts
    _insertContract(context, vehicleValueReq) {
      return new Promise((resolve, reject) => {
        Repository.post(`${VEHICLE_URL}/value`, vehicleValueReq)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },

    // Get vehicles
    _getVehiclesWithIdAndTypeAndSeats(
      context,
      {
        pageNum,
        vehicleId,
        viewOption,
        vehicleStatus,
        vehicleType,
        seatsMax,
        seatsMin,
      }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${VEHICLE_URL}?pageNum=${pageNum}&vehicleId=${vehicleId}&vehicleTypeId=${vehicleType}&viewOption=${viewOption}&vehicleStatus=${vehicleStatus}&seatsMax=${seatsMax}&seatsMin=${seatsMin}`
        )
          .then((res) => {
            context.commit("setVehicles", res.data.vehicleList);
            resolve();
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get vehicles
    _getVehiclesWithIdAndTypeAndSeatsCount(
      context,
      { vehicleId, viewOption, vehicleStatus, vehicleType, seatsMax, seatsMin }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${VEHICLE_URL}/count?vehicleId=${vehicleId}&vehicleTypeId=${vehicleType}&viewOption=${viewOption}&vehicleStatus=${vehicleStatus}&seatsMax=${seatsMax}&seatsMin=${seatsMin}`
        )
          .then((res) => {
            context.commit("setTotalVehicles", res.data);
            resolve();
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },

    // --------------- VEHICLE SEAT ----------------------------
    // Get vehicle seats
    _getVehicleSeats() {
      return new Promise((resolve, reject) => {
        Repository.get(`${VEHICLE_URL}/misc/seats`)
          .then((res) => {
            resolve(res.data.seats);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Create vehicle seats
    _createVehicleSeat(context, vehicleSeat) {
      console.log(
        "🚀 ~ file: Vehicle.js ~ line 266 ~ _createVehicleSeat ~ vehicleSeat",
        vehicleSeat
      );
      return new Promise((resolve, reject) => {
        Repository.post(`${VEHICLE_URL}/misc/seats`, vehicleSeat)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Update vehicle seats
    _updateVehicleSeat(context, vehicleSeat) {
      return new Promise((resolve, reject) => {
        Repository.patch(`${VEHICLE_URL}/misc/seats`, vehicleSeat)
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

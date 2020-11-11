import Repository from "./Repository";

const resource = "/vehicles/assignment";

export default {
  // Assign driver to a vehicle
  assignVehicle(vehicleId, driverId) {
    return new Promise((resolve, reject) => {
      Repository.patch(`${resource}/${vehicleId}/${driverId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Assign driver to a vehicle
  withdrawVehicle(vehicleId) {
    return new Promise((resolve, reject) => {
      Repository.patch(`${resource}/${vehicleId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Delete driver
  delete(userId) {
    return new Promise((resolve, reject) => {
      Repository.delete(`${resource}?userId=${userId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
};

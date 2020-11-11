import Repository from "./Repository";

const resource = "/vehicles";

export default {
  // Get vehicle type
  async getVehicleType() {
    return new Promise((resolve, reject) => {
      Repository.get(`${resource}/misc/types`)
        .then((res) => {
          resolve(res.data.vehicleTypes);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Get brands
  async getBrands() {
    return new Promise((resolve, reject) => {
      Repository.get(`${resource}/misc/brands`)
        .then((res) => {
          resolve(res.data.brands);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Get vehicles list
  async get(
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
    ownerId
  ) {
    let vehicleList = [];
    try {
      const res = await Repository.get(
        `${resource}?model=${model}&pageNum=${pageNum}&vehicleId=${vehicleId}&vehicleMaxDis=${vehicleMaxDis}&vehicleMinDis=${vehicleMinDis}&vehicleStatus=${vehicleStatus}&vehicleTypeId=${vehicleType}&seatsMax=${vehicleMaxSeat}&seatsMin=${vehicleMinSeat}&viewOption=${viewOption}&ownerId=${ownerId}`
      );
      if (res.data) {
        vehicleList = res.data.vehicleList;
      }
    } catch (ex) {
      console.log(ex);
    }
    return vehicleList;
  },
  // Get total drivers count
  async getTotalVehicle(
    model,
    vehicleId,
    vehicleMinDis,
    vehicleMaxDis,
    vehicleStatus,
    vehicleType,
    vehicleMinSeat,
    vehicleMaxSeat,
    viewOption,
    ownerId
  ) {
    let count = 0;
    try {
      const res = await Repository.get(
        `${resource}/count?model=${model}&vehicleId=${vehicleId}&vehicleMaxDis=${vehicleMaxDis}&vehicleMinDis=${vehicleMinDis}&vehicleStatus=${vehicleStatus}&vehicleTypeId=${vehicleType}&seatsMax=${vehicleMaxSeat}&seatsMin=${vehicleMinSeat}&viewOption=${viewOption}&ownerId=${ownerId}`
      );
      if (res.data) {
        count = res.data;
      }
    } catch (ex) {
      console.log(ex);
    }
    return count;
  },
  // Create Vehicle
  create(vehicle) {
    console.log(vehicle);
    return new Promise((resolve, reject) => {
      Repository.post(resource, vehicle)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          reject(err.response.data);
        });
    });
  },
  // Get detailed vehicle
  getDetailVehicle(vehicleId) {
    return new Promise((resolve, reject) => {
      Repository.get(`${resource}/${vehicleId}`)
        .then((res) => {
          resolve(res.data.vehicleDetail);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Create vehicle
  update(vehicle) {
    return new Promise((resolve, reject) => {
      Repository.patch(resource, vehicle)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          reject(err.response.data);
        });
    });
  },
  // Delete driver
  delete(vehicleId) {
    return new Promise((resolve, reject) => {
      Repository.delete(`${resource}?vehicleId=${vehicleId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
};

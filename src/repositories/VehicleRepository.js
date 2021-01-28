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
        `${resource}?pageNum=${pageNum}&vehicleId=${vehicleId}&vehicleMaxDis=${vehicleMaxDis}&vehicleMinDis=${vehicleMinDis}&vehicleStatus=${vehicleStatus}&vehicleTypeId=${vehicleType}&seatsMax=${vehicleMaxSeat}&seatsMin=${vehicleMinSeat}&useStatus=${viewOption}` +
          (ownerId === "" ? "" : "&ownerId=" + ownerId) +
          (model === "" ? "" : "&model=" + model)
      );
      if (res.data) {
        vehicleList = res.data.vehicleList;
      }
    } catch (ex) {
      console.log(ex);
    }
    return vehicleList;
  },
  // Get total vehicles count
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
        `${resource}/count?vehicleId=${vehicleId}&vehicleMaxDis=${vehicleMaxDis}&vehicleMinDis=${vehicleMinDis}&vehicleStatus=${vehicleStatus}&vehicleTypeId=${vehicleType}&seatsMax=${vehicleMaxSeat}&seatsMin=${vehicleMinSeat}&useStatus=${viewOption}` +
          (ownerId === "" ? "" : "&ownerId=" + ownerId) +
          (model === "" ? "" : "&model=" + model)
      );
      if (res.data) {
        count = res.data;
      }
    } catch (ex) {
      console.log(ex);
    }
    return count;
  },
  // Get total vehicles count by status
  async getTotalVehicleByStatus(vehicleStatus) {
    let count = 0;
    try {
      const res = await Repository.get(
        `${resource}/count?vehicleStatus=${vehicleStatus}&viewOption=1`
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
  async getTotalVehicleByType(vehicleType) {
    return new Promise((resolve, reject) => {
      Repository.get(
        `${resource}/count?vehicleTypeId=${vehicleType}&viewOption=0`
      )
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Create Vehicle
  create(vehicle) {
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
    console.log(
      "🚀 ~ file: VehicleRepository.js ~ line 139 ~ update ~ vehicle",
      vehicle
    );
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
  // Update vehicle status
  updateVehicleStatus(vehicleId, status) {
    return new Promise((resolve, reject) => {
      console.log(
        "🚀 ~ file: Vehicle.js ~ line 181 ~ _updateVehicleStatus ~ status",
        status
      );
      Repository.patch(`${resource}/${vehicleId}/status`, status)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
};

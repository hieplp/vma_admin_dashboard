import Repository from "./Repository";

const resource = "/vehicles";

export default {
  // Get driver list
  async get(
    pageNum,
    model,
    ownerId,
    vehicleId,
    vehicleMinDis,
    vehicleMaxDis,
    vehicleStatus,
    vehicleType,
    viewOption
  ) {
    let vehicleList = [];
    try {
      const res = await Repository.get(
        `${resource}?model=${model}
        &ownerId=${ownerId}
        &pageNum=${pageNum}
        &vehicleId=${vehicleId}
        &vehicleMaxDis=${vehicleMaxDis}
        &vehicleMinDis=${vehicleMinDis}
        &vehicleStatus=${vehicleStatus}
        &vehicleType=${vehicleType}
        &viewOption=${viewOption}`
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
    ownerId,
    vehicleId,
    vehicleMinDis,
    vehicleMaxDis,
    vehicleStatus,
    vehicleType,
    viewOption
  ) {
    let count = 0;
    try {
      const res = await Repository.get(
        `${resource}/count?model=${model}
        &ownerId=${ownerId}
        &vehicleId=${vehicleId}
        &vehicleMaxDis=${vehicleMaxDis}
        &vehicleMinDis=${vehicleMinDis}
        &vehicleStatus=${vehicleStatus}
        &vehicleType=${vehicleType}
        &viewOption=${viewOption}`
      );
      if (res.data) {
        count = res.data;
      }
    } catch (ex) {
      console.log(ex);
    }
    return count;
  },
  // Get detailed driver
  getDetailDriver(userId) {
    return new Promise((resolve, reject) => {
      Repository.get(`${resource}/${userId}`)
        .then((res) => {
          console.log(res.data.driverDetail);
          resolve(res.data.driverDetail);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Create driver
  create(driver) {
    return new Promise((resolve, reject) => {
      Repository.post(resource, driver)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Create driver
  update(driver) {
    return new Promise((resolve, reject) => {
      Repository.put(resource, driver)
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

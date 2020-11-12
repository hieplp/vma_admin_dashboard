import Repository from "./Repository";

const resource = "/drivers";

export default {
  // Get driver list
  async get(page, name, phoneNumber, userStatus, userId, viewOption) {
    let driverList = [];
    try {
      const res = await Repository.get(
        `${resource}?name=${name}&page=${page}&phoneNumber=${phoneNumber}&userStatus=${userStatus}&userId=${userId}&viewOption=${viewOption}`
      );
      if (res.data) {
        driverList = res.data.driverRes;
      }
    } catch (ex) {
      console.log(ex);
    }
    return driverList;
  },
  // Get total drivers count
  async getTotalDriver(name, phoneNumber, userStatus, userId, viewOption) {
    let count = 0;
    try {
      const res = await Repository.get(
        `${resource}/count?name=${name}&phoneNumber=${phoneNumber}&userStatus=${userStatus}&userId=${userId}&viewOption=${viewOption}`
      );
      if (res.data) {
        count = res.data;
      }
    } catch (ex) {
      console.log(ex);
    }
    return count;
  },
  // Get total drivers count
  async getTotalDriverByStatus(userStatus) {
    return new Promise((resolve, reject) => {
      Repository.get(`${resource}/count?userStatus=${userStatus}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Get detailed driver
  getDetailDriver(userId) {
    return new Promise((resolve, reject) => {
      Repository.get(`${resource}/${userId}`)
        .then((res) => {
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
          console.log(err);
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

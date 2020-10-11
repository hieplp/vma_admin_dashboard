import Repository from "./Repository";

const resource = "/drivers";

export default {
  // Get driver list
  async get(page, name, phoneNumber, userStatusId, userId) {
    let driverList = [];
    try {
      const res = await Repository.get(
        `${resource}?name=${name}&page=${page}&phoneNumber=${phoneNumber}&userStatusId=${userStatusId}&userId=${userId}`
      );
      if (res.data) {
        driverList = res.data.driverList;
      }
    } catch (ex) {
      console.log(ex);
    }
    return driverList;
  },
  // Get total drivers count
  async getTotalDriver(name, phoneNumber, userStatusId, userId) {
    let count = 0;
    try {
      const res = await Repository.get(
        `${resource}/count?name=${name}&phoneNumber=${phoneNumber}&userStatusId=${userStatusId}&userId=${userId}`
      );
      if (res.data) {
        count = res.data;
      }
    } catch (ex) {
      console.log(ex);
    }
    return count;
  },
  async getDetailDriver(userId) {
    let driver = {};
    try {
      const res = await Repository.get(`${resource}/${userId}`);
      if (res.data) {
        driver = res.data;
      }
    } catch (ex) {
      console.log(ex);
    }
    return driver;
  },
};

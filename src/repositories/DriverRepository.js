import Repository from "./Repository";

const resource = "/drivers";

export default {
  async init() {
    try {
      const res = await Repository.get(`${resource}`);
      return res.data;
    } catch (ex) {
      console.log(ex);
    }
  },
  async get(page, name, phoneNumber, userStatusId, userId) {
    try {
      const res = await Repository.get(
        `${resource}?name=${name}&page=${page}&phoneNumber=${phoneNumber}&userStatusId=${userStatusId}&userId=${userId}`
      );
      return res.data;
    } catch (ex) {
      console.log(ex);
    }
  },
  // Get total drivers count
  async getTotalDriver(name, phoneNumber, userStatusId, userId) {
    try {
      const res = await Repository.get(
        `${resource}/count?name=${name}&phoneNumber=${phoneNumber}&userStatusId=${userStatusId}&userId=${userId}`
      );
      return res.data;
    } catch (ex) {
      console.log(ex);
    }
  },
};

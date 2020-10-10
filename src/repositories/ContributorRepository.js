import Repository from "./Repository";

const resource = "/contributors";

export default {
  async init() {
    try {
      const res = await Repository.get(`${resource}`);
      return res.data;
    } catch (ex) {
      console.log(ex);
    }
  },
  async get(page, name, phoneNumber, userStatusId, userId, totalVehicle) {
    try {
      const res = await Repository.get(
        `${resource}?name=${name}&page=${page}&phoneNumber=${phoneNumber}&userStatusId=${userStatusId}&userId=${userId}&totalVehicle=${totalVehicle}`
      );
      return res.data;
    } catch (ex) {
      console.log(ex);
    }
  },
  // Get total drivers count
  async getTotalContributor(
    name,
    phoneNumber,
    userStatusId,
    userId,
    totalVehicle
  ) {
    try {
      const res = await Repository.get(
        `${resource}/count?name=${name}&phoneNumber=${phoneNumber}&userStatusId=${userStatusId}&userId=${userId}&totalVehicle=${totalVehicle}`
      );
      return res.data;
    } catch (ex) {
      console.log(ex);
    }
  },
};

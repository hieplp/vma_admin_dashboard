import Repository from "./Repository";

const resource = "/contributors";

export default {
  async get(page, name, phoneNumber, userStatusId, userId, totalVehicle) {
    let contributorList = [];
    try {
      const res = await Repository.get(
        `${resource}?name=${name}&page=${page}&phoneNumber=${phoneNumber}&userStatusId=${userStatusId}&userId=${userId}&min=${totalVehicle[0]}&max=${totalVehicle[1]}`
      );
      if (res.data) {
        contributorList = res.data.contributorList;
      }
    } catch (ex) {
      console.log(ex);
    }
    return contributorList;
  },
  // Get total drivers count
  async getTotalContributor(
    name,
    phoneNumber,
    userStatusId,
    userId,
    totalVehicle
  ) {
    let count = 0;
    try {
      const res = await Repository.get(
        `${resource}/count?name=${name}&phoneNumber=${phoneNumber}&userStatusId=${userStatusId}&userId=${userId}&min=${totalVehicle[0]}&max=${totalVehicle[1]}`
      );
      if (res.data) {
        count = res.data;
      }
    } catch (ex) {
      console.log(ex);
    }
    return count;
  },
  // Get getTotalVehiclesCount
  async getTotalVehiclesCount(option) {
    let count = 0;
    try {
      const res = await Repository.get(
        `${resource}/total-vehicle?option=${option}`
      );
      if (res.data) {
        count = res.data;
      }
    } catch (ex) {
      console.log(ex);
    }
    return count;
  },
};

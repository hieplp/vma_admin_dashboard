import Repository from "../../repositories/Repository";
const CONTRIBUTOR_URL = "/contributors";
export default {
  namespaced: true,
  state: {
    totalContributors: 0,
    contributors: [],
    driverDetail: {},
  },
  mutations: {
    // set total contributors
    setTotalContributors(state, data) {
      state.totalContributors = data;
    },
    // set contributors
    setContributors(state, data) {
      state.contributors = data;
    },
    // set driver detail
    setDriverDetail(state, data) {
      state.driverDetail = data;
    },
  },

  actions: {
    // Get contributors
    _getContributors(
      context,
      { page, name, phoneNumber, userStatus, userId, totalVehicle }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${CONTRIBUTOR_URL}?name=${name}&page=${page}&phoneNumber=${phoneNumber}&userStatus=${userStatus}&userId=${userId}&min=${totalVehicle[0]}&max=${totalVehicle[1]}`
        )
          .then((res) => {
            context.commit("setContributors", res.data.contributorRes);
            resolve();
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get total contributors count
    _getTotalContributorsCount(
      context,
      { name, phoneNumber, userStatus, userId, totalVehicle }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${CONTRIBUTOR_URL}/count?name=${name}&phoneNumber=${phoneNumber}&userStatus=${userStatus}&userId=${userId}&min=${totalVehicle[0]}&max=${totalVehicle[1]}`
        )
          .then((res) => {
            context.commit("setTotalContributors", res.data);
            resolve();
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get total contributors count by status
    _getTotalContributorByStatus(context, userStatus) {
      return new Promise((resolve, reject) => {
        Repository.get(`${CONTRIBUTOR_URL}/count?userStatus=${userStatus}`)
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            console.log(err);
            reject(err.response.data);
          });
      });
    },
    // Get contributor's detailed information
    _getDetailContributor(context, userId) {
      return new Promise((resolve, reject) => {
        Repository.get(`${CONTRIBUTOR_URL}/${userId}`)
          .then((res) => {
            resolve(res.data.contributorDetail);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
  },
};

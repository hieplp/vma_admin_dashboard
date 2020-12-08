import Repository from "../../repositories/Repository";
const REQUEST_URL = "/feedbacks";
export default {
  namespaced: true,
  state: {},
  mutations: {},

  actions: {
    // Get feedbacks
    _getFeedbacks(
      context,
      { driverId, pageNum, rateMax, rateMin, viewOption }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${REQUEST_URL}?driverId=${driverId}&pageNum=${pageNum}&rateMax=${rateMax}&rateMin=${rateMin}&viewOption=${viewOption}`
        )
          .then((res) => {
            resolve(res.data.feedbackList);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get feedbacks count
    _getFeedbackCount(context, { driverId, rateMax, rateMin, viewOption }) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${REQUEST_URL}?driverId=${driverId}&rateMax=${rateMax}&rateMin=${rateMin}&viewOption=${viewOption}`
        )
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // update feedback status
    _updateStatus(context, { feedbackId, feedbackStatus }) {
      return new Promise((resolve, reject) => {
        Repository.patch(
          `${REQUEST_URL}/${feedbackId}?feedbackStatus=${feedbackStatus}`
        )
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // get feedback by id
    _getFeedbackById(context, feedbackId) {
      return new Promise((resolve, reject) => {
        Repository.get(`${REQUEST_URL}/${feedbackId}`)
          .then((res) => {
            resolve(res.data.feedbackDetail);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
  },
};

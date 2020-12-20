import Repository from "../../repositories/Repository";
const REQUEST_URL = "/requests";
export default {
  namespaced: true,
  state: {},
  mutations: {},

  actions: {
    // Get requests
    _getRequest(
      context,
      { fromDate, toDate, requestType, userId, page, requestStatus }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${REQUEST_URL}?page=${page}&requestType=${requestType}&sort=DESC&userId=${userId}&requestStatus=${requestStatus}` +
            (fromDate.length > 0 ? `&fromDate=${fromDate}` : "") +
            (toDate.length > 0 ? `&toDate=${toDate}` : "")
        )
          .then((res) => {
            resolve(res.data.requestRes);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get requests count
    _getRequestCount(
      context,
      { fromDate, toDate, requestType, userId, requestStatus }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${REQUEST_URL}/count?requestType=${requestType}&userId=${userId}&requestStatus=${requestStatus}` +
            (fromDate.length > 0 ? `&fromDate=${fromDate}` : "") +
            (toDate.length > 0 ? `&toDate=${toDate}` : "")
        )
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // update request status
    _updateStatus(context, { requestId, requestStatus }) {
      return new Promise((resolve, reject) => {
        let user = JSON.parse(localStorage.getItem("USER"));
        let idToken = user.stsTokenManager.accessToken;
        Repository.patch(
          `${REQUEST_URL}/${requestId}?requestStatus=${requestStatus}`,
          null,
          {
            headers: { Authorization: `Bearer ${idToken}` },
          }
        )
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // update request status
    _updateChangeReqStatus(context, { requestId, driverId, targetVehicleId }) {
      return new Promise((resolve, reject) => {
        let user = JSON.parse(localStorage.getItem("USER"));
        let idToken = user.stsTokenManager.accessToken;
        Repository.patch(
          `${REQUEST_URL}/${requestId}?change?driverId=${driverId}&requestStatus=ACCEPTED&targetVehicleId=${targetVehicleId}`,
          null,
          {
            headers: { Authorization: `Bearer ${idToken}` },
          }
        )
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // get request by id
    _getRequestById(context, requestId) {
      return new Promise((resolve, reject) => {
        Repository.get(`${REQUEST_URL}/${requestId}`)
          .then((res) => {
            resolve(res.data.requestDetail);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
  },
};

import Repository from "./Repository";

const resource = "/requests";
const documentResource = "/document-requests";

export default {
  // Update document
  update(document) {
    return new Promise((resolve, reject) => {
      Repository.patch(resource, document)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Update document
  delete(vehicleDocId) {
    return new Promise((resolve, reject) => {
      Repository.delete(`${resource}?vehicleDocId=${vehicleDocId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },

  // Get documents
  async getRequests(
    fromDate,
    toDate,
    requestType,
    userId,
    page,
    requestStatus
  ) {
    return new Promise((resolve, reject) => {
      Repository.get(
        `${resource}?page=${page}&requestType=${requestType}&userId=${userId}&requestStatus=${requestStatus}` +
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
  // Get documents
  async getRequestsCount(fromDate, toDate, requestType, userId, requestStatus) {
    return new Promise((resolve, reject) => {
      Repository.get(
        `${resource}/count?requestType=${requestType}&userId=${userId}&requestStatus=${requestStatus}` +
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
  // update document status
  async updateStatus(requestId, requestStatus) {
    return new Promise((resolve, reject) => {
      Repository.patch(
        `${documentResource}/${requestId}?requestStatus=${requestStatus}`
      )
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // update document status
  async getRequestById(requestId) {
    return new Promise((resolve, reject) => {
      Repository.get(`${documentResource}/${requestId}`)
        .then((res) => {
          resolve(res.data.requestDetail);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
};

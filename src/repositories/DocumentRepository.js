import Repository from "./Repository";

const adminResource = "/admin";
const userResource = "/user-documents";
const vehicleResource = "/vehicles/documents";

export default {
  // Update document
  update(document, userId) {
    return new Promise((resolve, reject) => {
      Repository.put(`${adminResource}/user/${userId}/documents`, document)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Get document
  get(userId, option) {
    return new Promise((resolve, reject) => {
      Repository.get(`users/${userId}/user-documents?option=${option}`)
        .then((res) => {
          resolve(res.data.userDocuments);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Update document
  create(document, userId) {
    return new Promise((resolve, reject) => {
      Repository.post(`${adminResource}/user/${userId}/documents`, document)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Delete document
  delete(documentId) {
    return new Promise((resolve, reject) => {
      Repository.delete(
        `${adminResource}/documents?userDocumentId=${documentId}`
      )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // get user document by id
  getUserDocumentById(documentId) {
    return new Promise((resolve, reject) => {
      Repository.get(`${userResource}/${documentId}`)
        .then((res) => {
          resolve(res.data.userDocumentDetail);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // get vehicle document by id
  getVehicleDocumentById(documentId) {
    return new Promise((resolve, reject) => {
      Repository.get(`${vehicleResource}/${documentId}`)
        .then((res) => {
          resolve(res.data.vehicleDocument);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
};

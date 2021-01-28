import Repository from "../../repositories/Repository";
const ADMIN_URL = "/admin";
const USER_URL = "/user-documents";
const VEHICLE_URL = "/vehicles/documents";
export default {
  namespaced: true,
  state: {},
  mutations: {},

  actions: {
    // Update document
    _updateDocument(context, { document, userId }) {
      return new Promise((resolve, reject) => {
        Repository.put(`${ADMIN_URL}/user/${userId}/user-documents`, document)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            console.log(err);
            reject(err.response.data);
          });
      });
    },
    // Get documents
    _getDocuments(context, { userId, option }) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `users/${userId}/user-documents?option=${option}&documentStatus=VALID`
        )
          .then((res) => {
            resolve(res.data.userDocuments);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Create document
    _create(context, { document, userId }) {
      return new Promise((resolve, reject) => {
        Repository.post(`${ADMIN_URL}/user/${userId}/user-documents`, document)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    // Delete document
    _delete(context, documentId) {
      return new Promise((resolve, reject) => {
        Repository.delete(
          `${ADMIN_URL}/user-documents?userDocumentId=${documentId}`
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
    _getUserDocumentById(context, documentId) {
      return new Promise((resolve, reject) => {
        Repository.get(`${USER_URL}/${documentId}`)
          .then((res) => {
            resolve(res.data.userDocumentDetail);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // get vehicle document by id
    _getVehicleDocumentById(context, documentId) {
      return new Promise((resolve, reject) => {
        Repository.get(`${VEHICLE_URL}/${documentId}`)
          .then((res) => {
            resolve(res.data.vehicleDocument);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
  },
};

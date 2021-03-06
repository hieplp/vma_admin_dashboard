import Repository from "./Repository";

const resource = "/vehicles/documents";

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
  // Create document
  create(vehicleId, vehicleDocumentReq, roleId) {
    let request = {
      roleId: roleId,
      vehicleDocumentReq: vehicleDocumentReq,
      vehicleId: vehicleId,
    };
    console.log(request);
    return new Promise((resolve, reject) => {
      Repository.post(`${resource}`, request)
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
  async getDocuments(vehicleId) {
    return new Promise((resolve, reject) => {
      Repository.get(`${resource}?vehicleId=${vehicleId}`)
        .then((res) => {
          resolve(res.data.vehicleDocuments);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
};

import Repository from "./Repository";

const resource = "/contracts";

export default {
  updateUserStatusByUserId(userId, statusId) {
    return new Promise((resolve, reject) => {
      Repository.patch(`${resource}/${userId}?userStatusId=${statusId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Create contract
  create(contract) {
    return new Promise((resolve, reject) => {
      Repository.post(resource, contract)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Update contract
  update(contract) {
    console.log(contract);
    return new Promise((resolve, reject) => {
      Repository.patch(resource, contract)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Get contract list
  async get() {
    return new Promise((resolve, reject) => {
      Repository.get(resource)
        .then((res) => {
          resolve(res.data.contractList);
        })
        .catch((err) => {
          console.log(err);
          reject(err.response.data);
        });
    });
  },
  // Get contracts list
  async getDetail(contractId) {
    return new Promise((resolve, reject) => {
      Repository.get(`${resource}/${contractId}`)
        .then((res) => {
          resolve(res.data.contractDetail);
        })
        .catch((err) => {
          console.log(err);
          reject(err.response.data);
        });
    });
  },

  // Delete user
  delete(userId) {
    return new Promise((resolve, reject) => {
      Repository.delete(`${resource}?userId=${userId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
};

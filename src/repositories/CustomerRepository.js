import Repository from "./Repository";

const resource = "/customers";

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
  // Get detailed customer
  getDetailCustomer(customerId) {
    return new Promise((resolve, reject) => {
      Repository.get(`${resource}/${customerId}`)
        .then((res) => {
          resolve(res.data.customer);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Get customers list
  get(address, customerName, email, page, phoneNumber, searchStatusID) {
    return new Promise((resolve, reject) => {
      Repository.get(
        // `${resource}`
        `${resource}?address=${address}&customerName=${customerName}&email=${email}&page=${page}&phoneNumber=${phoneNumber}&isDeleted=${searchStatusID}`
      )
        .then((res) => {
          resolve(res.data.customerRes);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  getTotalCustomer(address, customerName, email, phoneNumber, searchStatusID) {
    return new Promise((resolve, reject) => {
      Repository.get(
        `${resource}/count?address=${address}&customerName=${customerName}&email=${email}&phoneNumber=${phoneNumber}&isDeleted=${searchStatusID}`
      )
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Create customer
  create(customer) {
    return new Promise((resolve, reject) => {
      Repository.post(resource, customer)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Update user
  update(customer) {
    return new Promise((resolve, reject) => {
      Repository.put(resource, customer)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Delete driver
  delete(customerId) {
    return new Promise((resolve, reject) => {
      Repository.delete(`${resource}?customerId=${customerId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
};

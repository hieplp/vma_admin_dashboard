import Repository from "./Repository";

const resource = "/users";

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
  // Create user
  create(user, roleId) {
    return new Promise((resolve, reject) => {
      Repository.post(`${resource}?roleId=${roleId}`, user)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Update user
  update(user) {
    return new Promise((resolve, reject) => {
      Repository.put(resource, user)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
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
  // get users dont have roleId
  getUserByRole(page, name, phoneNumber, userStatus, userId, roleId) {
    return new Promise((resolve, reject) => {
      Repository.get(
        `${resource}/roles/${roleId}?name=${name}&page=${page}&phoneNumber=${phoneNumber}&userStatus=${userStatus}&userId=${userId}`
      )
        .then((res) => {
          resolve(res.data.userRes);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // get users count dont have roleId
  getUserCountByRole(name, phoneNumber, userStatus, userId, roleId) {
    return new Promise((resolve, reject) => {
      Repository.get(
        `${resource}/roles/${roleId}/count?name=${name}&phoneNumber=${phoneNumber}&userStatus=${userStatus}&userId=${userId}`
      )
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // get users count dont have roleId
  addNewRoleForUser(userId, roleId) {
    return new Promise((resolve, reject) => {
      console.log(`${resource}/${userId}/roles?roleId=${roleId}`);
      Repository.patch(`${resource}/${userId}/roles?roleId=${roleId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          reject(err.response.data);
        });
    });
  },
};

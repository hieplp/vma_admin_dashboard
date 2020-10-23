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
};

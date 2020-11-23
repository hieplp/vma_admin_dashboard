import Repository from "../../repositories/Repository";
const USER_URL = "/users";
export default {
  namespaced: true,
  state: {
    users: [],
    usersCount: 0,
  },
  mutations: {
    // set users dont have role
    setUsers(state, data) {
      state.users = data;
    },
    // set users dont have role count
    setUsersCount(state, data) {
      state.usersCount = data;
    },
  },

  actions: {
    // Create user
    _create(context, { user, roleId }) {
      return new Promise((resolve, reject) => {
        Repository.post(`${USER_URL}?roleId=${roleId}`, user)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Update user
    _updateUser(context, user) {
      return new Promise((resolve, reject) => {
        Repository.put(USER_URL, user)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Delete user
    _delete(context, userId) {
      return new Promise((resolve, reject) => {
        Repository.delete(`${USER_URL}?userId=${userId}`)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // get users dont have roleId
    _getUsersByRole(
      context,
      { page, name, phoneNumber, userStatus, userId, roleId }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${USER_URL}/roles/${roleId}?name=${name}&page=${page}&phoneNumber=${phoneNumber}&userStatus=${userStatus}&userId=${userId}`
        )
          .then((res) => {
            context.commit("setUsers", res.data.userRes);
            resolve();
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // get users dont have roleId count
    _getUsersCountByRole(
      context,
      { name, phoneNumber, userStatus, userId, roleId }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${USER_URL}/roles/${roleId}/count?name=${name}&phoneNumber=${phoneNumber}&userStatus=${userStatus}&userId=${userId}`
        )
          .then((res) => {
            context.commit("setUsersCount", res.data);
            resolve();
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // add new role for user
    _addNewRoleForUser(context, { userId, roleId }) {
      return new Promise((resolve, reject) => {
        Repository.patch(`${USER_URL}/${userId}/roles?roleId=${roleId}`)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            console.log(err);
            reject(err.response.data);
          });
      });
    },
    // Get user roles
    _getUserRoles() {
      return new Promise((resolve, reject) => {
        let user = JSON.parse(localStorage.getItem("USER"));
        let token = {
          idToken: user.stsTokenManager.accessToken,
        };
        Repository.post(`${USER_URL}/role-token`, token)
          .then((res) => {
            resolve(res.roleList);
          })
          .catch((err) => {
            console.log(err);
            reject(err.response.data);
          });
      });
    },
    // Create client registration token
    _createClientRegistrationToken(context, { user, roleId }) {
      return new Promise((resolve, reject) => {
        Repository.post(`${USER_URL}?roleId=${roleId}`, user)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
  },
};

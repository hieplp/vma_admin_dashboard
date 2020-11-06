/* eslint-disable no-unused-vars */
import Repository from "./Repository";

const resource = "/user-status";

export default {
  async get() {
    let userStatus = require("../assets/json/user/driverStatus.json");
    return userStatus;
  },
};

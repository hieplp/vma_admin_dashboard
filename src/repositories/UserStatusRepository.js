import Repository from "./Repository";

const resource = "/user-status";

export default {
  async get() {
    try {
      const res = await Repository.get(`${resource}`);
      return res.data;
    } catch (ex) {
      console.log(ex);
    }
  },
};

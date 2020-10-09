import Repository from "./Repository";

const resource = "/drivers";

export default {
  get() {
    return Repository.get(`${resource}`);
  },
};

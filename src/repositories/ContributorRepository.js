import Repository from "./Repository";

const resource = "/contributors";

export default {
  get() {
    return Repository.get(`${resource}`);
  },
};

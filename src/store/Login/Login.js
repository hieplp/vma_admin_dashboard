export default {
  namespaced: true,
  state: {
    userId: null,
  },
  mutations: {
    setUserId(state, data) {
      state.userId = data;
    },
  },
  actions:{}
};

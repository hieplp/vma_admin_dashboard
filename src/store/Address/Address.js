export default {
  namespaced: true,
  state: {
    routes: [],
  },
  mutations: {
    // set routes
    setRoutes(state, data) {
      state.routes = data;
    },
  },

  actions: {
    _setRoute(context, data) {
      context.commit("setRoutes", data);
    },
  },
};

import Vue from "vue";
import Vuex from "vuex";

import Driver from "./Driver/Driver";
import User from "./User/User";
import Document from "./Document/Document";

Vue.use(Vuex);

export default new Vuex.Store({
  // state: {},
  // mutations: {},
  // actions: {},
  modules: {
    Driver: Driver,
    User: User,
    Document: Document,
  },
});

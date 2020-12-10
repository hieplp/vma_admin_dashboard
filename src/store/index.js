import Vue from "vue";
import Vuex from "vuex";

import Driver from "./Driver/Driver";
import User from "./User/User";
import Document from "./Document/Document";
import Contributor from "./Contributor/Contributor";
import Contract from "./Contract/Contract";
import Report from "./Report/Report";
import Vehicle from "./Vehicle/Vehicle";
import Request from "./Request/Request";
import Notification from "./Notification/Notification";
import Maintenance from "./Maintenance/Maintenance";
import Feedback from "./Feedback/Feedback";
import Address from "./Address/Address";

Vue.use(Vuex);

export default new Vuex.Store({
  // state: {},
  // mutations: {},
  // actions: {},
  modules: {
    Driver: Driver,
    User: User,
    Document: Document,
    Contributor: Contributor,
    Contract: Contract,
    Report: Report,
    Vehicle: Vehicle,
    Request: Request,
    Notification: Notification,
    Maintenance: Maintenance,
    Feedback: Feedback,
    Address: Address,
  },
});

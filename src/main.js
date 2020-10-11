import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Paginate from "vuejs-paginate";
import VModal from "vue-js-modal";
import VueConfirmDialog from "vue-confirm-dialog";

Vue.config.productionTip = false;

Vue.use(VModal);
Vue.use(VueConfirmDialog);

Vue.component("paginate", Paginate);
Vue.component("vue-confirm-dialog", VueConfirmDialog.default);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

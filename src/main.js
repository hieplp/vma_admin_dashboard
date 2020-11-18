import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Paginate from "vuejs-paginate";
import VModal from "vue-js-modal";
import VueConfirmDialog from "vue-confirm-dialog";
import VueSilentbox from "vue-silentbox";
import VueLazyLoad from "vue-lazyload";
import * as firebase from "firebase/app";
import "firebase/firestore";
import OtpInput from "@bachdgvn/vue-otp-input";
import * as VueGoogleMaps from "vue2-google-maps";
import VueExcelEditor from "vue-excel-editor";

Vue.config.productionTip = false;

Vue.use(VueExcelEditor);
Vue.use(VModal);
Vue.use(VueConfirmDialog);
Vue.use(VueSilentbox);
Vue.use(VueLazyLoad);
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyCTT8lvo8Jytt4ip0I1xpTdKoRF0XEY2dw",
    libraries: "places",
  },
});

Vue.component("v-otp-input", OtpInput);
Vue.component("paginate", Paginate);
Vue.component("vue-confirm-dialog", VueConfirmDialog.default);
new Vue({
  router,
  store,
  render: (h) => h(App),
  created() {
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      // apiKey: "AIzaSyAyKH2jS_Lz5B7sv6v35eaftt7xrEsLvuM",
      // authDomain: "vmafpt-651b7.firebaseapp.com",
      // databaseURL: "https://vmafpt-651b7.firebaseio.com",
      // projectId: "vmafpt-651b7",
      // storageBucket: "vmafpt-651b7.appspot.com",
      // messagingSenderId: "667875013519",
      // appId: "1:667875013519:web:3adcf4a59ed5b2122451fa",
      // measurementId: "G-YS7GFVN9WJ",

      apiKey: "AIzaSyAjxIE1tf-CwMwoINlKCDUEDfwlyQWc8F8",
      authDomain: "vma-fa20se28.firebaseapp.com",
      databaseURL: "https://vma-fa20se28.firebaseio.com",
      projectId: "vma-fa20se28",
      storageBucket: "vma-fa20se28.appspot.com",
      messagingSenderId: "25758894581",
      appId: "1:25758894581:web:6f294ed921302aa41fb8bc",
    };

    firebase.initializeApp(firebaseConfig);
  },
}).$mount("#app");

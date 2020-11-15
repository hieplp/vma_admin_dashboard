<template>
  <div id="app" class="container-scroller">
    <div v-if="isVisible">
      <TopMenu />
      <div class="container-fluid page-body-wrapper">
        <SideMenu />
        <div class="main-panel">
          <router-view />
        </div>
      </div>
    </div>
    <div v-else>
      <Login />
    </div>
  </div>
</template>

<script>
import TopMenu from "./components/TopMenu";
import SideMenu from "./components/SideMenu";
import Login from "./views/Login";

import "./assets/vendors/js/vendor.bundle.base.js";
import "./assets/js/off-canvas.js";
import "./assets/js/hoverable-collapse.js";
import "./assets/js/misc.js";

export default {
  name: "App",
  components: {
    TopMenu,
    SideMenu,
    Login,
  },
  watch: {
    $route: function(from, to) {
      if (to !== null && to.name === "Login") {
        window.location.reload();
        this.checkAuthUser();
      } else if (from !== null && from.name === "Login") {
        this.checkAuthUser();
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (next) {
        vm.nextRoute = next.name;
      }
    });
  },
  mounted() {
    this.isVisible = true;
  },
  data() {
    return {
      isVisible: false,
      timeReload: 0,
      nextRoute: null,
    };
  },
  methods: {
    checkAuthUser() {
      let user = JSON.parse(localStorage.getItem("USER"));
      if (user) {
        this.isVisible = true;
      } else {
        this.isVisible = false;
      }
    },
  },
};
</script>

<style>
@import "./assets/vendors/mdi/css/materialdesignicons.min.css";
</style>
<style>
@import "./assets/vendors/css/vendor.bundle.base.css";
</style>
<style>
@import "./assets/css/style1.css";
</style>

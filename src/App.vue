<template>
  <div id="app" class="container-scroller">
    <div v-if="true">
      <TopMenu />
      <div
        class="container-fluid page-body-wrapper"
        style="background-color: rgb(58, 3, 3)"
      >
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
};
</script>

<style>
@import "./assets/vendors/mdi/css/materialdesignicons.min.css";
</style>
<style>
@import "./assets/vendors/css/vendor.bundle.base.css";
</style>
<style>
@import "./assets/css/style.css";
</style>

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
      <!-- <router-view /> -->
      <Login />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
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
    // eslint-disable-next-line no-unused-vars
    $route: async function(from, to) {
      // await this.checkAuthUser();
      // if (
      //   to !== null &&
      //   (to.name === "Login" || to.name === "DefaultOverview")
      // ) {
      //   window.location.reload();
      // }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (next) {
        vm.nextRoute = next.name;
        vm.prevRoute = from;
      }
    });
  },
  async mounted() {
    // await this.checkAuthUser();
    this.isVisible = true;
  },
  data() {
    return {
      isVisible: true,
      timeReload: 0,
      nextRoute: null,
      prevRoute: null,
    };
  },
  methods: {
    // Map actions
    ...mapActions("User", ["_getUserRoles"]),
    // Check user valid
    async checkAuthUser() {
      await this._getUserRoles()
        .then((res) => {
          if (res) {
            if (this.isAdmin(res)) {
              this.isVisible = true;
            } else {
              this.isVisible = false;
            }
          }
        })
        .catch((err) => {
          if (err) {
            this.isVisible = false;
            if (
              (!this.prevRoute && this.$route.name !== "Login") ||
              (this.prevRoute && this.prevRoute.name !== "Login")
            ) {
              this.$router.push({
                name: "Login",
              });
            }
          }
        });
    },

    isAdmin(roles) {
      roles.forEach((role) => {
        if (role.roleId === 1) {
          return true;
        }
      });
      return false;
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
<style>
@import "./assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>

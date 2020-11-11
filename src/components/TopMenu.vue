<template>
  <nav
    class="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row"
  >
    <div
      class="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center"
    >
      <!-- <a class="navbar-brand brand-logo" href="../../index.html"
        ><i class="mdi mdi-car-connected"></i>VMA</a
      >
      <a class="navbar-brand brand-logo-mini" href="../../index.html"
        ><i class="mdi mdi-car-connected"></i
      ></a> -->
      <img
        class="navbar-brand brand-logo mt-3"
        src="../assets/images/logo(transparent).png"
      />
      <img
        class="navbar-brand brand-logo-mini"
        src="../assets/images/logo(transparent).png"
      />
    </div>

    <div class="navbar-menu-wrapper d-flex align-items-stretch">
      <button
        class="navbar-toggler navbar-toggler align-self-center"
        type="button"
        data-toggle="minimize"
      >
        <span class="mdi mdi-menu"></span>
      </button>

      <ul class="navbar-nav navbar-nav-right">
        <li class="nav-item dropdown">
          <a
            class="nav-link count-indicator dropdown-toggle"
            id="notificationDropdown"
            href="#"
            data-toggle="dropdown"
          >
            <i class="mdi mdi-bell-outline"></i>
            <span class="count-symbol bg-danger"></span>
          </a>
          <div
            class="dropdown-menu dropdown-menu-right navbar-dropdown preview-list"
            aria-labelledby="notificationDropdown"
          >
            <h6 class="p-3 mb-0">Notifications</h6>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item preview-item">
              <div class="preview-thumbnail">
                <div class="preview-icon bg-success">
                  <i class="mdi mdi-calendar"></i>
                </div>
              </div>
              <div
                class="preview-item-content d-flex align-items-start flex-column justify-content-center"
              >
                <h6 class="preview-subject font-weight-normal mb-1">
                  Event today
                </h6>
                <p class="text-gray ellipsis mb-0">
                  Just a reminder that you have an event today
                </p>
              </div>
            </a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item preview-item">
              <div class="preview-thumbnail">
                <div class="preview-icon bg-warning">
                  <i class="mdi mdi-settings"></i>
                </div>
              </div>
              <div
                class="preview-item-content d-flex align-items-start flex-column justify-content-center"
              >
                <h6 class="preview-subject font-weight-normal mb-1">
                  Settings
                </h6>
                <p class="text-gray ellipsis mb-0">Update dashboard</p>
              </div>
            </a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item preview-item">
              <div class="preview-thumbnail">
                <div class="preview-icon bg-info">
                  <i class="mdi mdi-link-variant"></i>
                </div>
              </div>
              <div
                class="preview-item-content d-flex align-items-start flex-column justify-content-center"
              >
                <h6 class="preview-subject font-weight-normal mb-1">
                  Launch Admin
                </h6>
                <p class="text-gray ellipsis mb-0">New admin wow!</p>
              </div>
            </a>
            <div class="dropdown-divider"></div>
            <h6 class="p-3 mb-0 text-center">See all notifications</h6>
          </div>
        </li>
        <li class="nav-item nav-profile dropdown">
          <a
            class="nav-link dropdown-toggle"
            id="profileDropdown"
            href="#"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            <div class="nav-profile-img">
              <img :src="imageLink" alt="image" />
              <span class="availability-status online"></span>
            </div>
            <div class="nav-profile-text">
              <p class="mb-1 text-black">{{ this.userName }}</p>
            </div>
          </a>
          <div
            class="dropdown-menu navbar-dropdown"
            aria-labelledby="profileDropdown"
          >
            <a class="dropdown-item" href="#">
              <i class="mdi mdi-cached mr-2 text-success"></i> Activity Log
            </a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" @click="signOut()">
              <i class="mdi mdi-logout mr-2 text-primary"></i> Signout
            </a>
          </div>
        </li>
      </ul>

      <button
        class="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
        type="button"
        data-toggle="offcanvas"
      >
        <span class="mdi mdi-menu"></span>
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  props: {},
  mounted() {
    this.initAuthUser();
  },
  data() {
    return {
      userName: "",
      imageLink: "",
    };
  },
  methods: {
    // Sign out
    signOut() {
      localStorage.removeItem("userId");
      this.$router.push({
        name: "Login",
      });
    },
    // Init data for user
    initAuthUser() {
      let user = JSON.parse(localStorage.getItem("userId"));
      console.log(user);
      this.userName = user.displayName;
      this.imageLink = user.photoURL;
    },
  },
};
</script>
<style scoped>
.brand-logo {
  height: 115% !important;
  width: 60% !important;
}
.brand-logo-mini {
  width: 80% !important;
}
</style>

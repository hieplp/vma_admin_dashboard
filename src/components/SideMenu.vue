<template>
  <!-- partial:../../partials/_sidebar.html -->
  <nav class="sidebar sidebar-offcanvas" id="sidebar">
    <ul class="nav">
      <li class="nav-item nav-profile">
        <a href="#" class="nav-link">
          <div class="nav-profile-image">
            <img :src="imageLink" alt="profile" />
            <span class="login-status online"></span>
            <!--change to offline or busy as needed-->
          </div>
          <div class="nav-profile-text d-flex flex-column">
            <span class="font-weight-bold">{{ this.userName }}</span>
            <!-- <span class="text-secondary text-small">Project Manager</span> -->
          </div>
          <!-- <i class="mdi mdi-bookmark-check text-success nav-profile-badge"></i> -->
        </a>
      </li>
      <!-- Overview -->
      <li
        class="nav-item"
        :class="{
          active: this.$route.name.includes('Overview') ? true : false,
        }"
      >
        <router-link class="nav-link" to="/overview">
          <span class="menu-title">Overview</span>
          <i class="mdi mdi-television-guide menu-icon"></i>
        </router-link>
      </li>
      <!-- Drivers -->
      <li
        class="nav-item"
        :class="{
          active: this.$route.name.includes('Driver') ? true : false,
        }"
      >
        <a
          class="nav-link"
          data-toggle="collapse"
          href="#driver"
          aria-expanded="false"
          aria-controls="driver"
        >
          <span class="menu-title">Drivers</span>
          <i class="menu-arrow"></i>
          <i class="mdi mdi-account-outline menu-icon"></i>
        </a>
        <div class="collapse" id="driver">
          <ul class="nav flex-column sub-menu">
            <li class="nav-item">
              <router-link to="/drivers/overview" class="nav-link">
                Overview
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/drivers" class="nav-link">
                Drivers List
              </router-link>
            </li>
          </ul>
        </div>
      </li>
      <!-- Contributor -->
      <li
        class="nav-item"
        :class="{
          active: this.$route.name.includes('Contributor') ? true : false,
        }"
      >
        <a
          class="nav-link"
          data-toggle="collapse"
          href="#contributor"
          aria-expanded="false"
          aria-controls="contributor"
        >
          <span class="menu-title">Contributors</span>
          <i class="menu-arrow"></i>
          <i class="mdi mdi-account-multiple-outline menu-icon"></i>
        </a>
        <div class="collapse" id="contributor">
          <ul class="nav flex-column sub-menu">
            <li class="nav-item">
              <router-link to="/contributors/overview" class="nav-link">
                Overview
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/contributors" class="nav-link">
                Contributors List
              </router-link>
            </li>
          </ul>
        </div>
      </li>
      <!-- Vehicle -->
      <li
        class="nav-item"
        :class="{
          active:
            this.$route.name.includes('Vehicle') &&
            !this.$route.name.includes('Request')
              ? true
              : false,
        }"
      >
        <a
          class="nav-link"
          data-toggle="collapse"
          href="#vehicles"
          aria-expanded="false"
          aria-controls="vehicles"
        >
          <span class="menu-title">Vehicles</span>
          <i class="menu-arrow"></i>
          <i class="mdi mdi-car menu-icon"></i>
        </a>
        <div class="collapse" id="vehicles">
          <ul class="nav flex-column sub-menu">
            <li class="nav-item">
              <router-link to="/vehicles/overview" class="nav-link">
                Overview
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/vehicles" class="nav-link">
                Vehicles List
              </router-link>
            </li>
          </ul>
        </div>
      </li>
      <!-- Contracts -->
      <li
        class="nav-item"
        :class="{
          active: this.$route.name.includes('Contract') ? true : false,
        }"
      >
        <a
          class="nav-link"
          data-toggle="collapse"
          href="#contracts"
          aria-expanded="false"
          aria-controls="contracts"
        >
          <span class="menu-title">Contracts</span>
          <i class="menu-arrow"></i>
          <i class="mdi mdi-flag-checkered menu-icon"></i>
        </a>
        <div class="collapse" id="contracts">
          <ul class="nav flex-column sub-menu">
            <li class="nav-item">
              <router-link to="/contracts" class="nav-link">
                Contracts
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/contract-canlendar" class="nav-link">
                Canlendar
              </router-link>
            </li>
          </ul>
        </div>
      </li>
      <!-- Customers -->
      <li
        class="nav-item"
        :class="{
          active: this.$route.name.includes('Customer') ? true : false,
        }"
      >
        <router-link to="/customers" class="nav-link">
          <span class="menu-title">Customers</span>
          <i class="mdi mdi-human-male-female menu-icon"></i>
        </router-link>
      </li>
      <!-- Requests -->
      <li
        class="nav-item"
        :class="{
          active: this.$route.name.includes('Request') ? true : false,
        }"
      >
        <a
          class="nav-link"
          data-toggle="collapse"
          href="#requests"
          aria-expanded="false"
          aria-controls="requests"
        >
          <span class="menu-title">Requests</span>
          <i class="menu-arrow"></i>
          <i class="mdi mdi-file-chart menu-icon"></i>
        </a>
        <div class="collapse" id="requests">
          <ul class="nav flex-column sub-menu">
            <li class="nav-item">
              <router-link to="/requests/documents/vehicles" class="nav-link ">
                Vehicle Documents
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/requests/documents/users" class="nav-link ">
                User Documents
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/requests/vehicles" class="nav-link ">
                Vehicles
              </router-link>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  data() {
    return {
      isRegistrationsVisible: false,
      isContractsVisible: false,
      isVehiclesVisible: false,
      isDriversVisible: false,
      prevRoute: null,
      userName: "",
      imageLink: "",
    };
  },

  mounted() {
    if (this.prevRoute !== null && this.prevRoute.name === "Login") {
      window.location.reload();
    }
    this.initAuthUser();
  },
  methods: {
    setSideMenuActive() {
      document.getElementById(this.$route.name).className += " active";
    },
    // Init data for user
    initAuthUser() {
      let user = JSON.parse(localStorage.getItem("USER"));
      console.log(user);
      this.userName = user.displayName;
      this.imageLink = user.photoURL;
    },
  },
};
</script>
<style scoped>
.scroll {
  white-space: nowrap;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  max-height: 100vh;
}
.nav-link:hover {
  cursor: pointer;
}
.sub-menu-title:hover > i {
  color: #047edf !important;
}
.sub-menu-title i {
  font-size: 20px !important;
  color: #74777a !important;
}
.sub-menu-title {
  margin-left: 20%;
  font-weight: 300;
}

.sub-menu-title span {
  font-size: 16px !important;
}
.nav-profile-text {
  font-size: 15px;
}
.fixed {
  position: fixed;
}
.sidebar-offcanvas {
  /* position: fixed; */
}
</style>

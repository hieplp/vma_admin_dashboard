<template>
  <!-- partial:../../partials/_sidebar.html -->
  <nav class="sidebar sidebar-offcanvas" id="sidebar">
    <ul class="nav nav-item custom-nav" id="sidebarNav">
      <li class="nav-item nav-profile">
        <a href="#" class="nav-link">
          <div class="nav-profile-image">
            <img src="../assets/images/faces/face1.jpg" alt="profile" />
            <!-- <span class="login-status online"></span> -->
            <!--change to offline or busy as needed-->
          </div>
          <div class="nav-profile-text d-flex flex-column">
            <span class="font-weight-bold mb-2">David Grey. H</span>
            <span class="text-secondary text-small">Project Manager</span>
          </div>
        </a>
      </li>

      <!-- Sidebar item -->
      <li
        class="nav-item"
        id="Overview"
        v-bind:class="{
          active: this.$route.name === 'Overview' ? true : false,
        }"
      >
        <router-link to="/overview" class="nav-link">
          <i class="mdi mdi-television-guide menu-icon"></i>
          <span class="menu-title">Overview</span>
        </router-link>
      </li>
      <li
        class="nav-item"
        id="Drivers"
        v-bind:class="{
          active:
            this.$route.name.includes('Driver') &&
            !this.$route.name.includes('Registration')
              ? true
              : false,
        }"
      >
        <router-link to="/drivers" class="nav-link">
          <i class="mdi mdi-account-outline menu-icon"></i>
          <span class="menu-title">Drivers</span>
        </router-link>
      </li>
      <li
        class="nav-item"
        id="Contributors"
        v-bind:class="{
          active: this.$route.name.includes('Contributor') ? true : false,
        }"
      >
        <router-link to="/contributors" class="nav-link">
          <i class="mdi mdi-account-multiple-outline menu-icon"></i>
          <span class="menu-title">Contributors</span>
        </router-link>
      </li>
      <li
        class="nav-item"
        id="Vehicles"
        v-bind:class="{
          active: this.$route.name.includes('Vehicle') ? true : false,
        }"
      >
        <router-link to="/vehicles" class="nav-link">
          <i class="mdi mdi-car menu-icon"></i>
          <span class="menu-title">Vehicles</span>
        </router-link>
      </li>
      <li
        class="nav-item"
        id="Contracts"
        v-bind:class="{
          active: this.$route.name === 'Contracts' ? true : false,
        }"
      >
        <router-link to="/contracts" class="nav-link">
          <i class="mdi mdi-flag-checkered menu-icon"></i>
          <span class="menu-title">Contracts</span>
        </router-link>
      </li>
      <li
        class="nav-item"
        id="Customers"
        v-bind:class="{
          active: this.$route.name === 'Customers' ? true : false,
        }"
      >
        <router-link to="/customers" class="nav-link">
          <i class="mdi mdi-human-male-female menu-icon"></i>
          <span class="menu-title">Customers</span>
        </router-link>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">
          <i class="mdi mdi-clipboard-alert menu-icon"></i>
          <span class="menu-title">Feeback & <br />Service</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">
          <i class="mdi mdi-file-chart menu-icon"></i>
          <span class="menu-title">Reports</span>
        </a>
      </li>

      <li class="nav-item">
        <a class="nav-link" href="#">
          <i class="mdi mdi-settings menu-icon"></i>
          <span class="menu-title">Setting</span>
        </a>
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
      prevRoute: null,
    };
  },
  mounted() {
    if (this.prevRoute !== null && this.prevRoute.name === "Login") {
      window.location.reload();
    }
  },
  methods: {
    setSideMenuActive() {
      document.getElementById(this.$route.name).className += " active";
    },
  },
};
</script>
<style>
.nav-link:hover {
  cursor: pointer;
}
.sub-menu-title i {
  font-size: 20px !important;
  color: #74777a !important;
}
.sub-menu-title {
  margin-left: 25px;
  font-weight: 600;
}

.sub-menu-title span {
  font-size: 16px !important;
}
</style>

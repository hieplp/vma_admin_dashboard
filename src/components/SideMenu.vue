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
        <router-link to="/" class="nav-link">
          <i class="mdi mdi-television-guide menu-icon"></i>
          <span class="menu-title">Overview</span>
        </router-link>
      </li>
      <li
        class="nav-item"
        id="Drivers"
        v-bind:class="{ active: this.$route.name === 'Drivers' ? true : false }"
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
          active: this.$route.name === 'Contributors' ? true : false,
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
          active: this.$route.name === 'Vehicles' ? true : false,
        }"
      >
        <router-link to="/vehicles" class="nav-link">
          <i class="mdi mdi-car menu-icon"></i>
          <span class="menu-title">Vehicles</span>
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
  props: {},
  mounted() {},
  methods: {
    setSideMenuActive() {
      document.getElementById(this.$route.name).className += " active";
      console.log(document.getElementById(this.$route.name).className);
    },
  },
};
</script>

<template>
  <nav class="sidebar sidebar-offcanvas" id="sidebar">
    <ul class="nav nav-item custom-nav scroll" id="sidebarNav">
      <li class="nav-item nav-profile">
        <a href="#" class="nav-link">
          <div class="nav-profile-image">
            <img :src="imageLink" alt="profile" />
            <!-- <span class="login-status online"></span> -->
            <!--change to offline or busy as needed-->
          </div>
          <div class="nav-profile-text d-flex flex-column">
            <span class="font-weight-bold">{{ this.userName }}</span>
          </div>
        </a>
      </li>

      <!-- Sidebar item -->
      <li
        class="nav-item"
        id="Overview"
        v-bind:class="{
          active: this.$route.name.includes('Overview') ? true : false,
        }"
      >
        <router-link to="/overview" class="nav-link">
          <i class="mdi mdi-television-guide menu-icon"></i>
          <span class="menu-title">Overview</span>
        </router-link>
      </li>
      <!-- Drivers -->
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
        <a @click="isDriversVisible = !isDriversVisible" class="nav-link">
          <i class="mdi mdi-account-outline menu-icon"></i>
          <span class="menu-title">Drivers</span>
        </a>
      </li>
      <li class="nav-item" v-if="isDriversVisible" id="Drivers">
        <router-link to="/drivers/overview" class="nav-link sub-menu-title">
          <i class="mdi mdi-chart-areaspline menu-icon"></i>
          <span class="menu-title">Overview</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="isDriversVisible" id="Drivers">
        <router-link to="/drivers" class="nav-link sub-menu-title">
          <i class="mdi mdi-account-outline menu-icon"></i>
          <span class="menu-title">Drivers</span>
        </router-link>
      </li>
      <!-- Cotributor -->
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
      <!-- Vehicle -->
      <li
        class="nav-item"
        id="Vehicles"
        v-bind:class="{
          active:
            this.$route.name.includes('Vehicle') &&
            !this.$route.name.includes('Request')
              ? true
              : false,
        }"
      >
        <a class="nav-link" @click="isVehiclesVisible = !isVehiclesVisible">
          <i class="mdi mdi-car menu-icon"></i>
          <span class="menu-title">Vehicles</span>
        </a>
      </li>
      <li class="nav-item" v-if="isVehiclesVisible" id="Vehicles">
        <router-link to="/vehicles/overview" class="nav-link sub-menu-title">
          <i class="mdi mdi-chart-areaspline menu-icon"></i>
          <span class="menu-title">Overview</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="isVehiclesVisible" id="Vehicles">
        <router-link to="/vehicles" class="nav-link sub-menu-title">
          <i class="mdi mdi-car menu-icon"></i>
          <span class="menu-title">Vehicles</span>
        </router-link>
      </li>
      <!-- Contract -->
      <li
        class="nav-item"
        id="Contracts"
        v-bind:class="{
          active: this.$route.name.includes('Contract') ? true : false,
        }"
      >
        <a
          class="nav-link"
          data-toggle="collapse"
          @click="isContractsVisible = !isContractsVisible"
        >
          <i class="mdi mdi-flag-checkered menu-icon"></i>
          <span class="menu-title">Contracts</span>
        </a>
      </li>
      <li class="nav-item" v-if="isContractsVisible" id="Contracts">
        <router-link to="/contracts" class="nav-link sub-menu-title">
          <i class="mdi mdi-flag-checkered menu-icon"></i>
          <span class="menu-title">Contracts</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="isContractsVisible" id="Contracts">
        <router-link to="/contract-canlendar" class="nav-link sub-menu-title">
          <i class="mdi mdi-calendar-clock menu-icon"></i>
          <span class="menu-title">Canlendar</span>
        </router-link>
      </li>
      <!-- Customer -->
      <li
        class="nav-item"
        id="Customers"
        v-bind:class="{
          active: this.$route.name.includes('Customer') ? true : false,
        }"
      >
        <router-link to="/customers" class="nav-link">
          <i class="mdi mdi-human-male-female menu-icon"></i>
          <span class="menu-title">Customers</span>
        </router-link>
      </li>

      <!-- Requests -->
      <li
        class="nav-item"
        v-bind:class="{
          active: this.$route.name.includes('Request') ? true : false,
        }"
      >
        <a
          class="nav-link"
          data-toggle="collapse"
          @click="isRegistrationsVisible = !isRegistrationsVisible"
          href="#"
        >
          <i class="mdi mdi-file-chart menu-icon"></i>
          <span class="menu-title">Request</span>
        </a>
      </li>
      <li class="nav-item" v-if="isRegistrationsVisible" id="Registrations">
        <router-link
          to="/requests/documents/vehicles"
          class="nav-link sub-menu-title"
        >
          <i class="mdi mdi-car menu-icon mr-3" />
          <span class="menu-title">Vehicle Documents</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="isRegistrationsVisible">
        <router-link
          to="/requests/documents/users"
          class="nav-link sub-menu-title"
        >
          <i class="mdi mdi-account-multiple-outline mr-3" />
          <span class="menu-title">User Documents</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="isRegistrationsVisible">
        <router-link to="/requests/vehicles" class="nav-link sub-menu-title">
          <i class="mdi mdi-car menu-icon mr-3" />
          <span class="menu-title">Vehicles</span>
        </router-link>
      </li>
      <!-- <li class="nav-item">
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
      </li> -->
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
      let user = JSON.parse(localStorage.getItem("userId"));
      console.log(user);
      this.userName = user.displayName;
      this.imageLink = user.photoURL;
    },
  },
};
</script>
<style>
.scroll {
  white-space: nowrap;
  overflow-y: auto !important;
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
  margin-left: 25px;
  font-weight: 500;
}

.sub-menu-title span {
  font-size: 16px !important;
}
.nav-profile-text {
  font-size: 15px;
}
</style>

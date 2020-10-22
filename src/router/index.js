import Vue from "vue";
import VueRouter from "vue-router";
import Overview from "../views/Overview.vue";
import Drivers from "../views/Drivers.vue";
import Contributors from "../views/Contributors.vue";
import Vehicles from "../views/Vehicles.vue";
import DriverDetail from "../views/DriverDetail.vue";
import ContributorDetail from "../views/ContributorDetail.vue";
import CreateDriver from "../views/CreateDriver.vue";
import UpdateDriver from "../views/UpdateDriver.vue";
import DriverRegistrations from "../views/DriverRegistrations.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Overview",
    component: Overview,
  },
  {
    path: "/drivers",
    name: "Drivers",
    component: Drivers,
  },
  {
    path: "/drivers/:userId",
    name: "DriverDetail",
    component: DriverDetail,
  },
  {
    path: "/create-driver",
    name: "CreateDriver",
    component: CreateDriver,
  },
  {
    path: "/update-driver/:userId",
    name: "UpdateDriver",
    component: UpdateDriver,
  },
  {
    path: "/contributors",
    name: "Contributors",
    component: Contributors,
  },
  {
    path: "/contributors/:userId",
    name: "ContributorDetail",
    component: ContributorDetail,
  },
  {
    path: "/vehicles",
    name: "Vehicles",
    component: Vehicles,
  },
  {
    path: "/driver-registrations",
    name: "Driver Registrations",
    component: DriverRegistrations,
  },
];

const router = new VueRouter({
  routes,
  scrollBehavior() {
    document.getElementById("app").scrollIntoView();
  },
});

export default router;

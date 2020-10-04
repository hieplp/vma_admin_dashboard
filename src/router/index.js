import Vue from "vue";
import VueRouter from "vue-router";
import Overview from "../views/Overview.vue";
import Drivers from "../views/Drivers.vue";
import Contributors from "../views/Contributors.vue";
import Vehicles from "../views/Vehicles.vue";

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
    path: "/contributors",
    name: "Contributors",
    component: Contributors,
  },
  {
    path: "/vehicles",
    name: "Vehicles",
    component: Vehicles,
  },
];

const router = new VueRouter({
  routes,
});

export default router;

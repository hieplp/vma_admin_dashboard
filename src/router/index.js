import Vue from "vue";
import VueRouter from "vue-router";
import Overview from "../views/Overview.vue";
import Drivers from "../views/Drivers.vue";

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
];

const router = new VueRouter({
  routes,
});

export default router;

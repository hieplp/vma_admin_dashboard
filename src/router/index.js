import Vue from "vue";
import VueRouter from "vue-router";
import Overview from "../views/Overview.vue";
import Drivers from "../views/drivers/Drivers.vue";
import Contributors from "../views/Contributors.vue";
import Vehicles from "../views/Vehicles.vue";
import DriverDetail from "../views/drivers/DriverDetail.vue";
import ContributorDetail from "../views/ContributorDetail.vue";
import CreateDriver from "../views/drivers/CreateDriver copy.vue";
// import CreateDriver from "../views/drivers/CreateDriver.vue";
import UpdateDriver from "../views/drivers/UpdateDriver.vue";
import DriverRegistrations from "../views/DriverRegistrations.vue";
import Contracts from "../views/contracts/Contracts.vue";
import CreateContract from "../views/contracts/CreateContract.vue";
import Customers from "../views/customers/Customers.vue";
import CreateCustomer from "../views/customers/CreateCustomer.vue";
import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Default",
    component: Overview,
  },
  {
    path: "/overview",
    name: "Overview",
    component: Overview,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  // {
  //   path: "/login",
  //   name: "Login",
  //   component: Login,
  // },
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
  {
    path: "/contracts",
    name: "Contracts",
    component: Contracts,
  },
  {
    path: "/create-contract",
    name: "CreateContract",
    component: CreateContract,
  },
  {
    path: "/customers",
    name: "Customers",
    component: Customers,
  },
  {
    path: "/create-customer",
    name: "CreateCustomer",
    component: CreateCustomer,
  },
];

const router = new VueRouter({
  routes,
  scrollBehavior() {
    document.getElementById("app").scrollIntoView();
  },
});

export default router;

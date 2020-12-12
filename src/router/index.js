import Vue from "vue";
import VueRouter from "vue-router";
import Overview from "../views/Overview.vue";
// Drivers
import CreateDriver from "../views/drivers/CreateDriver.vue";
import UpdateDriver from "../views/drivers/UpdateDriver.vue";
import DriverDetail from "../views/drivers/DriverDetail.vue";
import Drivers from "../views/drivers/Drivers.vue";
import DriversOverview from "../views/drivers/DriversOverview.vue";
import PromoteDrivers from "../views/drivers/PromoteDrivers.vue";
import AssignedDriversHistory from "../views/drivers/AssignedDriversHistory.vue";
// Contributors
import Contributors from "../views/contributors/Contributors.vue";
import CreateContributor from "../views/contributors/CreateContributor.vue";
import ContributorDetail from "../views/contributors/ContributorDetail.vue";
import UpdateContributor from "../views/contributors/UpdateContributor.vue";
import ContributorsOverview from "../views/contributors/ContributorsOverview.vue";

import DriverRegistrations from "../views/DriverRegistrations.vue";
// Contracts
import Contracts from "../views/contracts/Contracts.vue";
import ContractCanlendar from "../views/contracts/ContractCanlendar.vue";
import CreateContract from "../views/contracts/CreateContract.vue";
import UpdateContract from "../views/contracts/UpdateContract.vue";
import ContractDetail from "../views/contracts/ContractDetail.vue";
import AssignVehiclesContract from "../views/contracts/vehicles/AssignVehiclesContract.vue";
import PassengerList from "../views/contracts/passengers/PassengerList.vue"; // Passenger list

// Customer
import Customers from "../views/customers/Customers.vue";
import CreateCustomer from "../views/customers/CreateCustomer.vue";
import CustomerDetail from "../views/customers/CustomerDetail.vue";
import UpdateCustomer from "../views/customers/UpdateCustomer.vue";

// Vehicle
import Vehicles from "../views/vehicles/Vehicles.vue";
import CreateVehicle from "../views/vehicles/CreateVehicle.vue";
import VehicleDetail from "../views/vehicles/VehicleDetail.vue";
import UpdateVehicle from "../views/vehicles/UpdateVehicle.vue";
import VehicleOverview from "../views/vehicles/VehicleOverview.vue";
// Vehicle contracts
import CreateVehicleContract from "../views/contracts/vehicles/CreateVehicleContract.vue";

// Maintenance
import Maintenances from "../views/maintenance/Maintenances.vue";
import CreateMaintenance from "../views/maintenance/CreateMaintenance.vue";
import UpdateMaintenance from "../views/maintenance/UpdateMaintenance.vue";
import MaintenanceDetail from "../views/maintenance/MaintenanceDetail.vue";
// // Contributor vehicles
// import ContributedVehicles from "../views/vehicles/contributor/Vehicles.vue";

// Assign vehicles
import AssignedVehicles from "../views/vehicles/assgin/AssignedVehicles.vue";
import AssignedVehiclesHistory from "../views/vehicles/assgin/AssignedVehiclesHistory.vue";

// Document vehicle requests
import VehicleDocumentRequests from "../views/requests/VehicleDocumentRequests.vue";
import VehicleDocumentRequestDetail from "../views/requests/VehicleDocumentRequestDetail.vue";
// Vehicle requests
import VehicleRequests from "../views/requests/VehicleRequests.vue";
import ChangeVehicleRequest from "../views/requests/vehicle/ChangeVehicleRequest.vue";
// Document user requests
import UserDocumentRequests from "../views/requests/UserDocumentRequests.vue";
import UseDocumentRequestDetail from "../views/requests/UseDocumentRequestDetail.vue";
// Report
import VehiclesReport from "../views/reports/VehiclesReport";
import ScheduleReport from "../views/reports/ScheduleReport";
import ContractReport from "../views/reports/ContractReport";
// Feedback
import Feedbacks from "../views/feedback/Feedbacks.vue";
// DriverIncomes
import DriverIncomes from "../views/drivers/DriverIncomes";

import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "DefaultOverview",
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

  // Driver
  {
    path: "/drivers",
    name: "Drivers",
    component: Drivers,
  },
  {
    path: "/drivers/overview",
    name: "DriverStatistic",
    component: DriversOverview,
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
    path: "/promote-drivers/:roleId",
    name: "PromoteDrivers",
    component: PromoteDrivers,
  },
  // Assigned drivers history
  {
    path: "/vehicles/:vehicleId/drivers",
    name: "AssignedDriversHistory",
    component: AssignedDriversHistory,
  },
  // Contributors
  {
    path: "/contributors",
    name: "Contributors",
    component: Contributors,
  },
  {
    path: "/contributors/overview",
    name: "ContributorsOverview",
    component: ContributorsOverview,
  },
  {
    path: "/contributors/:userId",
    name: "ContributorDetail",
    component: ContributorDetail,
  },
  {
    path: "/update-contributor/:userId",
    name: "UpdateContributor",
    component: UpdateContributor,
  },
  {
    path: "/create-contributor",
    name: "CreateContributor",
    component: CreateContributor,
  },

  {
    path: "/driver-registrations",
    name: "Driver Registrations",
    component: DriverRegistrations,
  },
  // Contract
  {
    path: "/contracts",
    name: "Contracts",
    component: Contracts,
  },
  {
    path: "/contracts/vehicles",
    name: "AssignVehiclesContract",
    component: AssignVehiclesContract,
  },
  {
    path: "/contract-canlendar",
    name: "ContractCanlendar",
    component: ContractCanlendar,
  },
  {
    path: "/update-contract/:contractId",
    name: "UpdateContract",
    component: UpdateContract,
  },
  {
    path: "/contracts/:contractId",
    name: "ContractDetail",
    component: ContractDetail,
  },
  {
    path: "/create-contract",
    name: "CreateContract",
    component: CreateContract,
  },
  // Passenger
  {
    path: "/contracts/vehicles/passenger/:contractVehicleId ",
    name: "PassengerList",
    component: PassengerList,
  },
  // Customer
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
  {
    path: "/customers/:customerId",
    name: "CustomerDetail",
    component: CustomerDetail,
  },
  {
    path: "/update-customer/:customerId",
    name: "UpdateCustomer",
    component: UpdateCustomer,
  },
  // Vehicle
  {
    path: "/vehicles",
    name: "Vehicles",
    component: Vehicles,
  },
  {
    path: "/vehicles/overview",
    name: "VehicleStatistic",
    component: VehicleOverview,
  },
  {
    path: "/create-vehicle",
    name: "CreateVehicle",
    component: CreateVehicle,
  },
  {
    path: "/vehicles/:vehicleId",
    name: "VehicleDetail",
    component: VehicleDetail,
  },
  {
    path: "/update-vehicle/:vehicleId",
    name: "UpdateVehicle",
    component: UpdateVehicle,
  },
  {
    path: "/create-vehicle-contract",
    name: "CreateVehicleContract",
    component: CreateVehicleContract,
  },
  // Maintenances
  {
    path: "/maintenances",
    name: "Maintenances",
    component: Maintenances,
  },
  {
    path: "/maintenances/:maintenanceId",
    name: "MaintenanceDetail",
    component: MaintenanceDetail,
  },
  {
    path: "/create-maintenance",
    name: "CreateMaintenance",
    component: CreateMaintenance,
  },
  {
    path: "/update-maintenance/:maintenanceId",
    name: "UpdateMaintenance",
    component: UpdateMaintenance,
  },
  // // Contributor vehicle list
  // {
  //   path: "/vehicles/contributor",
  //   name: "ContributedVehicles",
  //   component: ContributedVehicles,
  // },
  // Assign vehicle
  {
    path: "/assign-vehicles",
    name: "AssignedVehicles",
    component: AssignedVehicles,
  },
  {
    path: "/assign-vehicles/history/:driverId",
    name: "AssignedVehiclesHistory",
    component: AssignedVehiclesHistory,
  },
  // vehicle document request
  {
    path: "/requests/documents/vehicles",
    name: "VehicleDocumentRequests",
    component: VehicleDocumentRequests,
  },
  {
    path: "/requests/documents/vehicles/:requestId",
    name: "VehicleDocumentRequestDetail",
    component: VehicleDocumentRequestDetail,
  },
  // Vehicle request
  {
    path: "/requests/vehicles",
    name: "VehicleRequests",
    component: VehicleRequests,
  },
  {
    path: "/requests/vehicles/change/:requestId",
    name: "ChangeVehicleRequest",
    component: ChangeVehicleRequest,
  },
  // User document request
  {
    path: "/requests/documents/users",
    name: "UserDocumentRequests",
    component: UserDocumentRequests,
  },
  {
    path: "/requests/documents/users/:requestId",
    name: "UseDocumentRequestDetail",
    component: UseDocumentRequestDetail,
  },
  // Vehicles reports
  {
    path: "/reports/vehicles",
    name: "VehiclesReport",
    component: VehiclesReport,
  },
  // Vehicles reports
  {
    path: "/reports/schedule",
    name: "ScheduleReport",
    component: ScheduleReport,
  },
  // Contracts reports
  {
    path: "/reports/contracts",
    name: "ContractReport",
    component: ContractReport,
  },
  // Contracts reports
  {
    path: "/feedbacks/:driverId",
    name: "Feedbacks",
    component: Feedbacks,
  },
  // Contracts reports
  {
    path: "/driver-incom/:driverId",
    name: "DriverIncomes",
    component: DriverIncomes,
  },
];

const router = new VueRouter({
  routes,
  scrollBehavior() {
    document.getElementById("app").scrollIntoView();
  },
});

export default router;

<template>
  <div class="con-modal">
    <div class="ui form">
      <div class="three fields mt-4">
        <!--Contributor Name -->
        <div class="field">
          <label>Customer Name</label>
          <div class="ui corner labeled input">
            <input
              v-model="searchCustomerName"
              type="text"
              placeholder="Contributor Name"
              @blur="initCustomersList"
            />
          </div>
        </div>
        <!--Customer Phone Number -->
        <div class="field">
          <label>Customer Phone Number</label>
          <div class="ui corner labeled input">
            <input
              type="text"
              v-model="searchPhoneNumber"
              placeholder="Contributor Phone Number"
              @keypress="isNumber($event)"
              @blur="initCustomersList"
            />
          </div>
        </div>
        <!--Customer Email -->
        <div class="field">
          <label>Customer Email</label>
          <div class="ui corner labeled input">
            <input
              type="text"
              v-model="searchEmail"
              placeholder="Contributor Phone Number"
              @keypress="isNumber($event)"
              @blur="initCustomersList"
            />
          </div>
        </div>
      </div>
    </div>

    <table class="table tableBodyScroll">
      <thead>
        <tr class="">
          <th>NO.</th>
          <!-- <th>ID</th> -->
          <th>NAME</th>
          <th>PHONE NUMBER</th>
          <!-- <th class="text-center">ADDRESS</th> -->
          <th>EMAIL</th>
          <th class="text-center">ACTION</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(customer, index) in this.customers"
          :key="customer.customerId"
        >
          <td class="text-secondary">{{ page * 15 + index + 1 }}</td>
          <!-- <td>{{ customer.customerId }}</td> -->
          <td>{{ customer.customerName }}</td>
          <td>{{ customer.phoneNumber }}</td>
          <!-- <td style="max-width: 230px;">{{ customer.address }}</td> -->
          <td>{{ customer.email }}</td>

          <td class="row justify-content-center btn-action">
            <button
              class="btn btn-outline-info btn-rounded btn-icon mr-1"
              :class="
                selectedCustomer.userId !== customer.customerId
                  ? 'btn-outline-info'
                  : 'btn-gradient-info'
              "
              @click="select(customer.customerId, customer.customerName)"
            >
              <i class="mdi mdi-account-check"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4" v-if="this.totalCustomers > 15">
      <paginate
        v-model="currentPage"
        :page-count="Math.floor(this.totalCustomers / 15) + 1"
        :page-range="3"
        :margin-pages="1"
        :click-handler="clickCallback"
        :first-last-button="true"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :page-class="'page-item'"
        :next-class="'page-item'"
        :prev-class="'page-item'"
        :active-class="'page-active'"
      >
      </paginate>
    </div>
    <div class="row justify-content-center btn-group">
      <div class="col-4">
        <button
          class="btn btn-gradient-danger btn-fw"
          type="button"
          @click="cancelFunction()"
        >
          Cancel
        </button>
        <button
          class="btn btn-gradient-info btn-fw ml-2"
          type="button"
          v-on:click="doneFunction()"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { isNumber } from "../../assets/js/input.js";
import { RepositoryFactory } from "../../repositories/RepositoryFactory";
const CustomerRepository = RepositoryFactory.get("customers");
export default {
  props: {
    cancelFunction: Function,
    doneFunction: Function,
    userId: String,
  },
  data() {
    return {
      statusList: [],
      customers: [],
      searchPhoneNumber: "",
      searchAddress: "",
      searchCustomerName: "",
      searchEmail: "",
      searchStatusID: "",
      isLoading: false,
      totalCustomers: 0,
      page: 0,
      currentPage: 1,
      selectedCustomer: {
        userId: "",
      },
    };
  },
  mounted() {
    this.initCustomersList();
    this.initStatusList();
    this.selectedCustomer.userId = this.userId;
  },
  methods: {
    // pagination handle
    async clickCallback(pageNum) {
      this.isLoading = true;
      this.currentPage = pageNum;
      this.page = pageNum - 1;
      this.initCustomersList();
      this.isLoading = false;
    },
    async initCustomersList() {
      this.customers = await CustomerRepository.get(
        this.searchAddress,
        this.searchCustomerName,
        this.searchEmail,
        this.page,
        this.searchPhoneNumber,
        this.searchStatusID
      );
      this.totalCustomers = await CustomerRepository.getTotalCustomer(
        this.searchAddress,
        this.searchCustomerName,
        this.searchEmail,
        this.searchPhoneNumber,
        this.searchStatusID
      );
    },
    // Init data for Contributor Status Dropdown
    async initStatusList() {
      this.statusList = require("../../assets/json/user/driverStatus.json");
      this.$delete(this.statusList, this.statusList.length - 1);
    },
    // Select contributor
    select(userId, fullName) {
      if (this.selectedCustomer.userId === userId) {
        this.selectedCustomer = {
          userId: "",
          fullName: "",
        };
      } else {
        this.selectedCustomer = {
          userId: userId,
          fullName: fullName,
        };
      }
    },
    // Return select contributor
    getSelectedCustomer() {
      return this.selectedCustomer;
    },
    isNumber(evt) {
      isNumber(evt);
    },
  },
};
</script>

<style scoped>
.con-modal {
  position: fixed;
  padding-top: 0% !important;
  padding-left: 1%;
  padding-right: 1%;
  border-radius: 1%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(255, 255, 255);
  z-index: 10000;
  width: 85%;
  height: 90%;
  max-height: 700px;
  padding-top: 12%;
  box-shadow: 2px 2px 15px 7px rgba(0, 0, 0, 0.34);
  color: black;
}
.con-modal .header {
  color: white;
  font-size: 35px !important;
}
.table {
  overflow: hidden !important;
  border-bottom: 1px solid rgb(206, 194, 194);
}
table.tableBodyScroll tbody {
  display: block;
  max-height: 450px;
  overflow-y: scroll;
}

table.tableBodyScroll thead,
table.tableBodyScroll tbody tr {
  display: table;
  width: 98%;
  table-layout: fixed;
}
.btn-group {
  position: absolute;
  bottom: 2%;
  width: 100%;
}

@import "../../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>

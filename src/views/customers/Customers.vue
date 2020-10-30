<template>
  <div class="content-wrapper">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <!-- Delete confimation -->
    <div
      class="ui basic cus-modal justify-content-center"
      v-if="isDeleteConVisible"
    >
      <div class="ui icon header col-12">
        <i class="user times icon mb-3"></i>
        Delete Confirmation
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>Do you want to delete customer with id {{ this.deleteUserID }}?</h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <button
          type="button"
          class="ui blue primary button"
          @click="handleDialog('isDeleteConVisible', '')"
        >
          <i class="checkmark icon"></i>
          Cancel
        </button>
        <button type="button" class="ui red  button" @click="deleteCustomer()">
          <i class="trash alternate icon"></i>
          Delete
        </button>
      </div>
    </div>
    <!-- Error message -->
    <div class="ui basic cus-modal justify-content-center" v-if="isError">
      <div class="ui icon header col-12">
        <i class="frown outline icon mb-3"></i>
        Delete Customer Fail!
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>
          {{ this.errMsg }}
        </h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <button @click="isError = !isError" class="ui blue primary button">
          <i class="checkmark icon"></i>
          Ok
        </button>
      </div>
    </div>

    <!-- Success message -->
    <div class="ui basic cus-modal justify-content-center" v-if="isSuccess">
      <div class="ui icon header col-12">
        <i class="check circle icon mb-3"></i>
        Delete successfully!
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>
          Customer with id {{ this.deleteUserID }} is deleted successfully.
        </h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <button
          @click="
            () => {
              isSuccess = !isSuccess;
              this.searchCustomers();
            }
          "
          class="ui blue primary button"
        >
          <i class="checkmark icon"></i>
          Ok
        </button>
      </div>
    </div>

    <div class="page-header">
      <h3 class="page-title">
        <router-link to="/customers" class="nav-link">Customers</router-link>
      </h3>
      <div class="dropdown">
        <router-link
          to="/create-customer"
          class="btn btn-gradient-info btn-icon-text mr-2"
          type="button"
        >
          <i class="mdi mdi-account-plus btn-icon-prepend"></i>
          Create
        </router-link>
        <button
          class="btn btn-gradient-info dropdown-toggle"
          type="button"
          v-on:click="clickToViewFilter()"
        >
          Filter
        </button>
      </div>
    </div>
    <div class="row">
      <!-- Customers table -->
      <div
        class="grid-margin stretch-card"
        v-bind:class="{
          'col-lg-12': isTableVisible,
          'col-lg-9': !isTableVisible,
        }"
      >
        <div class="card" v-if="customers.length > 0">
          <div class="card-body">
            <h4 class="card-title">Customer List</h4>
            <p class="card-description">{{ this.totalCustomers }} total</p>
            <table class="table ">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PHONE NUMBER</th>
                  <th>ADDRESS</th>
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
                  <td>{{ customer.customerId }}</td>
                  <td>{{ customer.customerName }}</td>
                  <td>{{ customer.phoneNumber }}</td>
                  <td>{{ customer.address}}</td>
                  <td>{{ customer.email}}</td>

                  <td class="row justify-content-center btn-action">
                    <button
                      class="btn btn-gradient-info btn-rounded btn-icon mr-1"
                      @click="viewDetail(customer.userId)"
                    >
                      <i class="mdi mdi-account-box-outline"></i>
                    </button>
                    <button
                      class="btn btn-gradient-warning btn-rounded btn-icon mr-1"
                      @click="updateCustomer(customer.userId)"
                    >
                      <i class="mdi mdi-grease-pencil"></i>
                    </button>
                    <button
                      class="btn btn-gradient-danger btn-rounded btn-icon mr-1"
                      :disabled="customer.userStatusName === 'Disabled'"
                      @click="
                        handleDialog('isDeleteConVisible', customer.customerId)
                      "
                    >
                      <i class="mdi mdi-delete-forever"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="this.totalCustomers > 15">
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
        </div>
        <!-- Empty list -->
        <div class="card empty-list" v-else-if="!isLoading">
          <i class="mdi mdi-account-off"></i>
          <h1>NOTHING</h1>
          <h3>Your list is empty.</h3>
        </div>
      </div>

      <!-- Filter -->
      <transition name="slide-fade">
        <div class="col-3 card filter" v-if="isFilterVisible">
          <div class="form-group">
            <h4 class="card-title mt-4">Filter</h4>
            <div class="col-sm-12">
              <!-- Search Customer ID -->
              <label>Customer ID</label>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Customer ID"
                v-model="searchCustomerID"
                @keypress="isNumber($event)"
                maxlength="12"
              />
            </div>
            <div class="col-12 mt-3">
              <label>Customer Name</label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="searchCustomerName"
                placeholder="Customer name"
              />
            </div>
            <!-- Phone number dropdown-->
            <div class="col-12 mt-3">
              <label>Phone Number</label>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Phone Number"
                v-model="searchPhoneNumber"
                @keypress="isNumber($event)"
                maxlength="10"
              />
            </div>
            <!-- Customer status dropdown -->
            <div class="col-12 mt-3">
              <label>Status</label>
              <select
                class="form-control form-control-sm"
                name="status"
                v-model="searchStatusID"
              >
                <option
                  v-for="status in this.statusList"
                  :key="status.userStatusId"
                  :value="status.userStatusId"
                  >{{ status.userStatusName }}</option
                >
              </select>
            </div>

            <br />
            <div class="col-12 mt-3">
              <button
                class="btn btn-outline-info w-100"
                type="button"
                v-on:click="searchCustomers()"
              >
                Filter
              </button>
            </div>
            <div class="col-12 mt-2">
              <button
                class="btn btn-outline-danger w-100"
                type="button"
                v-on:click="clearSearchValue()"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { isNumber } from "../../assets/js/input.js";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { RepositoryFactory } from "../../repositories/RepositoryFactory";

const CustomerRepository = RepositoryFactory.get("customers");
const UserStatusRepository = RepositoryFactory.get("userStatus");

export default {
  name: "Customers",
  props: {},
  components: {
    Loading,
  },
  data() {
    return {
      isFilterVisible: false,
      isTableVisible: true,
      statusList: [],
      customers: [],
      searchPhoneNumber: "",
      searchCustomerID: "",
      searchCustomerName: "",
      searchStatusID: "",
      isLoading: false,
      totalCustomers: 0,
      page: 0,
      currentPage: 1,
      isDeleteConVisible: false,
      isError: false,
      isSuccess: false,
      errMsg: "",
      deleteUserID: "",
    };
  },
  async mounted() {
    this.customers = [
      {
        customerId: "123",
        customerName: "123",
        address: "123",
        phoneNumber: "0312312",
        email: "12312312",
      },
    ];
  },
  methods: {
    isNumber(evt) {
      isNumber(evt);
    },
    // pagination handle
    async clickCallback(pageNum) {
      this.isLoading = true;
      this.currentPage = pageNum;
      this.page = pageNum - 1;
      this.initCustomersList();
      this.isLoading = false;
    },
    // Init data for Customer Status Dropdown
    async initStatusList() {
      // wait for api
      this.statusList = await UserStatusRepository.get();
      this.statusList.push({
        userStatusId: "",
        userStatusName: "None",
      });
    },
    // Clear search item value
    clearSearchValue() {
      this.searchCustomerID = "";
      this.searchCustomerName = "";
      this.searchPhoneNumber = "";
      this.searchStatusID = "";
    },
    // Search customer
    async searchCustomers() {
      this.isLoading = true;
      this.page = 0;
      this.currentPage = 1;
      await this.initCustomersList();
    },
    // Init data for customer list
    async initCustomersList() {
      this.customers = await CustomerRepository.get(
        this.page,
        this.searchCustomerName,
        this.searchPhoneNumber,
        this.searchStatusID,
        this.searchCustomerID,
        1
      );
      this.totalCustomers = await CustomerRepository.getTotalCustomer(
        this.searchCustomerName,
        this.searchPhoneNumber,
        this.searchStatusID,
        this.searchCustomerID,
        1
      );
      this.isLoading = false;
    },
    // Set filter to visible
    clickToViewFilter() {
      if (this.isFilterVisible && !this.isTableVisible) {
        this.isFilterVisible = !this.isFilterVisible;
        setTimeout(() => {
          this.isTableVisible = !this.isTableVisible;
        }, 300);
      } else if (!this.isFilterVisible && this.isTableVisible) {
        this.isTableVisible = !this.isTableVisible;
        setTimeout(() => {
          this.isFilterVisible = !this.isFilterVisible;
        }, 300);
      }
    },
    // View customer detail
    viewDetail(userId) {
      this.$router.push({
        name: "CustomerDetail",
        params: { userId: userId },
      });
    },
    // View customer detail
    updateCustomer(userId) {
      this.$router.push({
        name: "UpdateCustomer",
        params: { userId: userId },
      });
    },
    // Delete customer
    async deleteCustomer() {
      this.handleDialog("isDeleteConVisible", "");
      this.isLoading = true;
      await CustomerRepository.delete(this.deleteUserID)
        .then((res) => {
          if (res) {
            this.isSuccess = true;
          }
        })
        .catch((err) => {
          this.isError = !this.isError;
          this.errMsg = err.message;
          console.log(err);
        });
      this.isLoading = false;
    },
    // Close delete customer confimation dialog
    handleDialog(dialogName, userId) {
      if (userId.length !== 0) {
        this.deleteUserID = userId;
      }
      this.$data[dialogName] = !this.$data[dialogName];
    },
  },
};
</script>
<style>
.filter {
  max-height: 450px !important;
}
.label {
  font-size: 13px;
}
.form-control {
  font-size: 13px;
}
.btn-action .btn i {
  font-size: 20px;
}
.cus-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(92, 90, 87, 0.637);
  z-index: 10000;
  width: 100%;
  height: 100%;
  padding-top: 12%;
  color: white;
}
.cus-modal .header {
  color: white;
  font-size: 35px !important;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

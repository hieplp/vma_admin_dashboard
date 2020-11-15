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
    <Confirmation
      icon="user times"
      title="Delete Confirmation"
      subTitle="Do you want to delete this customer?"
      rightBtnTitle="Delete"
      rightBtnIcon="trash alternate"
      rightBtnColor="red"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="blue"
      v-if="isDeleteConVisible"
      :handleLeftBtn="
        () => {
          this.isDeleteConVisible = !this.isDeleteConVisible;
        }
      "
      :handleRightBtn="deleteCustomer"
    />

    <!-- Error message -->
    <MessageModal
      title="Delete Customer Fail!"
      icon="frown outline "
      :subTitle="errMsg"
      :proFunc="
        () => {
          this.isError = !this.isError;
        }
      "
      v-if="isError"
    />
    <!-- Success message -->
    <MessageModal
      title="Delete Customer Successfully!"
      icon="check circle"
      :subTitle="
        `Customer with id ${this.deleteUserID} is deleted successfully.`
      "
      :proFunc="
        () => {
          isSuccess = !isSuccess;
          this.searchCustomers();
        }
      "
      v-if="isSuccess"
    />

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
                      class="btn btn-gradient-info btn-rounded btn-icon mr-1 mt-1"
                      @click="viewDetail(customer.customerId)"
                    >
                      <i class="mdi mdi-account-box-outline"></i>
                    </button>
                    <button
                      class="btn btn-gradient-warning btn-rounded btn-icon mr-1 mt-1"
                      @click="updateCustomer(customer.customerId)"
                      :disabled="isDeleteLoading"
                    >
                      <i class="mdi mdi-grease-pencil"></i>
                    </button>
                    <button
                      class="btn btn-gradient-danger btn-rounded btn-icon mr-1 mt-1"
                      :disabled="isDeleteLoading"
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
            <!-- <div class="col-sm-12">
              <label>Address</label>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Customer ID"
                v-model="searchAddress"
              />
            </div> -->
            <div class="col-12 mt-5">
              <label>Customer Name</label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="searchCustomerName"
                placeholder="Customer name"
              />
            </div>
            <!-- Phone number-->
            <div class="col-12 mt-4">
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
            <!-- Email -->
            <div class="col-12 mt-4">
              <label>Email</label>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Email"
                v-model="searchEmail"
                @keypress="isNumber($event)"
                maxlength="10"
              />
            </div>
            <!-- Customer status dropdown -->
            <div class="col-12 mt-4">
              <label>Status</label>
              <select
                class="form-control form-control-sm"
                name="status"
                v-model="searchStatusID"
              >
                <option value="" selected>AVAILABLE</option>
                <option value="1" selected>DELETED</option>
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
import Confirmation from "../../components/Modal/Confirmation";
import MessageModal from "../../components/Modal/MessageModal";

const CustomerRepository = RepositoryFactory.get("customers");

export default {
  name: "Customers",
  props: {},
  components: {
    Loading,
    Confirmation,
    MessageModal,
  },
  data() {
    return {
      isFilterVisible: false,
      isTableVisible: true,
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
      isDeleteConVisible: false,
      isError: false,
      isSuccess: false,
      errMsg: "",
      deleteUserID: "",
      isDeleteLoading: false,
    };
  },
  async mounted() {
    await this.initCustomersList();
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
      await this.initCustomersList();
      this.isLoading = false;
    },

    // Clear search item value
    clearSearchValue() {
      this.searchAddress = "";
      this.searchCustomerName = "";
      this.searchPhoneNumber = "";
      this.searchEmail = "";
      this.searchStatusID = "";
    },
    // Search customer
    async searchCustomers() {
      this.page = 0;
      this.currentPage = 1;
      await this.initCustomersList();
    },
    // Init data for customer list
    async initCustomersList() {
      this.isLoading = true;
      this.isDeleteLoading = this.searchStatusID === "1";
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
    viewDetail(customerId) {
      this.$router.push({
        name: "CustomerDetail",
        params: { customerId: customerId },
      });
    },
    // Update customer detail
    updateCustomer(customerId) {
      this.$router.push({
        name: "UpdateCustomer",
        params: { customerId: customerId },
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
<style scoped>
.filter {
  max-height: 520px !important;
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

td {
  white-space: initial !important;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

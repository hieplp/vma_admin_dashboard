<template>
  <div class="content-wrapper" ref="container">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <div class="page-header">
      <h3 class="page-title test">
        <router-link to="/customers">
          Customers
        </router-link>
        <span class="text-secondary">/</span>
        <span>
          Create Customer
        </span>
      </h3>
    </div>
    <!-- Error modal -->
    <div
      class="ui basic cus-modal justify-content-center"
      v-if="isUpdatedSuccessfully"
    >
      <div class="ui icon header col-12">
        <i class="user plus icon mb-3"></i>
        Create Customer Successfully!
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>
          Customer with name {{ this.customer.customerName }} is created
          successfully!
        </h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <router-link to="/customers" class="ui blue primary button">
          <i class="checkmark icon"></i>
          Continue
        </router-link>
      </div>
    </div>

    <div class="ui basic cus-modal justify-content-center" v-if="isError">
      <div class="ui icon header col-12">
        <i class="frown outline icon mb-3"></i>
        Create Customer Fail!
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

    <!-- User Information -->
    <div class="row">
      <Customer
        leftBtnTxt="Cancel"
        rightBtnTxt="Create"
        :handlePropRightBtn="create"
        :handlePropLeftBtn="cancel"
        ref="customer"
      />
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import Customer from "../../components/Customer/Customer";

import { RepositoryFactory } from "../../repositories/RepositoryFactory";
const CustomerRepository = RepositoryFactory.get("customers");

export default {
  name: "CreateCustomer",
  components: {
    Loading,
    Customer,
  },
  data() {
    return {
      customer: {
        customerName: "",
        address: "",
        phoneNumber: "",
        email: "",
        fax: "",
        taxCode: "",
        accountNumber: "",
      },

      isLoading: false,
      isCustomerLoading: false,
      isUpdatedSuccessfully: false,
      isError: false,
      errMsg: "",
    };
  },
  async mounted() {},
  methods: {
    // Cancel
    cancel() {
      this.$refs.customer.initData();
    },
    // Update customer
    async create() {
      this.isLoading = true;
      this.customer = this.$refs.customer.getData();
      console.log(this.$refs.customer.getData());
      await CustomerRepository.create(this.customer)
        .then((res) => {
          if (res) {
            this.isUpdatedSuccessfully = true;
          }
        })
        .catch((ex) => {
          if (ex) {
            this.errMsg = ex.debugMessage;
          }
          this.isError = true;
        });
      this.isLoading = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.field label {
  margin-top: 10px !important;
}
.asterisk.icon {
  color: red;
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

.cus-select {
  padding-left: 26px !important;
}
.cus-disable {
  background-color: #858585 !important;
  color: white;
}
</style>
<style>
@import "../../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

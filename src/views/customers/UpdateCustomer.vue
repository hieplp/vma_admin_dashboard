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
          Update Customer
        </span>
        <span class="text-secondary">/</span>
        <span>
          {{ this.$route.params.customerId }}
        </span>
      </h3>
    </div>
    <!-- Error modal -->
    <div
      class="ui basic cus-modal justify-content-center"
      v-if="isUpdatedSuccessfully"
    >
      <div class="ui icon header col-12">
        <i class="check circle outline icon mb-3"></i>
        Update Customer Successfully!
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>
          Customer with name {{ this.customer.customerName }} is updated
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

    <Confirmation
      icon="edit outline"
      title="Update Confirmation"
      subTitle="Do you want to update this customer?"
      rightBtnTitle="Update"
      rightBtnIcon="check"
      rightBtnColor="blue"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="red"
      v-if="isUpdConVisible"
      :handleLeftBtn="
        () => {
          this.isUpdConVisible = !this.isUpdConVisible;
        }
      "
      :handleRightBtn="update"
    />

    <div class="ui basic cus-modal justify-content-center" v-if="isError">
      <div class="ui icon header col-12">
        <i class="frown outline icon mb-3"></i>
        Update Customer Fail!
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
        :propCustomer="customer"
        v-if="isCustomerLoading"
        leftBtnTxt="Cancel"
        rightBtnTxt="Update"
        :handlePropRightBtn="
          () => {
            this.isUpdConVisible = !this.isUpdConVisible;
          }
        "
        :handlePropLeftBtn="cancel"
        ref="customer"
      />
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import Customer from "../../components/Customer/Customer";
import Confirmation from "../../components/Modal/Confirmation";

import { RepositoryFactory } from "../../repositories/RepositoryFactory";
const CustomerRepository = RepositoryFactory.get("customers");

export default {
  name: "UpdateCustomer",
  components: {
    Loading,
    Customer,
    Confirmation,
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
      isUpdConVisible: false,
      isError: false,
      errMsg: "",
    };
  },
  async mounted() {
    await this.initData();
  },
  methods: {
    // Init data when is update
    async initData() {
      this.isLoading = true;
      await CustomerRepository.getDetailCustomer(this.$route.params.customerId)
        .then((res) => {
          this.customer = res;
          this.isCustomerLoading = true;
        })
        .catch((ex) => {
          if (ex) {
            this.errMsg = ex.debugMessage;
          }
          console.log(ex);
          this.isError = true;
        });
      this.isLoading = false;
    },
    // Cancel
    cancel() {
      this.$refs.customer.initData();
    },
    // Update customer
    async update() {
      this.isUpdConVisible = !this.isUpdConVisible;
      this.isLoading = true;
      this.customer = this.$refs.customer.getData();
      console.log(this.$refs.customer.getData());
      await CustomerRepository.update(this.customer)
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

.cus-select {
  padding-left: 26px !important;
}
.cus-disable {
  background-color: #858585 !important;
  color: white;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

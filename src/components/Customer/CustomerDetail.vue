<template>
  <div class="col-lg-12 grid-margin stretch-card">
    <div class="card">
      <div class="card-body">
        <div class="ui form">
          <h4 class="ui dividing header">CUSTOMER INFORMATION</h4>
          <div class="two fields mt-4">
            <!-- Full name -->
            <div class="field">
              <label>Full Name</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  v-model="customer.customerName"
                  placeholder="N/A"
                />
              </div>
            </div>
            <!-- Phone number -->
            <div class="field">
              <label>Phone Number</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  v-model="customer.phoneNumber"
                  placeholder="N/A"
                />
              </div>
            </div>
          </div>

          <div class="two fields mt-4">
            <!-- Fax -->
            <div class="field ">
              <label>Fax</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  v-model="customer.fax"
                  readonly
                  placeholder="N/A"
                />
              </div>
            </div>

            <!-- Email -->
            <div class="field ">
              <label>Email</label>
              <div class="ui corner labeled input">
                <input
                  type="email"
                  v-model="customer.email"
                  readonly
                  placeholder="N/A"
                />
              </div>
            </div>
          </div>

          <div class="two fields mt-4">
            <!-- Tax Code -->
            <div class="field ">
              <label>Tax Code</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  v-model="customer.taxCode"
                  readonly
                  placeholder="N/A"
                />
              </div>
            </div>
            <!-- Account Number -->
            <div class="field ">
              <label>Account Number</label>
              <div class="ui corner labeled input">
                <input type="text" v-model="customer.accountNumber" readonly />
              </div>
            </div>
          </div>
          <!-- Adress -->
          <div class="field mt-4">
            <label>Address</label>
            <div class="ui corner labeled input">
              <input type="text" v-model="customer.address" readonly />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomerDetail",
  props: {
    customer: Object,
    leftBtnTxt: String,
    rightBtnTxt: String,
    // Function
    handlePropLeftBtn: Function,
    handlePropRightBtn: Function,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style></style>

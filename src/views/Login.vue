<template>
  <div class="container-fluid page-body-wrapper full-page-wrapper">
    <div
      class="content-wrapper d-flex align-items-center auth"
      style="background-image: require('../assets/images/login-back.jpg')"
      :style="{
        'background-image':
          'url(' + require('../assets/images/login-back.jpg') + ')',
      }"
    >
      <div class="row flex-grow">
        <div class="col-lg-4 mx-auto">
          <div class="auth-form-light text-left p-5">
            <div class="brand-logo">
              <a><img src="../assets/images/logo(transparent).png"/></a>
            </div>
            <h6 class="font-weight-light text-center" style="font-size: 20px;">
              Sign in.
            </h6>
            <div class="pt-3">
              <div class="form-group">
                <label class="title">Phone Number:</label>
                <input
                  type="text"
                  class="form-control form-control-lg text-input"
                  placeholder="Enter your phone number."
                  v-model="phoneNumber"
                  @keypress="isNumber($event)"
                  minlength="10"
                  maxlength="10"
                />
                <div
                  class="ui pointing red basic label"
                  v-if="isPhoneErrVisible"
                >
                  Phone number requires 10 digits.
                </div>
              </div>

              <div class="form-group">
                <label class="title">Password:</label>
                <input
                  type="password"
                  class="form-control form-control-lg text-input"
                  placeholder="Enter your password!"
                  v-model="password"
                />
                <div
                  class="ui pointing red basic label"
                  v-if="isPasswordErrVisible"
                >
                  Password is required!
                </div>
              </div>
              <div class="mt-3">
                <button
                  class="btn btn-block btn-gradient-info btn-lg font-weight-medium auth-form-btn"
                  v-on:click="login"
                >
                  SIGN IN
                </button>
              </div>
              <div class="mt-3">
                <button
                  class="btn btn-block btn-gradient-info btn-lg font-weight-medium auth-form-btn"
                  v-on:click="login"
                >
                  SIGN IN
                </button>
              </div>
              <div
                class="my-2 d-flex justify-content-between align-items-center"
              >
                <div class="form-check">
                  <label class="form-check-label text-muted">
                    <input
                      type="checkbox"
                      class="form-check-input form-check-info"
                    />
                    Keep me signed in
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- content-wrapper ends -->
  </div>
</template>

<script>

export default {
  name: "Login",
  data() {
    return {
      phoneNumber: "",
      password: "",
      isPhoneErrVisible: false,
      isPasswordErrVisible: false,
    };
  },
  methods: {
    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    login() {
      // Check valid phone number
      this.isPhoneErrVisible = this.phoneNumber.length !== 10 ? true : false;

      // Check valid password
      this.isPasswordErrVisible = this.password.length === 0 ? true : false;

      // If phone number and password are valid, call api to login
      if (!this.isPhoneErrVisible && !this.isPasswordErrVisible) {
        console.log("api here");
      }
    },
  },
};
</script>

<style>
@import "../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>
<style>
@import "../assets/css/login.css";
</style>

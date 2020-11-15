<template>
  <div class="container-fluid page-body-wrapper full-page-wrapper">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>
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
          <div class="auth-form-light p-5 ">
            <div class="brand-logo w-100">
              <div class="logo">
                <img src="../assets/images/logo(transparent).png" />
              </div>
            </div>
            <h6 class="font-weight-light text-center" style="font-size: 20px;">
              Sign in.
            </h6>
            <div class="pt-3">
              <div class="form-group" v-if="!isOtpVisible">
                <label class="title">Phone Number:</label>
                <input
                  type="text"
                  class="form-control form-control-lg text-input"
                  v-model="phoneNumber"
                  placeholder="Phone Number: (0xx) xxx-xxxx"
                  @input="phoneInput"
                  minlength="14"
                  maxlength="14"
                />
                <div
                  class="ui pointing red basic label"
                  v-if="isPhoneErrVisible"
                >
                  Phone number requires 10 digits.
                </div>
              </div>
              <!-- OTP Input -->
              <div class="form-group" v-if="isOtpVisible">
                <label class="title mb-3">OTP:</label>
                <v-otp-input
                  ref="otpInput"
                  input-classes="otp-input"
                  separator="-"
                  :num-inputs="6"
                  :should-auto-focus="true"
                  :is-input-num="true"
                  @on-complete="handleOnComplete"
                />
                <div
                  class="ui pointing red basic label"
                  v-if="isPhoneErrVisible"
                >
                  Phone number requires 10 digits.
                </div>
              </div>
              <!-- Send phone number to firebase -->
              <div class="mt-3" v-if="!isOtpVisible" id="recaptcha-container">
                <button
                  class="btn btn-block btn-gradient-info btn-lg font-weight-medium auth-form-btn"
                  id="sign-in-button"
                  data-sitekey="sign-in-button"
                  @click="sendPhoneNumToFirebase()"
                >
                  Continue
                </button>
              </div>
              <div class="mt-3" id="recaptcha-container"></div>
              <div class="mt-3" v-if="isOtpVisible">
                <button
                  class="btn btn-block btn-gradient-danger btn-lg font-weight-medium auth-form-btn"
                  v-on:click="isOtpVisible = false"
                >
                  Back
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
import * as firebase from "firebase";
import Loading from "vue-loading-overlay";

export default {
  name: "Login",
  components: {
    Loading,
  },
  data() {
    return {
      phoneNumber: "",
      password: "",
      isPhoneErrVisible: false,
      isPasswordErrVisible: false,
      isOtpVisible: false,
      isLoading: false,
    };
  },
  mounted() {
    // const seft = this;
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: function() {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          this.sendPhoneNumToFirebase();
        },
      }
    );

    window.recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
    });
  },
  methods: {
    // Handle otp complete input
    async handleOnComplete(value) {
      this.isLoading = true;
      let confirmationResult = window.confirmationResult;
      await confirmationResult
        .confirm(value)
        .then((result) => {
          if (result.user) {
            localStorage.setItem("USER", JSON.stringify(result.user));
            this.$router.push({
              name: "Overview",
            });
            this.isLoading = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      this.isLoading = false;
    },
    // Send phone number to firebase
    async sendPhoneNumToFirebase() {
      // localStorage.setItem("userId", "hiep");
      // this.$router.push({
      //   name: "Overview",
      // });
      // window.location.reload();
      // // Set phone number
      let phoneNumber =
        "+84" +
        this.phoneNumber
          .replace("(", "")
          .replace(")", "")
          .replace(" ", "")
          .replace("-", "")
          .substring(1);
      this.isPhoneErrVisible = phoneNumber.length !== 12;
      if (!this.isPhoneErrVisible) {
        this.isLoading = true;
        let appVerifier = window.recaptchaVerifier;
        await firebase
          .auth()
          .signInWithPhoneNumber(phoneNumber, appVerifier)
          .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            this.isOtpVisible = true;
          })
          .catch((err) => {
            console.log(err);
          });
        this.isLoading = false;
      }
    },
    // Check Phone input
    phoneInput() {
      var x = this.phoneNumber
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      if (x[1].charAt(0) !== "0" && x[1].length != 0) {
        x[1] = "0" + x[1];
      }
      this.phoneNumber = !x[2]
        ? x[1]
        : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
    },
  },
};
</script>

<style>
@import "../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>
<style>
.otp-input {
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
}
.otp-input .error {
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
  border: 1px solid red !important;
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.otp-input:focus {
  border: 1px solid #047edf;
}
.brand-logo {
  justify-content: center;
  text-align: center !important;
  justify-content: center;
  width: 100% !important;
}

.text-input {
  font-size: 14px !important;
  /* border-color: #babdbe !important; */
}

.title {
  color: #047edf;
  font-weight: 600;
}
</style>

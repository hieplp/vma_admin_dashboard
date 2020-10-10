<template>
  <div class="content-wrapper">
    <div class="page-header">
      <h3 class="page-title test">
        <router-link to="/drivers">
          Drivers
        </router-link>
        <span class="text-secondary">/</span>
        <span>
          {{ this.userId }}
        </span>
      </h3>
    </div>
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <!-- Image -->
            <div class="row justify-content-center">
              <img
                :src="detail.image"
                class="ui medium circular image pro-img"
                alt="image"
              />
              <div class="col-12 text-center">
                <h2>{{ detail.name }}</h2>
                <h4 class="text-secondary">ID : {{ detail.id }}</h4>
              </div>
            </div>
            <div class="right floated edit-btn">
              <button class="ui icon button" v-on:click="handleUpdIconClick()">
                <i class="edit icon"></i>
              </button>
            </div>

            <!-- Detailed information -->
            <div class="pro-devider">
              <h4 class="ui horizontal divider header text-secondary">
                <i class="id card outline icon"></i>
              </h4>
            </div>

            <div class="row">
              <div class="form-group col-sm">
                <label class="col-md-6 col-form-label">Full name</label>
                <div class="col-sm-12">
                  <input
                    type="text"
                    class="form-control"
                    v-model="detail.name"
                    :disabled="!isUpdateVisible"
                  />
                </div>
              </div>
              <div class="form-group col-sm">
                <label class="col-md-6 col-form-label">Birth Date</label>
                <div class="col-sm-12">
                  <input
                    type="date"
                    class="form-control"
                    v-model="detail.birthdate"
                    :disabled="!isUpdateVisible"
                  />
                </div>
              </div>
              <div class="form-group col-sm">
                <label class="col-md-8 col-form-label">Gender</label>
                <div class="col-12">
                  <input
                    type="text"
                    class="form-control"
                    v-model="detail.gender"
                    :disabled="!isUpdateVisible"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-sm">
                <label class="col-md-6 col-form-label">Base Salary</label>
                <div class="col-sm-12">
                  <input
                    type="text"
                    class="form-control"
                    v-model="detail.salary"
                    @keypress="isNumber($event)"
                    :disabled="!isUpdateVisible"
                  />
                </div>
              </div>
              <div class="form-group col-sm">
                <label class="col-md-8 col-form-label">Phone number</label>
                <div class="col-sm-12">
                  <input
                    type="text"
                    class="form-control"
                    v-model="detail.phonenumber"
                    :disabled="!isUpdateVisible"
                    @keypress="isNumber($event)"
                    maxlength="10"
                  />
                </div>
              </div>
              <div class="form-group col-sm">
                <label class="col-md-8 col-form-label">Address</label>
                <div class="col-sm-12">
                  <input
                    type="text"
                    class="form-control"
                    v-model="detail.address"
                    :disabled="!isUpdateVisible"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isNumber } from "../assets/js/input.js";

export default {
  data() {
    return {
      detail: {
        id: "#12016",
        name: "Nguyễn Hoàng Kiều Trinh",
        role: "Driver",
        status: "Available",
        salary: 240,
        phonenumber: "0769969167",
        gender: "Male",
        address: " 49/1A Road number 5",
        birthdate: "1999-06-14",
        image:
          "https://nghesiviet.vn/storage/files/7/kieutrinh/hot-girl-kieu-trinh.jpg",
      },
      userId: "",
      isUpdateVisible: false,
    };
  },
  mounted() {
    this.userId = this.$route.params.userId;
  },
  methods: {
    isNumber(evt) {
      isNumber(evt);
    },
    // Handle update icon click
    handleUpdIconClick() {
      console.log("123");
      this.isUpdateVisible = !this.isUpdateVisible;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>
<style>
.pro-img {
  width: 180px !important;
  margin-bottom: 1%;
}
.edit-btn {
  position: absolute;
  top: 2%;
  right: 1%;
}
.pro-devider {
  margin: 2% 30% 4% 30%;
}

.form-control {
  font-size: 14px;
}

.col-form-label {
  color: #746d6d;
}
</style>

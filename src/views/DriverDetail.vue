/* eslint-disable no-unused-vars */
<template>
  <div class="content-wrapper">
    <div class="page-header">
      <h3 class="page-title">Driver Detail</h3>
    </div>
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
              <div class=" row">
                <div class=" col-sm-3">
                  <img :src="detail.image" class="ui medium circular image" alt="image" />
                </div>
                <div class="col-sm-4">
                  <br/>
                <h2 >{{detail.name}}</h2>
                <h3 class="text-secondary">{{detail.role}}</h3>
                <h4 >ID : {{detail.id}}</h4>
                <i class="circular green users icon"></i> {{detail.status}}<br/>
                
                </div>
                  <div class="col-sm-4">
                    <button class="ui icon right floated button"><i class="edit icon"></i></button>
                    </div>
              </div>
              <div class="ui divider"></div>
            <div class="row">
              <div class="form-group col-sm">
                <label class="col-md-6 col-form-label text-secondary"
                  >Full name</label
                >
                <div class="col-sm-12">
                  <input
                    type="text"
                    class="form-control"
                    v-model="detail.name"
                  />
                </div>
              </div>
              <div class="form-group col-sm">
                <label class="col-md-6 col-form-label text-secondary"
                  >Birth Date</label
                >
                <div class="col-sm-12">
                  <input
                    type="date"
                    class="form-control"
                    v-model="detail.birthdate"
                  />
                </div>
              </div>
              <div class="form-group col-sm">
                <label class="col-md-8 col-form-label text-secondary"
                  >Gender</label
                >
                <div class="col-sm-12">
                  <input
                    type="text"
                    class="form-control"
                    v-model="detail.gender"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-sm">
                <label class="col-md-6 col-form-label text-secondary"
                  >Base Salary</label
                >
                <div class="col-sm-12">
                  <input
                    type="text"
                    class="form-control"
                    v-model="detail.salary"
                  />
                </div>
              </div>
              <div class="form-group col-sm">
                <label class="col-md-8 col-form-label text-secondary"
                  >Phone number</label
                >
                <div class="col-sm-12">
                  <input
                    type="text"
                    class="form-control"
                    v-model="detail.phonenumber"
                  />
                </div>
              </div>
              <div class="form-group col-sm">
                <label class="col-md-8 col-form-label text-secondary"
                  >Address</label
                >
                <div class="col-sm-12">
                  <input
                    type="text"
                    class="form-control"
                    v-model="detail.address"
                  />
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="form-group col-sm">
                <label class="col-md-8 col-form-label text-secondary"
                  >Document</label
                >
                <div class="col-sm-12">
                  <router-link to="/driverdocument">
                  <button class="form-control btn btn-gradient-info">
                    View Document
                  </button>
                  </router-link>
                </div>
              </div>
              <div class="form-group col-sm"></div>
              <div class="form-group col-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/vendors/js/vendor.bundle.base.js";
import "../assets/js/off-canvas.js";
import "../assets/js/hoverable-collapse.js";
import "../assets/js/misc.js";

export default {
  data() {
    return {
      detail: {
        id: "#12016",
        name: "Nguyen Duc Hung",
        role: "Driver",
        status: "Available",
        salary: 240,
        phonenumber: "0769969167",
        gender: "Male",
        address: " 49/1A Road number 5",
        birthdate: "1999-06-14",
        image:
          "https://scontent.fsgn2-5.fna.fbcdn.net/v/t1.0-9/80742826_2481110258768067_7881332290297528320_o.jpg?_nc_cat=104&_nc_sid=09cbfe&_nc_ohc=VJG3Q1dHlZYAX-s3ZaS&_nc_ht=scontent.fsgn2-5.fna&oh=ba9e135faf34bae3d4a72bfa4c64c612&oe=5FA3D1F3",
      },
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style>
@import "../assets/vendors/mdi/css/materialdesignicons.min.css";
</style>
<style>
@import "../assets/vendors/css/vendor.bundle.base.css";
</style>
<style>
@import "../assets/css/style.css";
</style>
<style>
@import "../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>

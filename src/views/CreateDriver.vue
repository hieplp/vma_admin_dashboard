/* eslint-disable no-unused-vars */
<template>
  <div class="content-wrapper">
    <div class="page-header">
      <h3 class="page-title">Create Driver</h3>
    </div>
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <form class="ui form">
              <h4 class="ui dividing header">Basic Information</h4>
                <div class="field">
                  <label>Profile image</label>
                  <img :src="previewImage" class="ui large image" />
                  <input type="file" accept="image/png" @change=uploadImage>
                </div>
              <div class="two fields">
                <div class="field">
                  <label>Full Name</label>
                  <input type="text" name="Name" placeholder="Full name">
                </div>
                <div class="field">
                  <label>Phone Number</label>
                  <input type="text" name="Phone Number" placeholder="Phone Number" @keypress="isNumber($event)" maxlength="10">
                </div>
            </div>
  <div class="three fields">
    <div class="field">
      <label>Gender</label>
      <select class="ui fluid dropdown">
        <option value="">Male</option>
        <option value="">Female</option>
      </select>
    </div>
    <div class="field">
      <label>Birthdate</label>
      <input
                    type="date"
                    class="form-control"
                    v-model="time1"
     />
    </div>
    <div class="field">
      <label>Address</label>
      <input type="text" name="Address" placeholder="Address">
    </div>
  </div>
  </form>
    </div>
  </div>
  </div>
  </div>
  <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <form class="ui form">
              <h4 class="ui dividing header">Job Information</h4>
              <div class="field">
                  <label>Basic Salary</label>
                  <input type="text" name="Salary" placeholder="Basic Salary" @keypress="isNumber($event)" maxlength="10">
              </div>
              <div class="field">
                  <label>Documents</label>
                  <multiselect v-model="documentValue" :options="options" placeholder="Search or add a document" label="name" track-by="code" :multiple="true" :taggable="true">
                  </multiselect>
              </div>
              <div class="ui horizontal divider">
    Or
  </div>
              <div class="field">
                  <button class="form-control btn btn-gradient-info">
                    Create Document
                  </button>
              </div>
              </form>
          </div>
  </div>
  </div>
  </div>
    <button class="form-control btn btn-gradient-info">
                    Create Driver
    </button>
  </div>
</template>

<script>
import "../assets/js/misc.js";
import $ from 'jquery';
import { isNumber } from "../assets/js/input.js";

export default {
  data() {
    return {
      documentValue:null,
      previewImage:null,
      time1: null,
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
      options: [
        { name: 'Document#1', code: 'Document#1' },
        { name: 'Document#2', code: 'Document#2' },
        { name: 'Document#3', code: 'Document#3' }
      ],
    };
  },
  mounted() {
    $('.ui.dropdown').dropdown({
  allowAdditions: true,
    });
  },
  methods:{
            uploadImage(e){
                const image = e.target.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(image);
                reader.onload = e =>{
                    this.previewImage = e.target.result;
                    console.log(this.previewImage);
                };
            },
            addTag (newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      }
      this.options.push(tag)
      this.value.push(tag)
    },
    isNumber(evt) {
      isNumber(evt);
    },
        }
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
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

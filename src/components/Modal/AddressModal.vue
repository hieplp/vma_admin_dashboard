<template>
  <div class="con-modal ">
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card-body">
          <label>Location:</label>
          <gmap-autocomplete
            :options="autocompleteOptions"
            @place_changed="setPlace"
          >
          </gmap-autocomplete>
          <div class="ui pointing red basic label" v-if="isAddressErr">
            Address is required!
          </div>
        </div>
      </div>
      <div class="col-12"></div>
    </div>

    <!-- <Address
      class="mt-1"
      :propAddress="address"
      title="LOCATION"
      ref="location"
    />
     -->
    <div class="row justify-content-center btn-group">
      <div class="col-lg-6 ml-lg-5">
        <button
          class="btn btn-gradient-danger btn-fw"
          type="button"
          @click="cancelFunction()"
        >
          Cancel
        </button>
        <button
          class="btn btn-gradient-info btn-fw ml-2"
          type="button"
          v-on:click="doneFunction()"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { isNumber } from "../../assets/js/input.js";
// import Address from "../Address";
export default {
  props: {
    cancelFunction: Function,
    doneFunction: Function,
    address: String,
  },
  components: {
    // Address,
  },
  data() {
    return {
      currentPlace: null,
      autocompleteOptions: {
        componentRestrictions: {
          country: ["vn"],
        },
        fields: ["geometry", "formatted_address", "address_components"],
      },
      isAddressErr: false,
    };
  },
  mounted() {},
  methods: {
    // nhận địa điểm thông qua autocomplete component
    setPlace(place) {
      // this.currentPlace = { location: place.formatted_address };
      this.currentPlace = place;
    },
    // Get data
    getData() {
      if (this.currentPlace !== null) {
        return this.currentPlace.formatted_address;
      } else {
        this.isAddressErr = true;
      }
    },
    isNumber(evt) {
      isNumber(evt);
    },
  },
};
</script>

<style scoped>
.con-modal {
  position: fixed;
  padding-top: 0% !important;
  padding-left: 1%;
  padding-right: 1%;
  border-radius: 1%;
  top: 50%;
  left: 60%;
  transform: translate(-50%, -50%);
  background-color: rgb(255, 255, 255);
  z-index: 50;
  width: 50%;
  max-height: 45% !important;
  padding-top: 12%;
  box-shadow: 2px 2px 15px 7px rgba(0, 0, 0, 0.34);
  color: black;
}
.con-modal .header {
  color: white;
  font-size: 35px !important;
}
.table {
  overflow: hidden !important;
  border-bottom: 1px solid rgb(206, 194, 194);
}
table.tableBodyScroll tbody {
  display: block;
  max-height: 320px;
  height: 120px;
  overflow-y: scroll;
}

table.tableBodyScroll thead,
table.tableBodyScroll tbody tr {
  display: table;
  width: 98%;
  table-layout: fixed;
}
.btn-group {
  position: absolute;
  bottom: 2%;
  width: 100%;
}

/* Google  */
.pac-target-input {
  width: 100%;
  border: none;
  border-bottom: 2px solid #c7c2c2;
  padding-bottom: 13px;
  display: inline-block;
}
.pac-target-input:focus {
  transform: scaleX(1);
  border-color: rgb(29, 73, 216);
}

@import "../../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>

<template>
  <div class="con-modal ">
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card-body">
          <label>
            Coordindates: {{ this.changePlace.lat }},
            {{ this.changePlace.lng }}
          </label>
          <gmap-map
            class="mb-5"
            ref="ggMap"
            :center="currentPlace"
            :zoom="15"
            style="width:100%;  height: 600px;"
          >
            <GmapMarker
              :position="currentPlace"
              :clickable="true"
              :draggable="true"
              @drag="updateCoordinates"
              :icon="{
                url: 'http://maps.google.com/mapfiles/kml/pal3/icon21.png',
              }"
            />
            <!-- <gmap-info-window
              :position="infoWindow.position"
              :opened="infoWindow.open"
              @closeclick="infoWindow.open = false"
              :options="{
                pixelOffset: {
                  width: 0,
                  height: -35,
                },
              }"
            >
              I can use <b>HTML</b> here and expressions too !<br />
              I am not bound to any markers. I'm freeee.
            </gmap-info-window> -->
          </gmap-map>
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
      <div class="">
        <button
          class="btn btn-gradient-danger btn-fw"
          type="button"
          @click="cancelFunction()"
        >
          Cancel
        </button>
        <button
          class="btn btn-gradient-info btn-fw ml-lg-2"
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
    lat: Number,
    lng: Number,
  },
  components: {
    // Address,
  },
  data() {
    return {
      currentPlace: {
        lat: 10.828220704570413,
        lng: 106.80930916858262,
      },
      changePlace: { lat: 0, lng: 0 },
      autocompleteOptions: {
        componentRestrictions: {
          country: ["vn"],
        },
        fields: ["geometry", "formatted_address", "address_components"],
      },
      isAddressErr: false,
    };
  },
  mounted() {
    this.currentPlace = {
      lat: this.lat,
      lng: this.lng,
    };
    this.changePlace = this.currentPlace;
  },
  methods: {
    // Update coordinates
    updateCoordinates(location) {
      this.changePlace = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng(),
      };
    },
    // nhận địa điểm thông qua autocomplete component
    setPlace(place) {
      // this.currentPlace = { location: place.formatted_address };
      this.currentPlace = place;
    },
    // Get data
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
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(255, 255, 255);
  z-index: 50;
  width: 90%;
  max-height: 85% !important;
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

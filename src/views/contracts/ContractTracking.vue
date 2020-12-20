<template>
  <div class="content-wrapper">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <div class="row">
      <div class="page-header">
        <h3 class="page-title">
          <router-link to="/contracts"> Contracts </router-link>
          <span class="text-secondary"> / </span>
          <router-link :to="`/contracts/${this.$route.params.contractId}`">
            {{ this.$route.params.contractId }}
          </router-link>
          <span class="text-secondary"> / </span>
          <span>
            Tracking
          </span>
        </h3>
      </div>
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <h4 class="ui dividing header">VEHICLE TRACKING</h4>
              <div class="two fields">
                <div class="field">
                  <label>Start Time</label>
                  <div class="ui corner labeled input">
                    <input type="text" v-model="start.time" readonly />
                  </div>
                </div>
                <div class="field">
                  <label>End Time</label>
                  <div class="ui corner labeled input">
                    <input
                      type="text"
                      v-model="end.time"
                      placeholder="End Time"
                      readonly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-12 mt-1" v-if="isMapRender">
        <gmap-map
          class="mb-3"
          ref="ggMap"
          :center="center"
          :zoom="15"
          style="width:100%;  height: 600px;"
        >
          <gmap-polyline
            v-bind:path.sync="path"
            v-bind:options="{ strokeColor: '#ff0000' }"
          >
          </gmap-polyline>
          <GmapMarker
            :position="start.position"
            :clickable="true"
            :draggable="true"
            icon="http://www.google.com/mapfiles/markerS.png"
            v-if="start"
          />
          <GmapMarker
            :position="end.position"
            :clickable="true"
            :draggable="true"
            icon="http://www.google.com/mapfiles/markerE.png"
            v-if="end"
          />
        </gmap-map>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import * as firebase from "firebase";
// import DirectionsRenderer from "../../components/Google/DirectionsRenderer";
import moment from "moment";
export default {
  props: {
    title: String,
    endDateChange: Function,
    propTrip: Object,
    importLocation: Function,
    isUpdate: Boolean,
    isDetail: Boolean,
  },
  components: {
    Loading,
    // DirectionsRenderer,
  },
  async mounted() {
    this.isLoading = true;
    const db = firebase.firestore();
    const tracking = db
      .collection("Tracking")
      .doc(this.contractId + "")
      .collection(this.vehicleContractId + "");
    let doc = await tracking.get();
    if (doc) {
      let coordinateList = doc.kf.docChanges;
      console.log(
        "🚀 ~ file: ContractTracking.vue ~ line 70 ~ mounted ~ coordinateList",
        doc.kf.docChanges
      );
      if (coordinateList.length > 0) {
        coordinateList.forEach((coordinate) => {
          let coord = coordinate.doc.sn.proto.mapValue.fields;
          this.path.push({
            lat: coord.lat.doubleValue,
            lng: coord.long.doubleValue,
            status: coord.status.stringValue,
          });

          if (coord.status.stringValue === "START") {
            this.start = {
              position: {
                lat: coord.lat.doubleValue,
                lng: coord.long.doubleValue,
              },
              status: coord.status.stringValue,
              time: coordinate.doc.key.path.segments[8],
            };
          } else if (coord.status.stringValue === "END") {
            this.end = {
              position: {
                lat: coord.lat.doubleValue,
                lng: coord.long.doubleValue,
              },
              status: coord.status.stringValue,
              time: coordinate.doc.key.path.segments[8],
            };
          }
        });
        this.center = this.path[0];
      }
    }
    if (this.path[0]) {
      this.markers.push({
        position: this.path[0],
        label: "1",
        infoText: "Marker #1",
      });
    }
    console.log(this.start);
    // Add end trip
    if (
      this.path.length > 1 &&
      this.path[this.path.length - 1].status === "END"
    ) {
      console.log(123);
      this.markers.push({
        position: this.path[this.path.length - 1],
      });
    }
    this.isMapRender = true;
    this.isLoading = false;
  },
  computed: {
    origin() {
      if (!this.firstLocations[0]) return null;
      return { query: this.firstLocations[0].location };
    },
    destination() {
      if (
        this.firstLocations.length < 2 ||
        this.firstLocations[this.firstLocations.length - 1].location === ""
      )
        return null;
      return {
        query: this.firstLocations[this.firstLocations.length - 1].location,
      };
    },
    waypoints() {
      let waypoints = Object.assign([], this.firstLocations);
      this.$delete(waypoints, waypoints.length - 1);
      this.$delete(waypoints, 0);
      return waypoints;
    },
    // destination time
    destinationTime() {
      let totalTime = 0;
      this.routes.forEach((route) => {
        totalTime += route.duration.value;
      });
      let destinationTime = moment(this.trip.departureTime, "YYYY-MM-DDTkk:mm")
        .add(totalTime, "seconds")
        .format("YYYY-MM-DD HH:mm:ss");
      if (destinationTime === "Invalid date") {
        return "Depart time";
      }
      this.setTripDestination(destinationTime);
      this.endDateChange();
      return destinationTime;
    },
  },
  data() {
    return {
      markers: [],
      start: { time: "" },
      end: { time: "" },
      contractId: this.$route.params.contractId,
      vehicleContractId: this.$route.params.contractVehicleId,
      // Max day
      maxDateFrom: "",
      minDateFrom: "",
      // First location
      firstLocations: [],

      isAddressModal: false, // is address modal picker visible
      // 1 - Add new location
      // 2 - Update location
      selectedType: "",
      // Selected location
      index: "",
      selectedLocation: null,
      isErr: false,

      maxDate: "",

      isLoading: true,
      isMapRender: false,

      // Google map,
      center: { lat: 10.842132674640132, lng: 106.80930916858262 },
      // markers: [{ lat: 10.842132674640132, lng: 106.80930916858262 }],
      places: [],
      currentPlace: null,

      routes: [],
      path: [],
    };
  },
  methods: {},
};
</script>

<style scoped>
/* Location */
.location-container {
  position: relative;
  padding-right: 30px;
  padding-left: 30px;
  margin-bottom: 0;
  padding-bottom: 2px;
  margin-top: 20px;
}
.location-container .address {
  /* border-bottom: 1px solid rgb(209, 206, 206); */
  padding-bottom: 13px;
}
.location-container .address:hover {
  cursor: pointer;
}
.location-icon {
  width: 15px;
  position: absolute;
  left: 0;
  top: 0px;
  text-align: center;
  height: 100%;
  min-height: 42px;
  color: #c7c2c2;
}
.location-icon-1 {
  width: 15px;
  left: 46%;
  text-align: center;
  height: 100%;
  min-height: 30;
  color: #c7c2c2;
}

/* Delete icon */
.delete-icon {
  position: absolute;
  top: 0;
  right: 20px;
  color: rgb(199, 194, 194);
}
.delete-icon:hover {
  cursor: pointer;
  color: rgb(84, 112, 204);
}
.update-icon {
  position: absolute;
  top: 0;
  right: 40px;
  color: rgb(199, 194, 194);
}
.update-icon:hover {
  cursor: pointer;
  color: rgb(84, 112, 204);
}
/* Add location button */
.add-location:hover {
  cursor: pointer;
  color: rgb(29, 73, 216);
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
</style>

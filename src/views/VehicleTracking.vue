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
          <a class="nav-link"> Vehicle Picker </a>
        </h3>
      </div>

      <div class="col-lg-12 mt-1" v-if="isMapRender">
        <gmap-map
          class="mb-3"
          ref="ggMap"
          :zoom="12"
          :center="vehicleCoord"
          style="width:100%;  height: 600px;"
        >
          <DirectionsRenderer
            v-if="directionEndCoord"
            travelMode="DRIVING"
            ref="mapRender"
            :origin="directionEndCoord"
            :destination="vehicleCoord"
          />
          <GmapMarker
            v-for="vehicle in vehicles"
            :key="vehicle.vehicleId"
            :position="vehicle.position"
            :label="{ text: vehicle.vehicleId, color: 'black' }"
            :icon="icon"
            @click="openInfoWindowTemplate(vehicle)"
          />
          <GmapMarker
            :position="vehicleCoord"
            :clickable="true"
            :label="{ text: vehicleId, color: 'red' }"
            :icon="needBackUpIcon"
          />
          <gmap-info-window
            v-if="infoVehicle"
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
            <b>Vehicle:</b>
            {{ infoVehicle.vehicleId }} <br />
            <b>Location:</b>
            {{ infoVehicle.distance.rows[0].elements[0].distance.value / 1000 }}
            km <br />
            <b>Driving Time:</b>
            {{
              formatDuration(
                infoVehicle.distance.rows[0].elements[0].duration.value
              )
            }}
            hours <br />
          </gmap-info-window>
        </gmap-map>
      </div>

      <div class="col-lg-12 mt-1 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <div class="three fields mt-4">
                <!-- Total Seats (Min) -->
                <div class="field">
                  <label>Total Seats (Min)</label>
                  <div class="ui corner labeled input">
                    <input
                      v-model="minSeat"
                      type="number"
                      max="10"
                      placeholder="Total Seats (Min)"
                      @blur="searchVehicle"
                    />
                  </div>
                </div>
                <!-- Total Seats (Max) -->
                <div class="field">
                  <label>Total Seats (Max)</label>
                  <div class="ui corner labeled input">
                    <input
                      v-model="maxSeat"
                      type="number"
                      max="10"
                      placeholder="Total Seats (Max)"
                      @blur="searchVehicle"
                    />
                  </div>
                </div>

                <!--Type -->
                <div class="field">
                  <label>Type</label>
                  <div class="ui corner labeled input">
                    <select
                      class="form-control form-control-sm"
                      name="status"
                      v-model="vehicleType"
                      @change="searchVehicle"
                    >
                      <option :value="''">
                        Select vehicle type
                      </option>
                      <option
                        v-for="vehicleType in this.vehicleTypes"
                        :key="vehicleType.vehicleTypeId"
                        :value="vehicleType.vehicleTypeId"
                        >{{ vehicleType.vehicleTypeName }}</option
                      >
                    </select>
                  </div>
                </div>
                <!-- Status -->
                <div class="field">
                  <label>Status</label>
                  <div class="ui corner labeled input">
                    <select
                      class="form-control form-control-sm"
                      name="status"
                      v-model="viewOption"
                      @change="searchVehicle"
                    >
                      <option :value="0">
                        Get avaible vehicles in allowable range
                      </option>
                      <option :value="1">
                        Get all available vehicles
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <table
              class="table tableBodyScroll"
              v-if="isDistanceCal && vehicles.length > 0"
            >
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <th>ID</th>
                  <th>MODEL</th>
                  <th>SEAT</th>
                  <th>TYPE</th>
                  <th>EXPECTED VALUE</th>
                  <th>EARNED VALUE</th>
                  <th>DISTNACE</th>
                  <th>DRIVING TIME</th>
                  <!-- <th>STATUS</th> -->
                  <th class="text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(vehicle, index) in this.vehicles"
                  :key="vehicle.vehicleId"
                >
                  <td class="text-secondary">{{ page * 15 + index + 1 }}</td>
                  <td>{{ vehicle.vehicleId }}</td>
                  <td>{{ vehicle.model }}</td>
                  <td>{{ vehicle.seats }}</td>
                  <td>{{ vehicle.vehicleType.vehicleTypeName }}</td>
                  <td>{{ vehicle.expectedValue }}</td>
                  <td>{{ vehicle.currentEarnedValue }}</td>
                  <td
                    class="badge"
                    :class="
                      isFar(vehicle.distance.rows[0].elements[0].distance.value)
                        ? 'badge-danger'
                        : 'badge-success'
                    "
                  >
                    {{
                      formatDistance(
                        vehicle.distance.rows[0].elements[0].distance.value
                      )
                    }}
                  </td>
                  <td>
                    {{
                      formatDuration(
                        vehicle.distance.rows[0].elements[0].duration.value
                      )
                    }}
                  </td>

                  <td class="row justify-content-center btn-action">
                    <button
                      class="btn btn-outline-info btn-rounded btn-icon mr-1"
                      :class="
                        isVehicleSelected(vehicle.vehicleId) === -1
                          ? 'btn-outline-info'
                          : 'btn-gradient-info'
                      "
                      @click="selectVehicle(vehicle.vehicleId)"
                    >
                      <i class="mdi mdi-account-check"></i>
                    </button>
                    <button
                      class="btn btn-info btn-rounded btn-icon mr-1"
                      @click="openInfoWindowTemplate(vehicle)"
                    >
                      <i class="mdi mdi-car"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="mt-4" v-if="this.totalVehicles > 15">
              <paginate
                v-model="currentPage"
                :page-count="Math.floor(this.totalVehicles / 15) + 1"
                :page-range="3"
                :margin-pages="1"
                :click-handler="clickCallback"
                :first-last-button="true"
                :prev-text="'Prev'"
                :next-text="'Next'"
                :container-class="'pagination'"
                :page-class="'page-item'"
                :next-class="'page-item'"
                :prev-class="'page-item'"
                :active-class="'page-active'"
              >
              </paginate>
            </div>

            <!-- Button group -->
            <div class="row justify-content-center mt-5">
              <button
                class="btn btn-gradient-info btn-fw ml-2"
                type="button"
                @click="handleDoneFunction"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Loading from "vue-loading-overlay";
// eslint-disable-next-line no-unused-vars
import * as firebase from "firebase";
import { RepositoryFactory } from "../repositories/RepositoryFactory";
import DirectionsRenderer from "../components/Google/CusDirectionsRenderer";
import moment from "moment";
const VehicleRepository = RepositoryFactory.get("vehicles");

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
    DirectionsRenderer,
  },
  async mounted() {
    this.isLoading = true;

    // Get need repair coordinate vehicle
    let coord = this.$route.params.coordinates.split(", ");
    this.vehicleCoord = {
      lat: Number(coord[0]),
      lng: Number(coord[1]),
    };
    // Init config from firestore
    await this.initConfig();

    await this.initTypes();

    this.startDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    this.endDate = moment(this.startDate)
      .add(4, "hours")
      .format("YYYY-MM-DD HH:mm:ss");

    await this.initVehiclesList();
    this.$gmapApiPromiseLazy().then(async () => {
      // Calculate distance
      await this.searchVehicle();
      // Icon
      this.icon = {
        url: "http://maps.google.com/mapfiles/kml/pal4/icon62.png",
        // eslint-disable-next-line no-undef
        labelOrigin: new google.maps.Point(15, 40),
      };
      this.needBackUpIcon = {
        url: "http://maps.google.com/mapfiles/kml/pal4/icon15.png",
        // eslint-disable-next-line no-undef
        labelOrigin: new google.maps.Point(15, 40),
      };
      this.isMapRender = true;
    });
  },

  data() {
    return {
      icon: { url: "http://maps.google.com/mapfiles/kml/pal4/icon62.png" },
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

      config: {},

      directionEndCoord: null,

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
      isDistanceCal: false,

      // Google map,
      center: { lat: 10.842132674640132, lng: 106.80930916858262 },
      vehicleCoord: { lat: 10.76963458965304, lng: 106.688211912765 },
      // markers: [{ lat: 10.842132674640132, lng: 106.80930916858262 }] , ,
      places: [],
      currentPlace: null,

      routes: [],
      path: [],

      // Recomendation vehicle
      statusList: [],
      searchVehicleId: "",
      vehicleType: "",
      searchStatusID: "",
      page: 0,
      currentPage: 0,
      vehicleTypes: [],
      selectedVehicle: "",
      startDate: "",
      endDate: "",
      vehicles: [],
      totalVehicles: 0,
      maxSeat: this.$route.params.minSeat,
      minSeat: this.$route.params.minSeat,
      viewOption: 0,

      // ----
      infoWindow: {
        position: { lat: 0, lng: 0 },
        open: false,
        template: "",
      },
      infoVehicle: null,
      needBackUpIcon: {
        url: "http://maps.google.com/mapfiles/kml/pal4/icon15.png",
      },
      // Need backup vehicle
      vehicleId: this.$route.params.vehicleId,
      // vehicleCoord: this.$route.params.coordinates,
      vehiclesId: this.$route.params.vehiclesId,
    };
  },
  methods: {
    // Map action
    ...mapActions("Contract", [
      "_getVehicleRecommendations",
      "_getVehicleRecommendationsCount",
    ]),
    // Init config
    async initConfig() {
      const db = firebase.firestore();
      const config = db.collection("Config").doc("Contract");
      let seft = this;
      await config.get().then((doc) => {
        seft.config = doc.data();
      });
    },
    openInfoWindowTemplate(item) {
      this.infoVehicle = item;
      // this.infoWindow;
      this.infoWindow.position = item.position;
      this.directionEndCoord = item.position;
      this.infoWindow.open = true;
      document.getElementById("app").scrollIntoView();
    },
    // Search vehicle
    async searchVehicle() {
      this.isLoading = true;
      this.isDistanceCal = false;
      await this.initVehiclesList();
      // Calculate distance
      await this.calculateDistance();
      this.initFarVehicle();
      this.sortVehicle();
      if (this.vehicles && this.vehicles.length > 0) {
        this.directionEndCoord = this.vehicles[0].position;
      }
      this.isDistanceCal = true;
      this.isLoading = false;
    },
    // Init types
    async initTypes() {
      await VehicleRepository.getVehicleType().then((res) => {
        this.vehicleTypes = res;
      });
    },
    // Init data for vehicle list
    async initVehiclesList() {
      await this._getVehicleRecommendations({
        startDate: this.startDate,
        endDate: this.endDate,
        seatsMin: this.minSeat,
        seatsMax: this.maxSeat,
        vehicleTypeId: this.vehicleType,
        viewOption: 0,
        bufferPre: this.config.contractPreBreakTime,
        bufferPost: this.config.contractPostBreakTime,
        pageNum: this.currentPage,
      }).then(async (res) => {
        this.vehicles = res;
      });

      const db = firebase.firestore();
      const tracking = db.collection("Users");
      for (const vehicle of this.vehicles) {
        await this.getCoordinates(tracking, vehicle);
      }

      this.totalVehicles = await this._getVehicleRecommendationsCount({
        startDate: this.startDate,
        endDate: this.endDate,
        seatsMin: this.minSeat,
        seatsMax: this.maxSeat,
        vehicleTypeId: this.vehicleType,
        viewOption: 0,
        bufferPre: this.config.contractPreBreakTime,
        bufferPost: this.config.contractPostBreakTime,
      });
    },
    //Init vehicle is far
    initFarVehicle() {
      if (this.viewOption === 0) {
        for (let i = 0; i < this.vehicles.length; i++) {
          if (
            this.isFar(
              this.vehicles[i].distance.rows[0].elements[0].distance.value
            )
          ) {
            this.$delete(this.vehicles, i);
          }
        }
      }
    },
    // Get coordinate
    getCoordinates(tracking, vehicle) {
      return new Promise((resolve) => {
        let doc = tracking.doc(vehicle.vehicleId);

        doc.onSnapshot((coord) => {
          let position = null;
          if (coord && coord.data()) {
            position = {
              lat: coord.data().lat,
              lng: coord.data().long,
            };
          } else {
            position = {
              lat: this.config.companyLat,
              lng: this.config.companyLng,
            };
          }
          vehicle.position = position;
          resolve();
        });
      });
    },
    // Calculate distance
    async calculateDistance() {
      for (const vehicle of this.vehicles) {
        let distance = await this.getDistance(
          vehicle.position.lat,
          vehicle.position.lng,
          this.vehicleCoord.lat,
          this.vehicleCoord.lng
        );
        vehicle.distance = distance;
      }
    },
    // Get distance
    getDistance(fromLat, fromLng, toLat, toLng) {
      return new Promise((resolve) => {
        // eslint-disable-next-line no-undef
        let origin = new google.maps.LatLng(fromLat, fromLng);
        // eslint-disable-next-line no-undef
        let destination = new google.maps.LatLng(toLat, toLng);
        // eslint-disable-next-line no-undef
        let service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [destination],
            travelMode: "DRIVING",
            // eslint-disable-next-line no-undef
            unitSystem: google.maps.UnitSystem.IMPERIAL,
            // avoidHighways: Boolean,
            // avoidTolls: Boolean,
          },
          (response, status) => {
            if (status !== "OK") return;
            resolve(response);
          }
        );
      });
    },
    // pagination handle
    async clickCallback(pageNum) {
      this.isLoading = true;
      this.currentPage = pageNum;
      this.page = pageNum - 1;
      this.searchVehicle();
      this.isLoading = false;
    },
    sortVehicle() {
      this.vehicles.sort((aVehicle, bVehicle) => {
        return (
          aVehicle.distance.rows[0].elements[0].duration.value -
          bVehicle.distance.rows[0].elements[0].duration.value
        );
      });
    },
    isFar(distance) {
      return this.config.maxDistanceSupport * 1000 < distance;
    },
    // format distance
    formatDistance(distance) {
      return distance / 1000;
    },
    // format duration
    formatDuration(duration) {
      return parseFloat(duration / 60).toFixed(2);
    },
    // isSeatAvailable
    // isSeatAvailable() {},
    // Handle select vehicle
    isVehicleSelected(vehicleId) {
      let index = -1;
      for (let i = 0; i < this.vehiclesId.length; i++) {
        if (vehicleId === this.vehiclesId[i]) {
          index = i;
        }
      }
      return index;
    },
    // Select vehicle
    selectVehicle(vehicleId) {
      let index = this.isVehicleSelected(vehicleId);
      if (index === -1) {
        this.vehiclesId.push(vehicleId);
      } else {
        this.$delete(this.vehiclesId, index);
      }
    },
    getDistanceById(vehicleId) {
      // this.vehicles.forEa
      this.vehicles.forEach((vehicle) => {
        if (vehicle.vehiclesId === vehicleId) {
          return vehicle.distance.rows[0].elements[0].distance.value;
        }
      });
      return 0;
    },
    // Back to request page
    handleDoneFunction() {
      let isFar = false;
      if (this.vehiclesId && this.vehiclesId.length > 0) {
        isFar = this.isFar(this.getDistanceById(this.vehiclesId[0]));
      }
      let res = {
        brokenVehicleLocation: this.$route.params.coordinates,
        far: isFar,
        requestId: this.$route.params.requestId,
        requestStatus: "ACCEPTED",
        vehiclesId: this.vehiclesId,
      };
      this.$router.push({
        name: "ChangeVehicleRequest",
        params: { requestId: this.$route.params.requestId, vehicleData: res },
      });
    },
  },
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

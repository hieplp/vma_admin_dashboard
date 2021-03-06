<template>
  <div class="row">
    <!-- DEPARTURE/DESTINATION TIME -->
    <div class="col-lg-12 grid-margin stretch-card">
      <div class="card">
        <div class="card-body">
          <div class="ui form">
            <h4 class="ui dividing header">
              {{ this.title }} DEPARTURE/DESTINATION TIME
            </h4>
            <div class="two fields">
              <!-- Departure Time -->
              <div class="field">
                <label>Departure Time</label>
                <div class=" corner labeled input">
                  <div class="w-100 mx-datepicker" v-if="isDetail">
                    <div class="mx-input-wrapper">
                      <input
                        type="text"
                        v-model="trip.departureTime"
                        class="mx-input"
                        readonly
                      />
                    </div>
                  </div>
                  <date-picker
                    v-else
                    class="w-100"
                    v-model="trip.departureTime"
                    :editable="false"
                    type="datetime"
                    @change="
                      () => {
                        this.trip.destinationTime = '';
                      }
                    "
                    :disabled-date="disableDepartureTime"
                    placeholder="Select date"
                  ></date-picker>
                  <!-- <input
                    type="datetime-local"
                    :min="minDateFrom"
                    :max="maxDateFrom"
                    @change="
                      () => {
                        this.trip.destinationTime = '';
                      }
                    "
                    :readonly="isDetail"
                    v-model="trip.departureTime"
                    placeholder="Departure Time"
                  /> -->
                  <!-- <div class="ui corner label" v-if="!isDetail">
                    <i class="asterisk icon"></i>
                  </div> -->
                </div>
                <div
                  class="ui pointing red basic label"
                  v-if="departureTimeErr"
                >
                  Departure time is required!
                </div>
              </div>
              <!-- Destination Time-->
              <div class="field ">
                <label>Destination Time</label>
                <div class="">
                  <div class="w-100 mx-datepicker">
                    <div class="mx-input-wrapper">
                      <input
                        type="text"
                        v-model="destinationTime"
                        class="mx-input"
                        readonly
                      />
                    </div>
                  </div>

                  <!-- <input
                    type="datetime-local"
                    v-model="destinationTime"
                    :min="trip.departureTime"
                    readonly
                    placeholder=" Destination Time"
                  /> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-12" v-if="isMapRender">
      <gmap-map
        class="mb-3"
        :center="center"
        :zoom="12"
        style="width:100%;  height: 400px;"
      >
        <DirectionsRenderer
          travelMode="DRIVING"
          ref="mapRender"
          :origin="origin"
          :destination="destination"
          :waypoints="waypoints"
        />
      </gmap-map>
    </div>

    <!-- Trip location -->
    <div class="col-lg-12 grid-margin stretch-card">
      <div class="card">
        <div class="card-body">
          <button
            class="ui icon right  button  edit-btn"
            v-if="title === 'RETURN TRIP'"
            @click="importLocation()"
          >
            <i class="angle double down icon"></i>
          </button>
          <h4 class="ui dividing header mb-5">{{ this.title }} LOCATIONS</h4>
          <draggable v-model="firstLocations">
            <transition-group>
              <div
                class="location-container row"
                v-for="(location, index) in firstLocations"
                :key="index"
              >
                <span class="col-1 location-icon">
                  <i
                    class="icon"
                    :class="{
                      'map marker alternate': index === 0,
                      'location arrow': index === firstLocations.length - 1,
                      'dot circle outline':
                        index !== 0 && index !== firstLocations.length - 1,
                    }"
                  ></i>
                  <!-- <i class="icon ellipsis vertical"></i> -->
                </span>
                <div
                  class="col-12 address ml-3"
                  @click="handleLocationClick(index, 1)"
                >
                  <span class="pac-target-input">{{ location.location }}</span>
                </div>
                <!-- <i
                  class="update-icon icon pencil alternate"
                  @click="handleLocationClick(index, 3)"
                  v-if="isUpdate"
                ></i> -->
                <i
                  class="delete-icon icon x"
                  @click="handleLocationClick(index, 2)"
                  v-if="!isDetail"
                ></i>
                <span
                  class="col-1 location-icon-1"
                  v-if="
                    firstLocations.length > 1 &&
                      index !== firstLocations.length - 1
                  "
                >
                  <i class="icon ellipsis vertical"></i>
                </span>
              </div>
            </transition-group>
          </draggable>
          <div
            class="row address mt-4 justify-content-center add-location"
            @click="handleAddressModal(1)"
            v-if="!isDetail"
          >
            <i class="icon plus circle"></i>
            <span>
              Add location
            </span>
          </div>
          <div class="row justify-content-center">
            <div class="ui pointing red basic label" v-if="isErr">
              Departure and destination locations are required!
            </div>
          </div>
        </div>
      </div>
    </div>

    <AddressModal
      v-if="isAddressModal"
      ref="addressModal"
      :address="selectedLocation"
      :cancelFunction="
        () => {
          this.handleAddressModal(1);
        }
      "
      :doneFunction="
        () => {
          this.handleDoneAddressModal();
        }
      "
    />
  </div>
</template>

<script>
import draggable from "vuedraggable";
import AddressModal from "../components/Modal/AddressModal";
import DirectionsRenderer from "../components/Google/DirectionsRenderer";
import moment from "moment";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
export default {
  props: {
    title: String,
    endDateChange: Function,
    propTrip: Object,
    importLocation: Function,
    isUpdate: Boolean,
    isDetail: Boolean,
    isCreate: Boolean,
  },
  components: {
    draggable,
    AddressModal,
    DirectionsRenderer,
    DatePicker,
  },
  mounted() {
    this.isLoading = true;
    this.maxDate = moment(new Date()).format("YYYY-MM-DDTkk:mm");
    if (this.propTrip) {
      this.initData(this.propTrip);
      this.isMapRender = true;
    }
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
      isMapRender: true,
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
      // Error
      departureTimeErr: false,
      destinationTimeErr: false,
      // trip
      trip: {
        contractTripId: "",
        departureLocation: "",
        departureTime: "",
        destinationLocation: "",
        // destinationTime: "",
        locations: [],
        assignedVehicles: [],
      },

      isLoading: false,

      // Google map,
      center: { lat: 10.842132674640132, lng: 106.80930916858262 },
      // markers: [{ lat: 10.842132674640132, lng: 106.80930916858262 }],
      places: [],
      currentPlace: null,
      autocompleteOptions: {
        componentRestrictions: {
          country: ["vn"],
        },
        fields: ["geometry", "formatted_address", "address_components"],
      },

      routes: [],
    };
  },
  methods: {
    // Set trip destination
    setTripDestination(destinationTime) {
      this.trip.destinationTime = moment(destinationTime).format(
        "YYYY-MM-DD HH:mm:ssz"
      );
    },
    // Min and max date
    disableDepartureTime(date) {
      return (
        date < new Date(this.minDateFrom) || date > new Date(this.maxDateFrom)
      );
    },
    // Google map
    // Handle address picker
    handleAddressModal(type) {
      if (this.isUpdate && type === 2) {
        return;
      }
      this.selectedType = type;
      if (type === 1) {
        this.selectedLocation = null;
      }
      this.isAddressModal = !this.isAddressModal;
      // this.firstLocations.push({ location: "" });
    },
    // Handle done address modal
    handleDoneAddressModal() {
      let location = this.$refs.addressModal.getData();
      if (location) {
        switch (this.selectedType) {
          case 1:
            this.firstLocations.push({ location: location });
            break;
          case 2:
            this.firstLocations[this.index] = {
              location: location,
            };
            break;
        }
        this.handleAddressModal("");
      }
    },
    // Handle click on location
    handleLocationClick(index, type) {
      switch (type) {
        case 2:
          this.$delete(this.firstLocations, index);
          break;
        case 1:
          this.handleAddressModal(2);
          this.index = index;
          this.selectedLocation = this.firstLocations[this.index].location;
          break;
      }
    },
    getData() {
      this.isErr = this.firstLocations.length < 2;
      this.departureTimeErr = this.trip.departureTime.length === 0;
      this.destinationTimeErr = this.destinationTime.length === 0;
      let isValid =
        this.isErr || this.departureTimeErr || this.destinationTimeErr;
      if (!isValid) {
        let locations = Object.assign([], this.firstLocations);
        let trip = Object.assign({}, this.trip);

        // Format date
        trip.departureTime = moment(trip.departureTime).format(
          "YYYY-MM-DD HH:mm:ssz"
        );
        trip.destinationTime = moment(trip.destinationTime).format(
          "YYYY-MM-DD HH:mm:ssz"
        );
        trip.departureLocation = locations[0].location;
        trip.destinationLocation = locations[locations.length - 1].location;
        // this.$delete(locations, 0);
        // this.$delete(locations, locations.length - 1);
        trip.locations = locations;
        return trip;
      }
    },

    // init data
    initData(trip) {
      this.firstLocations = [];
      this.firstLocations = trip.locations;
      this.trip.assignedVehicles = trip.assignedVehicles;
      this.trip.contractTripId = trip.contractTripId;
      if (this.isDetail) {
        this.trip.departureTime = moment(trip.departureTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else {
        this.trip.departureTime = new Date(trip.departureTime);
      }
      // this.destinationTime = moment(trip.destinationTime).format(
      //   "YYYY-MM-DDTkk:mm"
      // );
    },
    // Vehicle picker
    dateChange() {
      this.endDateChange();
      this.$refs.vehiclePicker.startDate = this.trip.departureTime;
      this.$refs.vehiclePicker.endDate = this.destinationTime;
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

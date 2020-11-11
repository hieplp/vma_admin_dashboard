<template>
  <div class="content-wrapper" ref="container">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <div class="page-header">
      <h3 class="page-title test">
        <a @click="$router.go(-1)" href="javascript:void(0)">
          {{
            this.prevRoute === null ||
            (this.prevRoute !== null && this.prevRoute.name !== "Contributor")
              ? "Vehicles"
              : this.prevRoute.name
          }}
        </a>
        <span class="text-secondary">/</span>
        <span>
          {{ this.$route.params.vehicleId }}
        </span>
      </h3>
    </div>

    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui two steps">
              <button
                class="step"
                v-on:click="changeTab()"
                v-bind:class="{ active: isVehiclenfoVisible }"
              >
                <i class="ui bus icon"></i>
                <div class="content">
                  <div class="title">BASIC INFORMATION</div>
                </div>
              </button>
              <button
                class="step"
                v-on:click="changeTab()"
                v-bind:class="{ active: !isVehiclenfoVisible }"
              >
                <i class="mdi mdi-file-document icon"></i>
                <div class="content">
                  <div class="title">DOCUMENT</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Vehicle Information -->
    <div class="card" v-if="isVehiclenfoVisible && isVehiclenfoLoading">
      <div class="card-body">
        <div class="ui form">
          <h4 class="ui dividing header">
            BASIC INFORMATION
          </h4>

          <div class="field">
            <label>Vehicle Image</label>
          </div>

          <div class="row justify-content-center">
            <label for="up-pro-pho" class="upload-pro">
              <img
                :src="vehicle.imageLink"
                class="ui medium  image pro-img"
                alt="image"
                @click="viewProfilePhoto()"
                v-if="
                  profileImage === null &&
                    vehicle.imageLink !== null &&
                    vehicle.imageLink.length > 0
                "
              />
              <i class="car icon" v-else></i>
            </label>
          </div>

          <div class="two fields mt-5">
            <!-- Chassis Number -->
            <div class="field">
              <label>Chassis Number/VIN</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  v-model="vehicle.chassisNumber"
                  placeholder="Chassis Number/ VIN"
                  style="text-transform:uppercase"
                  readonly
                />
              </div>
            </div>
            <!-- Engine Number -->
            <div class="field">
              <label>Engine Number</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  placeholder="Engine Number"
                  v-model="vehicle.engineNumber"
                  style="text-transform:uppercase"
                  readonly
                />
              </div>
            </div>
            <!-- Model -->
            <div class="field">
              <label>Model</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  placeholder="Model"
                  v-model="vehicle.model"
                  readonly
                />
              </div>
            </div>
          </div>

          <div class="two fields">
            <!-- Brand -->
            <div class="field">
              <label>Brand</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  placeholder="Brand"
                  v-model="vehicle.brand.brandName"
                  readonly
                />
              </div>
            </div>
            <!-- Origin -->
            <div class="field">
              <label>Origin</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  placeholder="Brand"
                  v-model="vehicle.origin"
                  readonly
                />
              </div>
            </div>
            <!-- Year Of Manufacture -->
            <div class="field">
              <label>Year Of Manufacture</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  v-model="vehicle.yearOfManufacture"
                  placeholder="Year Of Manufacture"
                  readonly
                />
              </div>
            </div>
          </div>

          <div class="two fields">
            <!-- Seat -->
            <div class="field ">
              <label>Total Seats</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  v-model="vehicle.seats"
                  placeholder="Year Of Manufacture"
                  readonly
                />
              </div>
            </div>
            <!-- Vehicle Type -->
            <div class="field">
              <label>Vehicle Type</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  v-model="vehicle.vehicleType.vehicleTypeName"
                  placeholder="Vehicle Type"
                  readonly
                />
              </div>
            </div>
            <!--Total Distance Driven -->
            <div class="field">
              <label>Total Distance Driven</label>
              <div class="ui corner labeled input">
                <input
                  v-model="vehicle.distanceDriven"
                  type="text"
                  placeholder="Total Distance Driven"
                  readonly
                />
              </div>
            </div>
            <!-- Owner -->
            <div class="field ">
              <label>Owner</label>
              <div class="ui action input">
                <input
                  v-model="vehicle.owner.userName"
                  type="text"
                  readonly
                  placeholder="Pick an owner"
                />
                <button
                  class="ui right labeled icon button"
                  @click="
                    () => {
                      this.$router.push({
                        name: 'ContributorDetail',
                        params: { userId: vehicle.ownerId },
                      });
                    }
                  "
                >
                  <i class="users icon"></i>
                  View
                </button>
              </div>
            </div>
          </div>

          <!-- Button group -->
          <div class="row justify-content-center mt-5">
            <button
              class="btn btn-gradient-info btn-fw ml-2"
              type="button"
              v-on:click="changeTab()"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Vehicle document -->
    <div class="row" v-else>
      <div
        class="col-lg-12 grid-margin stretch-card"
        v-for="document in documents"
        :key="document.vehicleDocumentId"
      >
        <VehicleDocument
          :title="document.vehicleDocumentType"
          :document="document"
        />
      </div>
      <!-- Confirm Group -->
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui form">
              <!-- Button group -->
              <div class="row justify-content-center">
                <button
                  class="btn btn-gradient-danger btn-fw ml-2"
                  type="button"
                  v-on:click="changeTab()"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Light box -->
    <LightBox ref="lightbox" :media="media" :showLightBox="false"></LightBox>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import LightBox from "vue-image-lightbox";
import { RepositoryFactory } from "../../repositories/RepositoryFactory";
require("vue-image-lightbox/dist/vue-image-lightbox.min.css");

import VehicleDocument from "../../components/Vehicle/ReadOnlyDocument";

const VehicleRepository = RepositoryFactory.get("vehicles");
const VehicleDocRepos = RepositoryFactory.get("vehicleDocument");

export default {
  name: "VehicleDetail",
  components: {
    Loading,
    LightBox,
    VehicleDocument,
  },
  data() {
    return {
      vehicle: {
        assignedDriverId: "",
        brandName: "",
        chassisNumber: "",
        dateOfRegistration: "",
        distanceDriven: 0,
        engineNumber: "",
        imageLink: "",
        model: "",
        origin: "",
        ownerId: "",
        seats: 0,
        vehicleId: "",
        vehicleStatus: "",
        vehicleTypeName: "",
        yearOfManufacture: "",
      },
      documents: [],
      // Profile image
      profileImage: null,
      profileImagePrev: null,
      isVehiclenfoVisible: true,
      isVehiclenfoLoading: false,
      isLoading: false,
      media: [
        {
          thumb: "",
          src: "",
        },
      ],
      prevRoute: null,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  async mounted() {
    this.isLoading = true;
    await this.initVehicle();
    await this.initDocuments();
    this.isLoading = false;
  },
  methods: {
    // Init vehicle information
    async initVehicle() {
      await VehicleRepository.getDetailVehicle(
        this.$route.params.vehicleId
      ).then((res) => {
        this.vehicle = res;
        this.isVehiclenfoLoading = true;
      });
    },
    // Init documents information
    async initDocuments() {
      await VehicleDocRepos.getDocuments(this.$route.params.vehicleId).then(
        (res) => {
          this.documents = res;
        }
      );
    },
    changeTab() {
      document.getElementById("app").scrollIntoView();
      this.isVehiclenfoVisible = !this.isVehiclenfoVisible;
    },
    viewProfilePhoto() {
      this.media = [];
      let temp = {
        thumb: this.vehicle.imageLink,
        src: this.vehicle.imageLink,
      };
      this.media.push(temp);
      this.$refs.lightbox.showImage(0);
    },
    openGallery(img, index) {
      this.media = img;
      this.$refs.lightbox.showImage(index);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.field label {
  margin-top: 10px !important;
}

.step i {
  color: #047edf !important;
}
.upload-pro img {
  /* border-radius: 50%; */
  width: 400px !important;
  height: 280px !important;
  border-radius: 2% !important;
}
.car.icon {
  font-size: 250px;
  width: 400px !important;
  height: 280px !important;
  color: rgb(161, 161, 165);
  border: rgb(214, 214, 221) 1px solid;
  border-radius: 2%;
}

.upload-pro-plus {
  position: absolute;
  z-index: 1000;
  background-color: rgba(221, 209, 209, 0.5);
  color: rgb(138, 135, 135);
  width: 100%;
  height: 100%;
  top: 0%;
  left: 0%;
  font-size: 80px;
  border-radius: 2% !important;
  visibility: hidden;
}

.ui.large.image:hover {
  cursor: pointer;
}
.pro-img:hover {
  cursor: pointer;
}
.badge {
  font-size: 13px;
}

.ui.right.labeled {
  background-color: #3497e9;
  color: rgb(255, 255, 255);
}
</style>
<style>
@import "../../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>

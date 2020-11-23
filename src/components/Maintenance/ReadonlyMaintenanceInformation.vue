<template>
  <div class="col-lg-12 grid-margin stretch-card">
    <div class="card">
      <div class="card-body">
        <div class="ui form">
          <h4 class="ui dividing header">
            MAINTENANCE INFORMATION
          </h4>

          <div class="field">
            <label>Maintenance Image</label>
          </div>

          <div class="row justify-content-center">
            <label for="up-pro-pho" class="upload-pro">
              <img
                :src="maintenance.imageLink"
                class="ui medium  image pro-img"
                alt="image"
                @click="viewProfilePhoto()"
                v-if="
                  profileImage === null &&
                    maintenance.imageLink !== null &&
                    maintenance.imageLink.length > 0
                "
              />
              <i class="file alternate icon" v-else></i>
            </label>
          </div>
          <div class="two fields mt-5">
            <!-- Start Date -->
            <div class="field">
              <label>Start Date</label>
              <div class="ui corner labeled input">
                <input type="date" v-model="maintenance.startDate" readonly />
              </div>
            </div>
            <!-- End Date -->
            <div class="field">
              <label>End Date</label>
              <div class="ui corner labeled input">
                <input type="date" v-model="maintenance.endDate" readonly />
              </div>
            </div>
            <!--  Type -->
            <div class="field ">
              <label>Type</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  class="ui fluid dropdown"
                  v-model="maintenance.maintenanceType"
                  readonly
                />
              </div>
            </div>
          </div>

          <div class="two fields">
            <!--Cost -->
            <div class="field">
              <label>Cost</label>
              <div class="ui corner labeled input">
                <input
                  v-model="maintenance.cost"
                  type="text"
                  placeholder="Cost"
                  readonly
                />
              </div>
            </div>
            <!-- Vehicle -->
            <div class="field ">
              <label>Vehicle</label>
              <div class="ui action input">
                <input
                  v-model="maintenance.vehicleId"
                  type="text"
                  readonly
                  placeholder="Pick an vehicle"
                />
                <button
                  class="ui right labeled icon button"
                  @click="
                    () => {
                      this.$router.push({
                        name: 'VehicleDetail',
                        params: { vehicleId: maintenance.vehicleId },
                      });
                    }
                  "
                >
                  <i class="bus icon"></i>
                  View
                </button>
              </div>
              <div class="ui pointing red basic label" v-if="isVehicleErr">
                Vehicle is required!
              </div>
            </div>
          </div>
          <!--Description -->
          <div class="field">
            <label>Description</label>
            <div class="ui corner labeled input">
              <textarea
                v-model="maintenance.description"
                type="text"
                rows="5"
                placeholder="Description"
                readonly
              />
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
import LightBox from "vue-image-lightbox";
require("vue-image-lightbox/dist/vue-image-lightbox.min.css");
export default {
  components: { LightBox },
  props: {
    propMaintenance: Object,
    isUpdate: Boolean,
    isContributor: Boolean,
    create: Function,
  },
  data() {
    return {
      maintenance: {
        cost: "",
        description: "",
        endDate: "",
        imageLink: "",
        maintenanceType: "PERIODIC_MAINTENANCE",
        startDate: "",
        vehicleId: "",
      },
      media: [
        {
          thumb: "",
          src: "",
        },
      ],
      // Basic Information Error
      isStartDateErr: false,
      isEndDateErr: false,
      isCostErr: false,
      isTypeErr: false,
      isVehicleErr: false,
      isDescriptionErr: false,
      isVehicleImgErr: false,

      // Profile image
      profileImage: null,
      profileImagePrev: null,

      // maintenance vehicle modal
      isVehicleModalVisible: false,
    };
  },
  async mounted() {
    //If there is a maintenance data
    if (this.propMaintenance) {
      console.log("mounted -> this.propMaintenance", this.propMaintenance);
      this.initData();
    }
    // Init max birthdate = current year - 18
  },
  methods: {
    // Init
    // Init data when is update
    initData() {
      this.maintenance = Object.assign({}, this.propMaintenance);
    },

    viewProfilePhoto() {
      this.media = [];
      let temp = {
        thumb: this.maintenance.imageLink,
        src: this.maintenance.imageLink,
      };
      this.media.push(temp);
      this.$refs.lightbox.showImage(0);
    },
  },
};
</script>

<style scoped>
@import "../../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";

.pro-img:hover {
  cursor: pointer;
}

.upload-pro img {
  /* border-radius: 50%; */
  width: 400px !important;
  height: 280px !important;
  border-radius: 2%;
}
.file.alternate.icon {
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
.upload-pro-plus i {
  position: absolute;
  left: 40%;
  top: 35%;
}

.ui.right.labeled {
  background-color: #3497e9;
  color: rgb(255, 255, 255);
}
</style>

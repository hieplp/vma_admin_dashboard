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
      <h3 class="page-title ">
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

    <!-- Delete confimation -->
    <Confirmation
      icon="trash alternate"
      title="Delete Confirmation"
      subTitle="Do you want to delete this contract?"
      rightBtnTitle="Delete"
      rightBtnIcon="trash alternate"
      rightBtnColor="red"
      leftBtnTitle="Cancel"
      leftBtnIcon="x"
      leftBtnColor="blue"
      v-if="isDeleteConVisible"
      :handleLeftBtn="
        () => {
          this.isDeleteConVisible = !this.isDeleteConVisible;
        }
      "
      :handleRightBtn="deleteContract"
    />

    <!-- Error message -->
    <MessageModal
      title="Delete Contract Fail!"
      icon="frown outline "
      :subTitle="errMsg"
      :proFunc="
        () => {
          this.isError = !this.isError;
        }
      "
      v-if="isError"
    />
    <!-- Success message -->
    <MessageModal
      title="Delete Contract Successfully!"
      icon="check circle"
      :subTitle="
        `Contract with id ${this.deleteVehicleId} is deleted successfully.`
      "
      :proFunc="
        () => {
          this.isSuccess = !this.isSuccess;
        }
      "
      v-if="isSuccess"
    />

    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <div class="ui three steps">
              <button
                class="step"
                v-on:click="changeTab('isVehiclenfoVisible')"
                v-bind:class="{ active: isVehiclenfoVisible }"
              >
                <i class="ui bus icon"></i>
                <div class="content">
                  <div class="title">BASIC INFORMATION</div>
                </div>
              </button>
              <!-- v-if="vehicle.values && vehicle.values.length > 0" -->
              <button
                class="step"
                v-if="vehicle.owner && vehicle.owner.userName !== 'Admin'"
                v-on:click="changeTab('isContractVisible')"
                v-bind:class="{ active: isContractVisible }"
              >
                <i class="newspaper outline icon"></i>
                <div class="content">
                  <div class="title">CONTRACT</div>
                </div>
              </button>
              <button
                class="step"
                v-on:click="changeTab('isDocumentVisible')"
                v-bind:class="{ active: isDocumentVisible }"
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

          <div class="row justify-content-center mt-4">
            <p
              class="badge"
              v-if="vehicle.vehicleStatus"
              v-bind:class="{
                'badge-info': vehicle.vehicleStatus === 'AVAILABLE',
                'badge-danger':
                  vehicle.vehicleStatus === 'MAINTENANCE' ||
                  vehicle.vehicleStatus === 'REPAIRING' ||
                  vehicle.vehicleStatus === 'RETURNING' ||
                  vehicle.vehicleStatus === 'NEED_REPAIR',
                'badge-primary': vehicle.vehicleStatus === 'ON_ROUTE',
                'badge-success':
                  vehicle.vehicleStatus === 'AVAILABLE_NO_DRIVER',
                'badge-warning': vehicle.vehicleStatus === 'PENDING_APPROVAL',
                'badge-dark':
                  vehicle.vehicleStatus === 'DELETED' ||
                  vehicle.vehicleStatus === 'REJECTED',
              }"
            >
              {{ vehicle.vehicleStatus }}
            </p>
            <div class="badge ml-1 dropdown">
              <i
                class="ui icon edit outline dropdown-toggle"
                type="button"
                data-toggle="dropdown"
              />
              <ul class="dropdown-menu">
                <div v-for="status in statusList" :key="status">
                  <button class="mt-1" @click="updateStatus(status)">
                    {{ status }}
                  </button>
                  <li class="divider"></li>
                </div>
              </ul>
            </div>
          </div>

          <div class="two fields mt-5">
            <!-- Chassis Number -->
            <div class="field">
              <label>License Plate Number</label>
              <div class="ui corner labeled input">
                <input
                  type="text"
                  v-model="vehicle.vehicleId"
                  placeholder="Chassis Number/ VIN"
                  style="text-transform:uppercase"
                  readonly
                />
              </div>
            </div>
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
            <!-- Assigned driver -->
            <div class="field ">
              <label>Driver</label>
              <div class="ui action input">
                <input v-model="assignedDriver.userName" type="text" readonly />
                <button
                  class="ui right labeled icon button "
                  type="button"
                  data-toggle="dropdown"
                >
                  <i class="users icon"></i>
                  View
                </button>
                <ul class="dropdown-menu ">
                  <button
                    @click="
                      () => {
                        this.$router.push({
                          name: 'DriverDetail',
                          params: { userId: assignedDriver.userId },
                        });
                      }
                    "
                    class="mb-1"
                    v-if="assignedDriver.userId"
                  >
                    Current driver
                  </button>
                  <li class="divider"></li>
                  <button
                    class="mt-1"
                    @click="
                      () => {
                        this.$router.push({
                          name: 'AssignedDriversHistory',
                          params: { vehicleId: vehicle.vehicleId },
                        });
                      }
                    "
                  >
                    Driver history
                  </button>
                </ul>
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
                  v-model="vehicle.seatsModel.seats"
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
                      if (vehicle.owner.userName !== 'Admin') {
                        this.$router.push({
                          name: 'ContributorDetail',
                          params: { userId: vehicle.owner.userId },
                        });
                      }
                    }
                  "
                >
                  <i class="users icon"></i>
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-else-if="isContractVisible">
      <div class="grid-margin stretch-card col-12">
        <div class="card">
          <div class="card-body">
            <div class="page-header">
              <h4 class="card-title">Contract List</h4>
              <div class="dropdown">
                <button
                  class="btn btn-icon-text mr-2"
                  type="button"
                  :class="{
                    'cus-disable': isContractActive,
                    'btn-gradient-info': !isContractActive,
                  }"
                  :disable="isContractActive"
                  @click="
                    () => {
                      if (!isContractActive) {
                        this.$router.push({
                          name: 'CreateVehicleContract',
                          params: { vehicleId: vehicle.vehicleId },
                        });
                      }
                    }
                  "
                >
                  <i class="mdi mdi-plus-box btn-icon-prepend"></i>
                  Create
                </button>
              </div>
            </div>

            <table class="table" v-if="vehicle.values.length > 0">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <th>ID</th>
                  <th>START DATE</th>
                  <th>END DATE</th>
                  <th>VALUE</th>
                  <th>STATUS</th>
                  <th class="text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(contract, index) in this.vehicle.values"
                  :key="contract.contractId"
                >
                  <td class="text-secondary">{{ index + 1 }}</td>
                  <td>{{ contract.vehicleValueId }}</td>
                  <td>{{ contract.startDate }}</td>
                  <td>{{ contract.endDate }}</td>
                  <td>{{ contract.value }}</td>
                  <td>
                    <label
                      class="badge"
                      :class="{
                        'badge-info': isContractAvailable(
                          contract.startDate,
                          contract.endDate,
                          contract.deleted
                        ),
                        'badge-danger': !isContractAvailable(
                          contract.startDate,
                          contract.endDate,
                          contract.deleted
                        ),
                        'badge-dark': contract.deleted,
                      }"
                      >{{
                        contract.deleted
                          ? "DELETED"
                          : isContractAvailable(
                              contract.startDate,
                              contract.endDate,
                              contract.deleted
                            )
                          ? "ACTIVE"
                          : "EXPIRED"
                      }}</label
                    >
                  </td>

                  <td class="row justify-content-center btn-action">
                    <button
                      class="btn btn-gradient-danger btn-rounded btn-icon mr-1 mt-1"
                      @click="
                        handleDialog(
                          'isDeleteConVisible',
                          contract.vehicleValueId,
                          index
                        )
                      "
                      :disabled="
                        contract.deleted ||
                          !isContractAvailable(
                            contract.startDate,
                            contract.endDate
                          )
                      "
                    >
                      <i class="mdi mdi-delete-forever"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Empty list -->
            <div class="card empty-list" v-else>
              <i class="mdi mdi-newspaper"></i>
              <h1>NOTHING</h1>
              <h3>Your list is empty.</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Vehicle document -->
    <div class="row" v-else-if="isDocumentVisible">
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
    </div>
    <!-- Light box -->
    <LightBox ref="lightbox" :media="media" :showLightBox="false"></LightBox>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Loading from "vue-loading-overlay";
import LightBox from "vue-image-lightbox";
import moment from "moment";
import { RepositoryFactory } from "../../repositories/RepositoryFactory";
require("vue-image-lightbox/dist/vue-image-lightbox.min.css");
import Confirmation from "../../components/Modal/Confirmation";
import MessageModal from "../../components/Modal/MessageModal";
import VehicleDocument from "../../components/Vehicle/ReadOnlyDocument";

const VehicleDocRepos = RepositoryFactory.get("vehicleDocument");

export default {
  name: "VehicleDetail",
  components: {
    Loading,
    LightBox,
    VehicleDocument,
    Confirmation,
    MessageModal,
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
      statusList: [],
      documents: [],
      // Assigned driver
      assignedDriver: {
        userId: "",
        userName: "N/A",
      },
      // Profile image
      profileImage: null,
      profileImagePrev: null,
      isVehiclenfoVisible: true,
      isContractVisible: false,
      isDocumentVisible: false,
      isVehiclenfoLoading: false,
      isDeleteConVisible: false,
      isError: false,
      errMsg: "",
      isSuccess: false,
      isLoading: false,
      media: [
        {
          thumb: "",
          src: "",
        },
      ],
      prevRoute: null,

      // Contract
      isContractActive: false,
      vehicleValueId: "",
      index: 0,
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
    this.initStatusList();
    await this.initDocuments();
    this.isLoading = false;
  },
  methods: {
    // Map state
    ...mapActions("Vehicle", [
      "_getDetailVehicle",
      "_deleteContract",
      "_updateVehicleStatus",
    ]),
    // Init vehicle information
    async initVehicle() {
      await this._getDetailVehicle(this.$route.params.vehicleId).then((res) => {
        this.vehicle = res;
        if (this.vehicle.assignedDriver) {
          this.assignedDriver = this.vehicle.assignedDriver;
        }
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
    // --- Contract ---
    // Init data for Vehicle Status Dropdown
    initStatusList() {
      this.statusList = require("../../assets/json/vehicle/status.json");
    },
    // Update status
    async updateStatus(status) {
      this.isLoading = true;
      await this._updateVehicleStatus({
        vehicleId: this.vehicle.vehicleId,
        status: status,
      })
        .then((res) => {
          if (res) {
            this.vehicle.vehicleStatus = status;
          }
        })
        .catch((err) => {
          console.error(err);
        });
      this.isLoading = false;
    },
    // ---------------
    changeTab(step) {
      document.getElementById("app").scrollIntoView();
      this.isVehiclenfoVisible = step === "isVehiclenfoVisible" ? true : false;
      this.isContractVisible = step === "isContractVisible" ? true : false;
      this.isDocumentVisible = step === "isDocumentVisible" ? true : false;
    },
    // Contact ----------->
    // Check is contract available
    isContractAvailable(startDate, endDate, isDeleted) {
      if (isDeleted) {
        return false;
      }
      let date = Number(moment(new Date()).format("YYYYMMDD"));
      let startNum = Number(startDate.replaceAll("-", ""));
      let endNum = Number(endDate.replaceAll("-", ""));
      if (startNum <= date && endNum >= date) {
        this.isContractActive = true;
        return true;
      }
      return false;
    },
    // Delete contract
    async deleteContract() {
      this.handleDialog("isDeleteConVisible", "");
      this.isLoading = true;
      await this._deleteContract(this.vehicleValueId)
        .then((res) => {
          if (res) {
            this.isSuccess = true;
            this.vehicle.values[this.index].deleted = true;
            console.log(
              "deleteContract -> this.vehicle.values[this.index]",
              this.vehicle.values[this.index]
            );
          }
        })
        .catch((err) => {
          this.isError = !this.isError;
          this.errMsg = err.debugMessage;
        });
      this.isLoading = false;
    },
    // Close delete contract confimation dialog
    handleDialog(dialogName, vehicleValueId, index) {
      if (vehicleValueId.length !== 0) {
        this.vehicleValueId = vehicleValueId;
        this.index = index;
      }
      this.$data[dialogName] = !this.$data[dialogName];
    },
    /// End of contract
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

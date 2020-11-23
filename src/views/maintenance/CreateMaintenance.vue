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
        <router-link to="/maintenances">
          Maintenances
        </router-link>
        <span class="text-secondary">/</span>
        <span>
          Create maintenance
        </span>
      </h3>
    </div>
    <!-- Error message -->
    <MessageModal
      title="Create Maintenance Fail!"
      icon="frown outline "
      :subTitle="errMsg"
      :proFunc="handleErrorModal"
      v-if="isError"
    />
    <!-- Success message -->
    <MessageModal
      title="Create Maintenance Successfully!"
      icon="check circle"
      :subTitle="`Maintenance is created successfully.`"
      :proFunc="handleSuccessModal"
      v-if="isSuccess"
    />

    <!-- User Information -->
    <MaintenanceInformation
      ref="maintenanceInformation"
      :create="
        () => {
          this.create();
        }
      "
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import * as firebase from "firebase";
import Loading from "vue-loading-overlay";
import moment from "moment";
import MaintenanceInformation from "../../components/Maintenance/MaintenanceInformation";
import MessageModal from "../../components/Modal/MessageModal";

export default {
  name: "CreateMaintenance",
  components: {
    Loading,
    MaintenanceInformation,
    MessageModal,
  },
  data() {
    return {
      maintenance: {},
      // Profile image
      profileImage: null,
      imageData: null,

      isLoading: false,
      isError: false,
      isSuccess: false,
      errMsg: "",

      // Document
      docOptions: [],
      documentValue: [],
      index: 0,
    };
  },
  mounted() {},
  methods: {
    // mapActions
    ...mapActions("Maintenance", ["_create"]),
    // Upload image to firebase
    uploadImageToFirebase(imageData, imgTypeName) {
      return new Promise((resolve) => {
        let date = moment(new Date()).format("YYYYMMDDHHmmss");
        const storageRef = firebase
          .storage()
          .ref(
            imgTypeName + "-" + this.maintenance.maintenanceType + "-" + date
          )
          .put(imageData);
        storageRef.on(
          `state_changed`,
          (snapshot) => {
            this.uploadValue =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            console.log(error.message);
          },
          () => {
            this.uploadValue = 100;
            storageRef.snapshot.ref.getDownloadURL().then((url) => {
              resolve(url);
            });
          }
        );
      });
    },
    // Create
    async create() {
      let isValid = this.$refs.maintenanceInformation.checkBasicInformation();
      // isValid = false;
      if (!isValid) {
        this.isLoading = true;
        let maintenanceInformation = this.$refs.maintenanceInformation.getData();
        this.maintenance = maintenanceInformation.maintenance;
        this.profileImage = maintenanceInformation.image;

        // Init image for profile
        if (this.profileImage) {
          this.maintenance.imageLink = await this.uploadImageToFirebase(
            this.profileImage,
            "profile"
          );
          this.profileImage = null;
        }
        // Call api to create new maintenance
        await this._create({ maintenance: this.maintenance })
          .then((res) => {
            if (res) {
              this.isSuccess = true;
            }
          })
          .catch((ex) => {
            if (ex.debugMessage) {
              this.isError = true;
              this.errMsg = ex.debugMessage;
            }
            console.error(ex);
          });
        this.isLoading = false;
      }
    },
    // Close Error Modal
    handleErrorModal() {
      this.isError = !this.isError;
    },
    // Close Error Modal
    handleSuccessModal() {
      this.isSuccess = !this.isSuccess;
      this.$router.push({
        name: "Maintenances",
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";

.field label {
  margin-top: 10px !important;
}
.asterisk.icon {
  color: red;
}

.step i {
  color: #047edf !important;
}

.cus-select {
  padding-left: 26px !important;
}
.cus-disable {
  background-color: #858585 !important;
  color: white;
}
</style>

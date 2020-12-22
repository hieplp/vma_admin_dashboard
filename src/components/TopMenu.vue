<template>
  <nav
    class="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row"
  >
    <div
      class="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center"
    >
      <!-- <a class="navbar-brand brand-logo" href="../../index.html"
        ><i class="mdi mdi-car-connected"></i>VMA</a
      >
      <a class="navbar-brand brand-logo-mini" href="../../index.html"
        ><i class="mdi mdi-car-connected"></i
      ></a> -->
      <img
        class="navbar-brand brand-logo mt-3"
        src="../assets/images/logo(transparent).png"
      />
      <img
        class="navbar-brand brand-logo-mini"
        src="../assets/images/logo(transparent).png"
      />
    </div>

    <div class="navbar-menu-wrapper d-flex align-items-stretch">
      <button
        class="navbar-toggler navbar-toggler align-self-center"
        type="button"
        data-toggle="minimize"
      >
        <span class="mdi mdi-menu"></span>
      </button>

      <ul class="navbar-nav navbar-nav-right">
        <li class="nav-item dropdown">
          <a
            class="nav-link count-indicator dropdown-toggle"
            id="notificationDropdown"
            @click="showNotifications"
            data-toggle="dropdown"
          >
            <i
              class="mdi mdi-bell-outline"
              @click="
                () => {
                  this.isNewNoti = false;
                }
              "
            ></i>
            <span class="count-symbol bg-danger" v-if="isNewNoti"></span>
          </a>
          <!-- Notification -->
          <div
            class="dropdown-menu dropdown-menu-right navbar-dropdown preview-list"
            aria-labelledby="notificationDropdown"
          >
            <h6 class="p-3 mb-0">Notifications</h6>
            <div class="dropdown-divider"></div>
            <div v-for="notify in notifications" :key="notify.notificationId">
              <a
                class="dropdown-item preview-item"
                @click="
                  handleNotificationClicks(
                    notify.id,
                    notify.type,
                    notify.title,
                    notify.body
                  )
                "
              >
                <div class="preview-thumbnail">
                  <div class="preview-icon bg-success">
                    <i class="mdi mdi-calendar"></i>
                  </div>
                </div>
                <div
                  class="preview-item-content d-flex align-items-start flex-column justify-content-center"
                >
                  <h6 class="preview-subject font-weight-normal mb-1">
                    {{ notify.title }}
                  </h6>
                  <p class="text-gray ellipsis mb-0">
                    {{ notify.body }}
                  </p>
                </div>
              </a>
              <div class="dropdown-divider"></div>
            </div>

            <div class="dropdown-divider"></div>
            <h6 class="p-3 mb-0 text-center">See all notifications</h6>
          </div>
          <!-- End of notification -->
        </li>
        <li class="nav-item nav-profile dropdown">
          <a
            class="nav-link dropdown-toggle"
            id="profileDropdown"
            href="#"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            <div class="nav-profile-img">
              <img :src="imageLink" alt="image" />
              <span class="availability-status online"></span>
            </div>
            <div class="nav-profile-text">
              <p class="mb-1 text-black">{{ this.userName }}</p>
            </div>
          </a>
          <div
            class="dropdown-menu navbar-dropdown"
            aria-labelledby="profileDropdown"
          >
            <!-- <a class="dropdown-item" href="#">
              <i class="mdi mdi-cached mr-2 text-success"></i> Activity Log
            </a> -->
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" @click="signOut()">
              <i class="mdi mdi-logout mr-2 text-primary"></i> Logout
            </a>
          </div>
        </li>
      </ul>
      <!-- The actual snackbar -->
      <SnackingToast ref="snackbar" />
      <button
        class="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
        type="button"
        data-toggle="offcanvas"
      >
        <span class="mdi mdi-menu"></span>
      </button>
    </div>
  </nav>
</template>

<script>
import * as firebase from "firebase";
import SnackingToast from "../components/SnackingToast";
import moment from "moment";
export default {
  components: {
    SnackingToast,
  },
  props: {},
  mounted() {
    this.initAuthUser();
    // this.getRegistrationToken();
  },
  created() {
    const messaging = firebase.messaging();
    let seft = this;
    messaging.onMessage(function(payload) {
      seft.isNewNoti = true;
      // Open indexedDB
      const request = indexedDB.open("VMA_DB", 1);
      // If not exist, create new one
      request.onupgradeneeded = (event) => {
        let db = event.target.result;
        db.createObjectStore("Notification", {
          autoIncrement: false,
        });
      };
      // Add new notfication
      request.onsuccess = (event) => {
        let db = event.target.result;
        let date = moment(new Date())
          .format("YYYY-MM-DD HH:mm:ss")
          .replace(/\D/g, "");
        let notification = {
          notificationId: date.toString(),
          title: payload.notification.title,
          body: payload.notification.body,
          id: payload.data.id,
          type: payload.data.requestType,
        };
        db.transaction("Notification", "readwrite")
          .objectStore("Notification")
          .add(notification, notification.notificationId);
        seft.$refs.snackbar.setVisible(notification);
      };
    });
  },
  data() {
    return {
      userName: "",
      imageLink: "",
      isNewNoti: true,
      notifications: [],
    };
  },
  methods: {
    // Show notifications
    showNotifications() {
      this.notifications = [];
      // Open indexedDB
      const request = indexedDB.open("VMA_DB", 1);
      // If not exist, create new one
      request.onupgradeneeded = (event) => {
        let db = event.target.result;
        db.createObjectStore("Notification", {
          autoIncrement: true,
        });
      };
      // Get notfications
      request.onsuccess = (event) => {
        let db = event.target.result;
        let notifications = db
          .transaction("Notification")
          .objectStore("Notification")
          .getAll();
        notifications.onsuccess = (event) => {
          let notificationsList = event.target.result;
          let notificationsListLength = notificationsList.length;
          // Get top 3 of the latest notification
          if (notificationsListLength >= 1) {
            this.notifications.push(
              notificationsList[notificationsListLength - 1]
            );
          }
          if (notificationsListLength >= 2) {
            this.notifications.push(
              notificationsList[notificationsListLength - 2]
            );
          }
          if (notificationsListLength >= 3) {
            this.notifications.push(
              notificationsList[notificationsListLength - 3]
            );
          }
        };
      };
    },
    // Sign out
    signOut() {
      localStorage.removeItem("USER");
      this.$router.push({
        name: "Login",
      });
    },
    // Init data for user
    initAuthUser() {
      let user = JSON.parse(localStorage.getItem("USER"));
      if (user) {
        this.userName = user.displayName;
        this.imageLink = user.photoURL;
      }
    },
    // Get registration token.
    getRegistrationToken() {
      // Retrieve Firebase Messaging object.
      const messaging = firebase.messaging();
      // Get registration token. Initially this makes a network call, once retrieved
      // subsequent calls to getToken will return from cache.
      messaging
        .getToken({
          vapidKey:
            "BNFkrBWhs0AJHgEyuTbs_Xe_hR8XD31EF0iQIa0dnT9op_S9-3H_hFUSbJ7ryyGEb6Wzkncwsh259iQ1oY76hEA",
        })
        .then((currentToken) => {
          console.log("getRegistrationToken -> currentToken", currentToken);
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
        });
    },
    // Handle notification clicks
    handleNotificationClicks(id, type, title, body) {
      if (title.includes("Request")) {
        switch (type) {
          case "DELETE_VEHICLE_DOCUMENT":
            this.$router.push({
              name: "ChangeVehicleRequest",
              params: { requestId: id },
            });
            break;
          case "NEW_VEHICLE_DOCUMENT":
            this.$router.push({
              name: "ChangeVehicleRequest",
              params: { requestId: id },
            });
            break;
          case "CHANGE_VEHICLE":
            this.$router.push({
              name: "ChangeVehicleRequest",
              params: { requestId: id },
            });
            break;
          case "NEW_DOCUMENT":
            this.$router.push({
              name: "UseDocumentRequestDetail",
              params: { requestId: id },
            });
            break;
          case "UPDATE_DOCUMENT":
            this.$router.push({
              name: "UseDocumentRequestDetail",
              params: { requestId: id },
            });
            break;
          case "DELETE_DOCUMENT":
            this.$router.push({
              name: "UseDocumentRequestDetail",
              params: { requestId: id },
            });
            break;
        }
      } else if (title.includes("Contract Vehicle Status")) {
        let arr = body.split("assigned to contract with ID ")[1].split(" ")[0];
        this.$router.push({
          name: "ContractDetail",
          params: { contractId: arr },
        });
      } else if (title.includes("Contract Status")) {
        this.$router.push({
          name: "ContractDetail",
          params: { contractId: id },
        });
      }
    },
  },
};
</script>
<style scoped>
.brand-logo {
  height: 115% !important;
  width: 60% !important;
}
.brand-logo-mini {
  width: 80% !important;
}
.dropdown-menu-right {
  width: 300px;
}
.mdi.mdi-bell-outline:hover {
  cursor: pointer;
}
</style>

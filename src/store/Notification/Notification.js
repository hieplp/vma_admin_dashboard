export default {
  namespaced: true,
  state: {
    notifications: [],
  },
  mutations: {
    // set total drivers
    setNotifications(state, data) {
      state.notifications = data;
    },
  },

  actions: {
    _getNotifications() {
      return new Promise((resolve) => {
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
          console.log("_getNotifications -> notifications", notifications);
          resolve(notifications.result);
        };
      });
    },
  },
};

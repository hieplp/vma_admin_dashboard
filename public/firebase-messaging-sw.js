/* eslint-disable no-undef */
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.0.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.0.1/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyAjxIE1tf-CwMwoINlKCDUEDfwlyQWc8F8",
  authDomain: "vma-fa20se28.firebaseapp.com",
  databaseURL: "https://vma-fa20se28.firebaseio.com",
  projectId: "vma-fa20se28",
  storageBucket: "vma-fa20se28.appspot.com",
  messagingSenderId: "25758894581",
  appId: "1:25758894581:web:6f294ed921302aa41fb8bc",
});
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  //   // Customize notification here
  //   const notificationTitle = "Background Message Title";
  //   const notificationOptions = {
  //     body: "Background Message body.",
  //     icon: "/firebase-logo.png",
  //   };
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
    let notification = {
      notificationId: new Date().toString(),
      title: payload.notification.title,
      body: payload.notification.body,
      id: "",
      type: "",
    };
    db.transaction("Notification", "readwrite")
      .objectStore("Notification")
      .add(notification, notification.notificationId);
  };

  //   self.registration.showNotification(notificationTitle, notificationOptions);
});

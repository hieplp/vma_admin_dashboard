export function storeNofication(payload) {
  let sessionStorage = self.window.sessionStorage;
  let notifications = sessionStorage.getItem("NOTIFICATIONS");
  if (!notifications) {
    notifications = [];
  }
  //   notifications.push({
  //     id: "",
  //     body: "",
  //     notificationType: "",
  //   });
  notifications.push({
    id: "",
    body: payload.notification,
    notificationType: payload.title,
  });
  sessionStorage.setItem("NOTIFICATIONS", notifications);
}

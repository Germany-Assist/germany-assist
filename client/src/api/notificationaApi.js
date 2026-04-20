import { api } from "./client";

// Get notifications
export const getNotifications = async (params) => {
  const { data } = await api.get("/notification", {
    params
  });
 console.log("notifications response", data);
  return data;
};

// Mark notification as read
export const markNotifications = async (notificationIds,markAs = "read") => {
  const { data } = await api.put("/notification/updateRead", {
    notificationIds,
    markAs,
  });

  return data;
};
// Mark notification as read || unread
export const toggleNotificationsStatus = async (ids, markAs) => {

  return api.put("/notification/updateRead", {
    notificationIds: ids,
    markAs,
  });

};

// read all Notification
export const markAllNotificationsAsRead = async () => {
  const { data } = await api.put("/notification/markAllAsRead");
  return data;
};

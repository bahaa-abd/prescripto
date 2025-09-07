import express from "express";
import {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notificationController.js";
import authUser from "../middleware/authUser.js";

const notificationRouter = express.Router();

// Create a notification (admin/doctor can create notifications for users)
notificationRouter.post("/", createNotification);

// Get all notifications for a user
notificationRouter.get("/:userId", authUser, getUserNotifications);

// Mark a specific notification as read
notificationRouter.patch("/:id/read", authUser, markNotificationAsRead);

// Mark all notifications as read for a user
notificationRouter.patch(
  "/mark-all-read",
  authUser,
  markAllNotificationsAsRead
);

export default notificationRouter;

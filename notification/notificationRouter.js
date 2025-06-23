import {
  createNotification,
  getAllNotifications,
  deleteNotification,
  sendNotification,
  getNotificationHistory,
  deleteAllNotifications,
} from "./notificationController.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
const notificationRouter = express.Router();

// Public Route
notificationRouter.get("/get-all-notifications", getAllNotifications); //working fine
notificationRouter.get("/get-notification-history", getNotificationHistory); //working fine

// Protected Route
notificationRouter.post(
  "/create-notification",
  authMiddleware,
  createNotification
); //working fine
notificationRouter.delete(
  "/delete-notification/:id",
  authMiddleware,
  deleteNotification
); //working fine
notificationRouter.post(
  "/send-notification/:id",
  authMiddleware,
  sendNotification
); //working fine

notificationRouter.delete(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotifications
); //working fine

export default notificationRouter;

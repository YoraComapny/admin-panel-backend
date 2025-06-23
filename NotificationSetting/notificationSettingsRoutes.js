import express from "express";
import {
  createAndUpdateNotification,
  getNotificationSetting,
} from "./notificationSettingsController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../config/multerConfig.js"; // Multer setup

// import multer from "multer";
// const upload = multer();

const notificationSettingsRoutes = express.Router();

notificationSettingsRoutes.post(
  "/set-notification-setting",
  authMiddleware,
  upload.single("file"),
  createAndUpdateNotification
); //working fine
notificationSettingsRoutes.get(
  "/get-notification-setting",
  getNotificationSetting
); //working fine

export default notificationSettingsRoutes;

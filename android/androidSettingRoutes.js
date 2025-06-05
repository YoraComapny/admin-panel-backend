import express from "express";

// import { upload } from "./androidSettingsController.js";
import { createAndUpdateAndroid } from "./androidSettingsController.js";
import { getAndroidSettings } from "./androidSettingsController.js";
import upload from "../config/multerConfig.js"; // Multer setup

const androidSettingRouter = express.Router();

androidSettingRouter.post(
  "/set-android-setting",
  // upload.single("image"),
  upload.single("image"),

  createAndUpdateAndroid
);
androidSettingRouter.get("/get-android-setting", getAndroidSettings);

export default androidSettingRouter;

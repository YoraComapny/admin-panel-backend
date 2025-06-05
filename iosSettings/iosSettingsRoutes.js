import express from "express";
import {
  // upload,
  createAndUpdateIos,
  getIosSettings,
} from "./iosSettingsController.js";
import upload from "../config/multerConfig.js"; // Multer setup

const iosSettingRouter = express.Router();

iosSettingRouter.post(
  "/set-ios-setting",
  // upload.single("image"),
  // (req, res, next) => {
  //   console.log(req.body); // Log form data
  //   console.log(req.file); // Log uploaded file
  //   next();
  // },
  upload.single("image"),

  createAndUpdateIos
);
iosSettingRouter.get("/get-ios-setting", getIosSettings);

export default iosSettingRouter;

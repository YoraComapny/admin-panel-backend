import express from "express";
import {
  getAppInformationSettings,
  createAndUpdateSettings,
} from "./appInformationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../config/multerConfig.js"; // Multer setup

const appInformationRouter = express.Router();

appInformationRouter.post(
  "/set-app-information",
  authMiddleware,
  upload.single("file"),
  createAndUpdateSettings
); //working fine
appInformationRouter.get("/get-app-information", getAppInformationSettings); //working fine

export default appInformationRouter;

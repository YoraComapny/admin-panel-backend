import {
  createAndUpdateAndroidAd,
  deleteAndroidAdById,
  getAndroidAds,
} from "./androidadController.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const androidads = express.Router();

androidads.post(
  "/set/android-ads-settings",
  authMiddleware,
  createAndUpdateAndroidAd
); //working fine
androidads.get("/get/android-ads-settings", getAndroidAds);

androidads.delete("/delete-ad/:id", authMiddleware, deleteAndroidAdById);

export default androidads;

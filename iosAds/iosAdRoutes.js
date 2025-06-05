import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createAndUpdateIosAd,
  deleteIosAdById,
  getIosAds,
} from "./iosAdController.js";

const Iosads = express.Router();

Iosads.post("/set/ios-ads-settings", authMiddleware, createAndUpdateIosAd); //working fine
Iosads.get("/get/ios-ads-settings", getIosAds); //working fine

Iosads.delete("/delete-ad/:id", authMiddleware, deleteIosAdById); //working fine

export default Iosads;

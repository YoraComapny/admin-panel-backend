import express from "express";
import {
  createAdminSettings,
  getAdminSettings,
  getPrivacyAndTerms,
} from "./adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const administratorSettings = express.Router();

administratorSettings.post(
  "/set-admin-settings",
  authMiddleware,
  createAdminSettings
); //working fine
administratorSettings.get("/get-admin-settings", getAdminSettings);
administratorSettings.get("/get-privacy-and-terms", getPrivacyAndTerms);

export default administratorSettings;

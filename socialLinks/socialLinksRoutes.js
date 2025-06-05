import express from "express";
import {
  createAndUpdateSocialLinks,
  getSocialLinks,
} from "./socialLinksController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const socialLinks = express.Router();

socialLinks.post(
  "/set-social-links",
  authMiddleware,
  createAndUpdateSocialLinks
); //working fine
socialLinks.get("/get-social-links", getSocialLinks); //working fine

export default socialLinks;

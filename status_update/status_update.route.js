import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  CreateOrUpdateImageStatus,
  getImageStatus,
} from "./status_update.controller.js";

const StatusViewRouter = express.Router();

// Protected routes
StatusViewRouter.post(
  "/image-status-update",
  //   authMiddleware,
  CreateOrUpdateImageStatus
);
// Public routes
StatusViewRouter.get("/get-status-images", getImageStatus);

export default StatusViewRouter;

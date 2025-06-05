import express from "express";
import { updateimages } from "./status.controller.js";
import { getUpdateimages } from "./status.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../config/multerConfig.js"; // Multer setup

const statusRouter = express.Router();

statusRouter.post(
  "/upload-status",
  // authMiddleware,
  upload.fields([
    { name: "imageFootBall", maxCount: 1 },
    { name: "imageTeam", maxCount: 1 },
  ]),
  updateimages
);

statusRouter.get(
  "/get-upload-status",

  getUpdateimages
);

export default statusRouter;

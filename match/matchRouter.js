import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createMatch,
  getMatches,
  getMatchById,
  deleteMatchById,
  updateMatch,
  duplicateMatchById,
  CreateOrUpdateMobileView,
  getMobileView,
  updateNumbersArray,
  getMatchOrder,
  generateThumbnail,
  getMobileMatches,
} from "./matchController.js";

const matchRouter = express.Router();

// Protected routes
matchRouter.post("/mobile-view", authMiddleware, CreateOrUpdateMobileView);
matchRouter.post("/create-match", authMiddleware, createMatch);
matchRouter.put("/update-match/:id", authMiddleware, updateMatch);
matchRouter.post("/reorder", authMiddleware, updateNumbersArray);
matchRouter.delete("/delete-match/:id", authMiddleware, deleteMatchById);
matchRouter.post("/duplicate/:id", authMiddleware, duplicateMatchById);

// Public routes
matchRouter.get("/get-view", getMobileView);
matchRouter.get("/all-matches", getMatches);
matchRouter.get("/all-matches-mobile", getMobileMatches);
matchRouter.get("/get-single-match/:id", getMatchById);
matchRouter.get("/get-order", getMatchOrder);
matchRouter.post("/gen-thumbnail", generateThumbnail);

export default matchRouter;

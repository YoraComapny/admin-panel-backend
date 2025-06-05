import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import {
  addLeague,
  getSelectedLeagues,
  getSelectedLeaguesForApp,
  removeLeague,
  updateLeaguesOrder,
} from "./userLeagueController.js";

const selectedLeaguerouter = express.Router();

// Get user's selected leagues
selectedLeaguerouter.get(
  "/user/selected-leagues",
  authMiddleware,
  getSelectedLeagues
);

selectedLeaguerouter.get("/admin/selected-leagues", getSelectedLeaguesForApp);

// Add a league to user's selection
selectedLeaguerouter.post("/user/add-league", authMiddleware, addLeague);

// Remove a league from user's selection
selectedLeaguerouter.delete(
  "/user/remove-league/:id",
  authMiddleware,
  removeLeague
);

// Update the order of user's leagues
selectedLeaguerouter.put(
  "/user/update-leagues-order",
  authMiddleware,
  updateLeaguesOrder
);

export default selectedLeaguerouter;

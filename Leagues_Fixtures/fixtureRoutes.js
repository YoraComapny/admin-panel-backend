import {
  getLeaguesRapid,
  setLeagues,
  getLeagues,
  deleteLeague,
  getFixturesRapid,
  getAllFixturesForDate,
  getAllFixturesByDateForApp,
} from "./fixtureController.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const fixtureRouter = express.Router();

// Protected Routes
fixtureRouter.post("/set-leagues", authMiddleware, setLeagues); //Done
fixtureRouter.delete("/delete-league/:id", authMiddleware, deleteLeague); //Done
fixtureRouter.post("/get-fixture-rapid", authMiddleware, getFixturesRapid); //Done

// // Public Routes
fixtureRouter.get("/get-leagues-rapid/:country", getLeaguesRapid); //Done
fixtureRouter.get("/get-leagues", getLeagues); //Done

fixtureRouter.get("/get-by-date", authMiddleware, getAllFixturesForDate);
fixtureRouter.get("/get-by-date/for-apps", getAllFixturesByDateForApp);

export default fixtureRouter;

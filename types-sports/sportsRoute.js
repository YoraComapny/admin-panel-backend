import express from "express";
import {
  createSports,
  deleteSports,
  getSports,
  updateSports,
} from "./sportsController.js";

const typeSportsRouter = express.Router();

typeSportsRouter.post("/create-sports", createSports);
typeSportsRouter.get("/get-sports", getSports);
typeSportsRouter.put("/update-sports/:id", updateSports);
typeSportsRouter.delete("/delete-sports/:id", deleteSports);

export default typeSportsRouter;

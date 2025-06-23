import express from "express";

import upload from "../config/multerConfig.js"; // Importing the Multer middleware
import {
  createTypesLeague,
  deleteTypesLeague,
  getTypesLeagues,
  updateTypesLeague,
} from "./typesLeagueController.js";

const typesLeaguesRouter = express.Router();

typesLeaguesRouter.get("/get-types-leagues", getTypesLeagues);
typesLeaguesRouter.put(
  "/update-types-leagues/:id",
  upload.single("image"),
  updateTypesLeague
);
typesLeaguesRouter.delete("/delete-types-leagues/:id", deleteTypesLeague);

typesLeaguesRouter.post(
  "/create-types-leagues",
  upload.single("image"),
  createTypesLeague
);

export default typesLeaguesRouter;

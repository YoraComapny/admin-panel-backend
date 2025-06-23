import express from "express";
import {
  createAdsType,
  deleteAdsType,
  getAdsTypes,
  updateAdsType,
} from "./addController.js";

const typesAdd = express.Router();

// Routes
typesAdd.post("/create-types-add", createAdsType); // Create new ads type done
typesAdd.get("/get-types-add", getAdsTypes); // Get all ads types
typesAdd.put("/update-types-add/:id", updateAdsType); // Update ads type by ID
typesAdd.delete("/delete-types-add/:id", deleteAdsType);

export default typesAdd;

import { getAllNews, getNewsById, deleteNewsById } from "./newsController.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const newsRouter = express.Router();

newsRouter.get("/all/news", getAllNews); //Done
newsRouter.get("/news/:id", getNewsById); //Done
newsRouter.delete("/delete-news/:id", authMiddleware, deleteNewsById); //Done

export default newsRouter;

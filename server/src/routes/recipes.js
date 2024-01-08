import express from "express";
const router = express.Router();
import { createRecipe, getRecipe, saveRecipe, getSavedRecipe } from "../controllers/recipes.js";
import { verifyToken } from "../middleware/validateToken.js";

router
  .post("/", verifyToken, createRecipe)
  .get("/",getRecipe)
  .put("/", verifyToken, verifyToken, saveRecipe)
  .get("/savedrecipes/:userID", verifyToken, getSavedRecipe)


export {router as recipesRouter};
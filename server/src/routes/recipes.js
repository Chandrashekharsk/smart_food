import express from "express";
const router = express.Router();
import { getRecipeDetail, deletePost, getLikedPosts,likePost, disLikePost, createRecipe, getRecipe, getRecipe2, saveRecipe, getSavedRecipe, searchRecipe, editRecipe } from "../controllers/recipes.js";
import { verifyToken } from "../middleware/validateToken.js";


router.get("/favorites", verifyToken, getSavedRecipe)
router.get("/likedposts", verifyToken, getLikedPosts)
router.get("/likepost/:id", verifyToken, likePost)
router.get("/dislikepost/:id", verifyToken, disLikePost)
router.delete("/deletepost/:id",verifyToken, deletePost)
router.get("/search/:query", searchRecipe);
router.get("/:id", verifyToken, saveRecipe) 
router.get("/getdetail/:id", getRecipeDetail)
router.put("/update-recipe/:id", verifyToken, editRecipe);
router.post("/", verifyToken, createRecipe)
router.get("/", getRecipe2)


export {router as recipesRouter};
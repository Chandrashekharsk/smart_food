import { RecipeModel } from "../models/recipes.js";
import { UserModel } from "../models/users.js";

const createRecipe = async (req, res) => {
  try {
    const recipe = new RecipeModel(req.body);
    await recipe.save();
    res.status(201).json({ message: "recipe created successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getRecipe = async (req, res) => {
  try {
    const data = await RecipeModel.find();
    res.status(200).json( data );
  } catch (error) {
    res.status(500).json(error);
  }
};

const saveRecipe = async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findById(req.body.userID);
    user.savedRecipes.push(recipe);
    await user.save();
    res.status(200).json({savedRecipes:user.savedRecipes});
  } catch (error) {
    res.status(500).json(error);
  }
};

const getSavedRecipe = async(req,res)=>{
  try {
    // console.log(req.params)
    const user = await UserModel.findById(req.params.userID)
    const savedRecipes = await RecipeModel.find({_id:{$in: user.savedRecipes}})
    if(!savedRecipes){
      return res.status(400).json({message:"Nothing to show"})
    }
    res.json(savedRecipes);

  } catch (error) {
    res.status(500).json(error)
  }
}

export { createRecipe, getRecipe, saveRecipe, getSavedRecipe };

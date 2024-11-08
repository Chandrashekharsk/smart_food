import { RecipeModel } from "../models/recipes.js";
import { UserModel } from "../models/users.js";


const createRecipe = async (req, res) => {

  try {
    const {name, ingredients, instructions,imageUrl, cookingTime} = await req.body; 
    const userId = await req.UserId;
    if(!userId){
      return res.status(401).json({
        message:" Unauthorized",
        success:false
      });
    }
    if(!name || !ingredients || !instructions || !cookingTime || !imageUrl) {
      return res.status(400).json({
        message:" All fields are required",
        success:false
      });
    }
    const newRecipe = {
      name,
      ingredients,
      instructions,
      cookingTime,
      imageUrl,
      owner: userId,
    }
    
    const createdRecipe = await RecipeModel.create(newRecipe);
    res.status(201).json({
      message: "Recipe created",
      createRecipe,
      success:true
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message:"Internal server error"
    });
  }
};

const editRecipe = async (req, res) => {
  console.log("edit Recipe called")
  try {
    // Extract updated recipe data from the request body
    const { name, ingredients, instructions, imageUrl, cookingTime } = req.body;
    const userId = req.UserId; // User ID from authentication (token)
    const postId = req.params.id; // Recipe ID from route parameters

    // Check if the user is authenticated
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    // Validate required fields
    if (!name || !ingredients || !instructions || !cookingTime || !imageUrl) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // Find the existing recipe by ID
    const existingRecipe = await RecipeModel.findById(postId);

    // Check if the recipe exists
    if (!existingRecipe) {
      return res.status(404).json({
        message: "Recipe not found",
        success: false,
      });
    }

    // Check if the logged-in user is the owner of the recipe
    if (existingRecipe.owner.toString() !== userId) {
      return res.status(403).json({
        message: "You are not authorized to edit this recipe",
        success: false,
      });
    }

    // Prepare updated recipe data
    const updatedRecipe = {
      name,
      ingredients,
      instructions,
      cookingTime,
      imageUrl,
      owner: userId, // The owner remains the same
    };

    // Update the recipe in the database
    const updatedRecipeData = await RecipeModel.findByIdAndUpdate(postId, updatedRecipe, { new: true });

    // Respond with the updated recipe data
    res.status(200).json({
      message: "Recipe updated successfully",
      updatedRecipe: updatedRecipeData,
      success: true,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const getRecipe = async (req, res) => {
  try {
    const data = await RecipeModel.find()
      .populate({
        path: "owner",
        select: "username profile_pic likes", 
      })
      .sort({ createdAt: -1 }); 

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message }); // Send error message
  }
};

const getRecipe2 = async (req, res) => {
  clg("init backend request");
  const {page, limit} = req.query;
  try {
    const recipes = await RecipeModel.find()
      .populate({
        path: "owner",
        select: "username profile_pic likes", 
      })
      .sort({ createdAt: -1 })
      .skip((page-1) * limit)   // skip previous pages
      .limit(parseInt(limit));  // get limited results

    const total = await RecipeModel.countDocuments();

    res.status(200).json({
      recipes,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      success: true,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Internal server error",
      success: false,
    }); // Send error message
  }
};

const getRecipeDetail = async (req, res) => {
  try {
    const recipeId = req.params.id;
    console.log("recipeid", recipeId)
    const recipe = await RecipeModel.findById(recipeId)
    .populate({
      path:"owner",
      select:"username profile_pic likes",
    });
    if (!recipe) {
      res.status(400).json({
        message: "recipe not found",
        success: false,
      });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json(error);
  }
};
const saveRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    console.log("recipeId", recipeId);
    
    // Find the recipe and user
    const recipe = await RecipeModel.findById(recipeId);
    const user = await UserModel.findById(req.UserId);
    console.log("recipe",recipe);
    console.log("user",user);

    // Check if the recipe exists
    if (!recipe) {
      return res.status(400).json({
        message: "Recipe not found",
        success: false,
      });
    }

    const alreadyAddedToFavourites = user.savedRecipes.includes(recipe._id);
    if (alreadyAddedToFavourites) {
      // Remove the recipe from savedRecipes
      await UserModel.updateOne(
        { _id: user._id },
        { $pull: { savedRecipes: recipe._id } }
      );
      return res.status(200).json({
        success: true,
        message: "Removed from favorites",
        savedRecipes: user.savedRecipes.filter(id => id.toString() !== recipe._id.toString()),
      });
    } else {
      // Add the recipe to savedRecipes
      await UserModel.updateOne(
        { _id: user._id },
        { $push: { savedRecipes: recipe._id } }
      );
      return res.status(200).json({
        success: true,
        message: "Added to favorites",
        savedRecipes: [...user.savedRecipes, recipe._id],
      });
    }
  } catch (error) {
    console.error("Error in saveRecipe:", error);
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

const getSavedRecipe = async (req, res) => {
  const {page, limit} = req.query;
  try {
    const userId = req.UserId;
    const user = await UserModel.findById(userId)
    // .populate({
    //   path: "savedRecipes",
    //   select:"name instructions ingredients imageUrl likes cookingTime owner createdAt updatedAt",
    //   populate: {
    //     path:"owner",
    //     select:"username profile_pic"
    //   }
    // });
    if (!user) {
      return res.status(400).json({
        message: "Bad request",
        success: false,
      });
    }

    if (user.savedRecipes.length === 0) {
      return res.status(200).json({
        message: "No saved recipes found",
        success: false,
      });
    }

    return res.status(200).json({
      savedRecipes: user.savedRecipes,
      message: "Recipes retrieved successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const likePost = async(req, res) => {
  try {
    const userId = req.UserId;
    const postId = req.params.id;
    if(!postId){
      return res.status(400).json({
        message: "Bad request",
        success:false,
      });
    }

    const post = await RecipeModel.findById(postId);
    if(!post){
      return res.status(404).json({
        message: "Post not found",
        success: false,
      })
    }
    const user = await UserModel.findById(userId);
    if(!user){
      return res.status(404).json({
        message: "User not found",
        success: false,
      })
    };

    await Promise.all([
      await post.updateOne({$addToSet:{ likes: userId}}),
      await user.updateOne({$addToSet:{ liked: postId}}),
    ])

    return res.status(200).json({
      message: "Post liked",
      success: true,
    })

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    })
  }
}

const disLikePost = async(req, res) => {
  try {
    const userId = req.UserId;
    const postId = req.params.id;

    const post = await RecipeModel.findById(postId);
    if(!postId){
      return res.status(404).json({
        message: "Post not found",
        success:false,
      })
    }
    const user = await UserModel.findById(userId);
    if(!user){
      return res.status(404).json({
        message: "User not found",
        success:false,
      })
    }
    await Promise.all([
      await post.updateOne({$pull:{likes:userId}}),
      await user.updateOne({$pull:{liked:postId}}),
    ])

    return res.status(200).json({
      message: "Post Disliked",
      success: true,
    })

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    })
  }
}

const getLikedPosts = async(req, res)=>{
  try {
    const userId = req.UserId;
    const user = await UserModel.findById(userId)
    // .populate({
    //   path: "likes",
    //   select:"_id "
    // });
    if(!user){
      return res.status(404).json({
        message: "User not found",
        success:false,
      })
    }
    return res.status(200).json({
      success: true,
      likedPosts: user.liked
    })

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    })
  }
}

const searchRecipe = async (req, res) => {
  const { query } = req.params;
  console.log("Query start:", query);

  if (!query || !query.trim()) {
    return res.status(400).json({
      results: [],
      message: "Please submit a valid query",
      success: false,
    });
  }

  // Split query into keywords for case-insensitive regex search
  const keywords = query.trim().split(/\s+/).map(keyword => new RegExp(keyword, 'i'));

  try {
    // Step 1: Find matching users by username
    const matchingUsers = await UserModel.find({
      username: { $in: keywords }
    }, '_id'); // Retrieve only _id for performance

    // Extract user IDs if any matches are found
    const userIds = matchingUsers.map(user => user._id);

    // Step 2: Find recipes matching keywords or owner IDs
    const searchConditions = [
      { name: { $in: keywords } },
      { instructions: { $in: keywords } },
      { ingredients: { $in: keywords } },
    ];

    // Only add owner condition if there are matching user IDs
    if (userIds.length > 0) {
      searchConditions.push({ owner: { $in: userIds } });
    }

    // Perform the query using $or with the dynamic conditions array
    const results = await RecipeModel.find({
      $or: searchConditions
    }).populate({
      path: "owner",
      select: "username profile_pic",
    });

    return res.status(200).json({
      success: true,
      message: "Here are the found results",
      results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.UserId;
    console.log("postId", postId);
    console.log("userId", userId);

    const post = await RecipeModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    if(userId !== post.owner.toString()){
      console.log("isOwner", false);
      return res.status(400).json({
        message: "Bad request",
        success: false,
      });
    }
    console.log("isOwner", true);

    await RecipeModel.findByIdAndDelete(postId);
    return res.status(200).json({
      message: "Post deleted",
      success: true,
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};


export { getRecipeDetail, createRecipe, getRecipe, saveRecipe, getSavedRecipe, likePost, disLikePost, getLikedPosts, deletePost, searchRecipe, getRecipe2, editRecipe };

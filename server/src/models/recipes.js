import mongoose, { mongo } from "mongoose";


const recipeSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  instructions:{
    type:String,
    required:true
  },
  ingredients:[
    {
      type:String,
      required:true
    }
  ],
  imageUrl:{
    type:String,
    required:true
  },
  likes:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Users",
    }
  ],
  cookingTime:{
    type:Number,
    required:true
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  }
},
{timestamps:true}
)

export const RecipeModel = mongoose.model("Recipe",recipeSchema)
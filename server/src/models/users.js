import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:true,
    unique:true,
    minlength:[2,"username must be at least 2 characters long"],
    maxlength:[20,"username can not cantains more than 10 charactors"],
    lowercase: true
  },
  password:{
    type:String,
    required:true,
    minlength:[4,"password must be at least 4 charactors long"]
  },
  savedRecipes:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Recipe"
    }
  ]
 
})

export const UserModel = mongoose.models.User|| mongoose.model("User", userSchema)
import { UserModel } from "../models/users.js";
import dotenv from "dotenv"
dotenv.config()
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const registerUser = async(req,res)=>{
  let {username,password} = req.body
  // username = username.trim() 
  // password = password.trim()
  try {
    if(!username || !password){
      return res.status(400).json({message:"All fields are required"})
    }
    const userExists = await UserModel.findOne({username})
    if(userExists){
      return res.status(400).json({message:"User already exists"})
   
    }

    const hashedPassword = await bcrypt.hash(password,10)
    const user = new UserModel({
      username,password:hashedPassword
    })
    user.save();
    res.status(201).json({message:"user registered successfully"})

  } catch (error) {
    res.status(500).json({message:"Internal server error"})
  }
}

const loginUser = async(req,res)=>{
  const {username,password} = req.body;
  
  try {
    if(!username || !password){
      res.status(400)
      throw new Error("All fields are required")
    }
    const existsUser = await UserModel.findOne({username})
    if(!existsUser){
      return res.status(400).json({Error:"User doesn't exists"})
    }
    const validPassword = await bcrypt.compare(password, existsUser.password)
    if(!validPassword){
      return res.status(400).json({Error:"username or password is incorrect"})
    }

    if (existsUser && validPassword ) {
      const token = jwt.sign({
        user:{
          id:existsUser._id,
          username:existsUser.username
        }
      },
      process.env.JWT_SECRET,
      {expiresIn:"12h"}
      )
      res.status(200).json({token, userID:existsUser._id})
    }
      

      

  } catch (error) {
    res.status(500).json({message:"Interanal server Error"})
  }
}



export {registerUser, loginUser}
import dotenv from "dotenv";
dotenv.config();
import { UserModel } from "../models/users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinaryConfig.js";

const checkToken = async (req,res) => {
  console.log("check token")
  try {
    const token =
      req.cookies?.access_token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    console.log("in check token")
    if (token) {
      console.log("intoken found")
      return res.status(200).json({
        success: true,
        message: "token verified",
        verificationError: false,
      });
    }
    if(!token){
      console.log("intoken not found ")
      return res.status(200).json({
        success: false,
        message: "token couldn't verified",
        verificationError: false,
      });
    }
  } catch (error) {
    console.error("Token checking Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      verificationError:true,
    });
  }
};

const registerUser = async (req, res) => {
  try {
    console.log("Registering new user");
    let { username, password } = req.body;
    console.log("Received username and password:", username, password);

    username = username?.trim();
    password = password?.trim();

    // Validate input fields
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists
    console.log("checking");
    const userExists = await UserModel.findOne({ username });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    console.log("doesnt exist user");

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user document
    const user = new UserModel({
      username,
      password: hashedPassword,
      profile_pic: "",
    });

    // Save user and respond
    await user.save();
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  console.log("login");
  let { username, password } = req.body;
  username = username?.trim();
  password = password?.trim();
  const pic = req.file; // Assuming multer middleware handles 'pic' as 'req.file'

  try {
    // Validate input fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if the user exists
    const existsUser = await UserModel.findOne({ username });
    if (!existsUser) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, existsUser.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Username or password is incorrect",
      });
    }

    // Upload profile picture to Cloudinary if present
    if (pic) {
      console.log("pic found");
      const filePath = req.file.path;
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: "recipeImages",
          resource_type: "image",
        });
        existsUser.profile_pic = result.secure_url;
        await existsUser.save(); // Update user with new profile pic
      } catch (err) {
        console.error("Cloudinary upload error:", err.message);
        return res.status(500).json({
          success: false,
          message: "Error uploading profile picture to Cloudinary",
        });
      }
    }

    // Generate token and set cookie if authentication is successful
    const token = jwt.sign(
      {
        user: {
          id: existsUser._id,
          username: existsUser.username,
          profile_pic: existsUser.profile_pic, // Use updated profile_pic
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );
    console.log("login done");

    // Set secure cookie options based on environment
    // const isProduction = process.env.NODE_ENV === "production";

    return res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 5 * 60 * 60 * 1000,
        // secure: isProduction, // set to true in production
        // sameSite: isProduction ? "none" : "lax", // "none" for cross-site cookies, "lax" for dev

        // for production
        secure: true,
        sameSite: "none",
        // for development
        // secure: false,
        // sameSite: "strict",
      })
      .json({
        success: true,
        message: `Welcome back ${existsUser.username}`,
        user: {
          id: existsUser._id,
          username: existsUser.username,
          profile_pic: existsUser.profile_pic, // Use updated profile_pic
        },
      });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    // Assuming the user ID is stored in the token, extract it
    const userId = req.UserId;
    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateProfilePic = async (req, res) => {
  try {
    console.log("update pic BACKEND");
    const userId = req.UserId;
    const pic = req.file;
    if (!pic) {
      return res.status(404).json({
        message: "pic not found",
        success: false,
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Upload new profile picture to Cloudinary if present
    if (pic) {
      const filePath = req.file.path;
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "recipeImages",
        resource_type: "image",
      });

      if (!result) {
        console.error("Cloudinary upload error:", err.message);
        return res.status(500).json({
          success: false,
          message: "Error uploading profile picture",
        });
      }
      user.profile_pic = result.secure_url;
    }

    // Save updated user data
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Updated ",
      user: {
        id: user._id,
        username: user.username,
        profile_pic: user.profile_pic,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteProfilePic = async (req, res) => {
  const userId = req.UserId;
  try {
    if (!userId) {
      return res.status(401).json({
        message: "User not authorized",
        success: false,
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    }
    user.profile_pic = "";
    await user.save();
    return res.status(200).json({
      message: "Deleted",
      success: true,
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  try {
    return res
      .cookie("access_token", "", {
        maxAge: 0,
      })
      .json({
        message: "Logged out successfully",
        success: true,
      });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    });
  }
};

export {
  registerUser,
  logout,
  loginUser,
  getProfile,
  updateProfilePic,
  deleteProfilePic,
  checkToken,
};

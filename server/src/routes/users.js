import express from "express";
const router = express.Router();
import { registerUser,loginUser, updateProfilePic, deleteProfilePic, logout } from "../controllers/users.js";
import upload from "../middleware/uploadImage.js";
import { verifyToken } from "../middleware/validateToken.js";

router.post("/register",registerUser);
router.post("/login",upload.single("pic"), loginUser);
router.patch("/update-profilepic", verifyToken ,upload.single("pic"), updateProfilePic);
router.delete("/delete-profilepic", verifyToken, deleteProfilePic);
router.get("/logout", logout);



export {router as userRouter};


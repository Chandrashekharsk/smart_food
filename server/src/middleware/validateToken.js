import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
      return res.status(400).json({ message: "token is lost" });
    }
     jwt.verify(authHeader, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("i am err")
        return res.status(401).json({ message: "Unauthorized" });
      }
      // console.log(decoded);
      req.user = decoded.user;
      next();
    });
  } catch (err) {
    console.error(err);
  }
};

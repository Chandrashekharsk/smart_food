import jwt from "jsonwebtoken";
export const verifyToken = async (req, res, next) => {
  console.log("in middleware")
  try {
    const token = req.cookies?.access_token
    || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({
        message: "Missing token Credentials",
        success: false,
        verificationError:true,
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token", success: false });
      }
      req.UserId = decoded.user.id;
      // console.log("Decoded user ID:", req.UserId);
      console.log("token validated")
      next();
    });
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

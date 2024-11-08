import dotenv from "dotenv";
dotenv.config()
import connectDB from "./utils/dbConfig.js";
import { userRouter } from "./routes/users.js";
import { recipesRouter } from "./routes/recipes.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware/validateToken.js";


const app = express();
console.log("envUri",process.env.MONGODB_URI)

app.get("/", (_, res) => {
  res.send("SERVER IS RUNNING");
});

app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

const corsOptions = {
  origin: `${process.env.FRONTEND_URL}`,
  methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
// app.use(cors());

// app.use((req, res, next) => {
//   console.log("interceptor");
//   console.log(`${req.method} ${req.url} - ${JSON.stringify(req.body)}`);
//   next();
// });
app.use("/check-auth",verifyToken, (_,res)=>{
  res.status(201).json({
    success: true,
    message: "Authorized",
  });
})
app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("Server is listening on port " + PORT);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
})();

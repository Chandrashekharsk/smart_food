import express from "express";
import cors from "cors";
const app = express();
import connectDB from "../dbConfig.js";
import {userRouter} from "./routes/users.js";
import { recipesRouter } from "./routes/recipes.js";

connectDB()
  .then(() => {
    app.use(express.json());
    app.use(cors());
    app.use("/auth", userRouter);
    app.use("/recipes", recipesRouter);
    app.use("/", (req, res) => {
      res.send("SERVER IS RUNNING");
    });

    // Use process.env.PORT or default to 8080
    const PORT = process.env.PORT;
    app.listen(PORT, () => console.log(`SERVER STARTED AT PORT:${PORT}`));
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit process with failure
  });




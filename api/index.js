import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();

// Mongo Db Connection
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

const app = express();

// this is going to allow json as the input of the server
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// middlewares
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
       success : false,
       statusCode,
       message
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

import express from "express";
import multer from "multer";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import cookieParser from "cookie-parser";
import corsMiddleware from "../src/middlewares/cors.middleware.js";

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/post", postRoutes);
app.use("/comments", commentRoutes);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: error.message || "File upload failed",
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Invalid request",
    });
  }

  next();
});

export default app;

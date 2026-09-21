import express from "express";
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

export default app;

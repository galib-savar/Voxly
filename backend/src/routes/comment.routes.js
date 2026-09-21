import express from "express";
import {
  createCommentController,
  getCommentsByPostController,
} from "../controllers/comment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  /* /comments */
  "/",
  authMiddleware,
  createCommentController,
);

router.get(
  /* /comments/:postId */
  "/:postId",
  getCommentsByPostController,
);

export default router;

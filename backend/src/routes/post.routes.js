import express from "express";
import {
  createPostController,
  getAllPostsController,
  getPostByUserIdController,
  likePostController,
} from "../controllers/post.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router
  .route(
    /* /post */
    "/",
  )
  .post(
    authMiddleware,
    upload.fields([{ name: "image", maxCount: 1 }]),
    createPostController,
  )
  .get(getAllPostsController);

router.get(
  /* /post/:userId */
  "/:userId",
  getPostByUserIdController,
);

router.post(
  /* /post/:id/like */
  "/:id/like",
  authMiddleware,
  likePostController,
);

export default router;

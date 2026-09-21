import express from "express";
import {
  getProfileByUserIdController,
  updateProfileController,
} from "../controllers/profile.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.put(
  /* /profile/me */
  "/me",
  isAuthenticated,
  upload.fields([
    { name: "profileLogo", maxCount: 1 },
    { name: "profileBannerPhoto", maxCount: 1 },
  ]),
  updateProfileController,
);

router.get(
  /* /profile/:userId */
  "/:userId",
  getProfileByUserIdController,
);

export default router;

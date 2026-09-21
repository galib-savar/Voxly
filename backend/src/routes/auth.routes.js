import express from "express";
import { userRegisterController, userLoginController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post(
    /* /auth/register */
    "/register",
    userRegisterController
);
router.post(
    /* /auth/login */
    "/login",
    userLoginController
);

export default router;
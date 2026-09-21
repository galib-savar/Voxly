import userModel from "../model/user.model.js";
import { createProfileController } from "./profile.controller.js";
import jwt from "jsonwebtoken";

export const userRegisterController = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const inExists = await userModel.findOne({
      email: email,
    });

    if (inExists) {
      return res.status(422).json({
        success: false,
        code: 422,
        message: "Email is already exists.",
      });
    }

    const user = await userModel.create({
      email,
      password,
      name,
    });

    const profile = await createProfileController(
      /* Create profile for user */
      user._id,
    );

    // Link profile to user
    user.profile = profile._id;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    return res
      .cookie("token", token)
      .status(201)
      .json({
        success: true,
        code: 201,
        message: "User registered",
        token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: 500,
      message: error.message,
    });
  }
};

export const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        code: 401,
        message: "Email or Password is Invalid",
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        code: 401,
        message: "Email or Password is Invalid",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    return res
      .cookie("token", token)
      .status(200)
      .json({
        success: true,
        token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

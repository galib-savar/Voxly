import profileModel from "../model/profile.model.js";
import imagekit from "../config/services/imagekit.service.js";
import {
  uploadToImageKit,
  generateImageFileName,
} from "../utils/imageUploadHelper.js";

/**
 * Creates a new user profile
 * @param {string} userId - User ID for profile creation
 * @returns {Promise<Object>} Created profile document
 * @throws {Error} If user ID is missing or profile already exists
 */
export const createProfileController = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const existingProfile = await profileModel.findOne({ user: userId });
    if (existingProfile) {
      throw new Error("Profile already exists for this user");
    }

    const profile = await profileModel.create({ user: userId });
    return profile;
  } catch (error) {
    console.error("[ProfileController] Error creating profile:", {
      userId,
      error: error.message,
    });
    throw error;
  }
};

/**
 * Retrieves user profile by user ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Profile data with user information
 */
export const getProfileByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const profile = await profileModel
      .findOne({ user: userId })
      .populate("user", "name email");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("[ProfileController] Error fetching profile:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve profile",
    });
  }
};

/**
 * Updates user profile with bio, links, and optional images
 * @param {Object} req - Express request object with user, files, and body
 * @param {Object} res - Express response object
 * @returns {Object} Updated profile document
 */
export const updateProfileController = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const { profileBio, website, location, github, linkedin, twitter } =
      req.body;

    const normalizeOptionalString = (value) => {
      if (typeof value !== "string") return value;
      return value.trim();
    };

    const updateData = {
      profileBio: normalizeOptionalString(profileBio),
      website: normalizeOptionalString(website),
      location: normalizeOptionalString(location),
      github: normalizeOptionalString(github),
      linkedin: normalizeOptionalString(linkedin),
      twitter: normalizeOptionalString(twitter),
    };

    // Handle profile logo upload
    if (req.files?.profileLogo && req.files.profileLogo.length > 0) {
      try {
        const logoFile = req.files.profileLogo[0];
        const fileName = generateImageFileName(logoFile);
        const uploadedLogo = await uploadToImageKit(
          imagekit,
          logoFile,
          fileName,
          "/social-media/profile-logo",
        );
        updateData.profileLogo = uploadedLogo.url;
      } catch (uploadError) {
        console.error(
          "[ProfileController] Profile logo upload failed:",
          uploadError.message,
        );
        throw new Error(`Profile logo upload failed: ${uploadError.message}`);
      }
    }

    // Handle profile banner upload
    if (
      req.files?.profileBannerPhoto &&
      req.files.profileBannerPhoto.length > 0
    ) {
      try {
        const bannerFile = req.files.profileBannerPhoto[0];
        const fileName = generateImageFileName(bannerFile);
        const uploadedBanner = await uploadToImageKit(
          imagekit,
          bannerFile,
          fileName,
          "/social-media/profile-banner",
        );
        updateData.profileBannerPhoto = uploadedBanner.url;
      } catch (uploadError) {
        console.error(
          "[ProfileController] Profile banner upload failed:",
          uploadError.message,
        );
        throw new Error(`Profile banner upload failed: ${uploadError.message}`);
      }
    }

    const updatedProfile = await profileModel.findOneAndUpdate(
      { user: userId },
      updateData,
      { returnDocument: "after", upsert: true },
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("[ProfileController] Error updating profile:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};

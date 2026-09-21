import Post from "../model/post.model.js";
import imageKit from "../config/services/imagekit.service.js";
import {
  uploadToImageKit,
  generateImageFileName,
} from "../utils/imageUploadHelper.js";

/**
 * Creates a new post with optional image
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Created post document
 */
export const createPostController = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const { title, content } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    let imageUrl = "";

    // Handle optional image upload
    if (req.files?.image && req.files.image.length > 0) {
      try {
        const imageFile = req.files.image[0];
        const fileName = generateImageFileName(imageFile);
        const uploadedImage = await uploadToImageKit(
          imageKit,
          imageFile,
          fileName,
          "/social-media/posts",
        );
        imageUrl = uploadedImage.url;
      } catch (uploadError) {
        console.error(
          "[PostController] Image upload failed:",
          uploadError.message,
        );
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }
    }

    const post = await Post.create({
      user: userId,
      title: title.trim(),
      content: content.trim(),
      image: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.error("[PostController] Error creating post:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create post",
    });
  }
};

/**
 * Retrieves all posts with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Array<Object>} Array of posts
 */
export const getAllPostsController = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = parseInt(req.query.limit) || 10;

    const posts = await Post.find()
      .populate({
        path: "user",
        populate: {
          path: "profile",
          select: "profileLogo",
        },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!posts || posts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No posts found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      pagination: { page, limit, count: posts.length },
      data: posts,
    });
  } catch (error) {
    console.error("[PostController] Error fetching posts:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve posts",
    });
  }
};

/**
 * Retrieves all posts by a specific user ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Array<Object>} Array of posts for the user
 */
export const getPostByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = parseInt(req.query.limit) || 10;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const posts = await Post.find({ user: userId })
      .populate({
        path: "user",
        select: "name profile",
        populate: {
          path: "profile",
          select: "profileLogo",
        },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!posts || posts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No posts found for this user",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "User posts retrieved successfully",
      pagination: { page, limit, count: posts.length },
      data: posts,
    });
  } catch (error) {
    console.error("[PostController] Error fetching user posts:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user posts",
    });
  }
};

/**
 * Toggles like/unlike for a post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const likePostController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const userIdString = userId.toString();
    const userLiked = post.likes.some((id) => id.toString() === userIdString);

    if (userLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userIdString);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return res.status(200).json({
      success: true,
      message: userLiked ? "Post unliked" : "Post liked",
      data: post,
    });
  } catch (error) {
    console.error("[PostController] Error liking post:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to process like action",
    });
  }
};

import Comment from "../model/comment.model.js";
import Post from "../model/post.model.js";

/**
 * Creates a new comment on a post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Created comment with user details
 */
export const createCommentController = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required"
            });
        }

        const { postId, content } = req.body;

        // Validation
        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required"
            });
        }

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment content is required"
            });
        }

        // Verify post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Create comment
        const comment = await Comment.create({
            post: postId,
            user: userId,
            content: content.trim()
        });

        // Populate user details
        await comment.populate({
            path: "user",
            select: "name profile",
            populate: {
                path: "profile",
                select: "profileLogo"
            }
        });

        // Add comment to post's comments array
        await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: comment._id } },
            { new: true }
        );

        return res.status(201).json({
            success: true,
            message: "Comment created successfully",
            data: comment
        });
    } catch (error) {
        console.error("[CommentController] Error creating comment:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create comment"
        });
    }
};

/**
 * Retrieves all comments for a post with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Array<Object>} Array of comments
 */
export const getCommentsByPostController = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required"
            });
        }

        // Verify post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = parseInt(req.query.limit) || 10;

        const comments = await Comment.find({ post: postId })
            .populate({
                path: "user",
                select: "name profile",
                populate: {
                    path: "profile",
                    select: "profileLogo"
                }
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalComments = await Comment.countDocuments({ post: postId });

        return res.status(200).json({
            success: true,
            message: "Comments retrieved successfully",
            pagination: { page, limit, total: totalComments },
            data: comments
        });
    } catch (error) {
        console.error("[CommentController] Error fetching comments:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve comments"
        });
    }
};

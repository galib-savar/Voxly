import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        title: {
            type: String,
            trim: true,
            maxlength: [70, "Title cannot exceed 70 characters"],
            required: true
        },

        content: {
            type: String,
            trim: true,
            maxlength: [500, "Content cannot exceed 500 characters"],
            required: true
        },

        image: {
            type: String,
            trim: true,
            default: ""
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
    },
    { timestamps: true, versionKey: false }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
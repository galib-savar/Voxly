import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
    },

    profileLogo: {
      type: String,
      trim: true,
      default: "",
    },

    profileBannerPhoto: {
      type: String,
      trim: true,
      default: "",
    },

    profileBio: {
      type: String,
      trim: true,
      maxlength: [1000, "Bio cannot exceed 1000 characters"],
      default: "",
    },

    website: {
      type: String,
      trim: true,
      default: "",
      match: [
        /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/,
        "Please enter a valid website URL",
      ],
    },

    location: {
      type: String,
      trim: true,
      maxlength: [50, "Location cannot exceed 50 characters"],
      default: "",
    },

    github: {
      type: String,
      trim: true,
      default: "",
    },

    linkedin: {
      type: String,
      trim: true,
      default: "",
    },

    twitter: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;

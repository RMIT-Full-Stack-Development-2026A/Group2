import mongoose from "mongoose";

const USER_ROLES = ["player", "admin"];
const ACCOUNT_STATUSES = ["active", "inactive", "suspended", "deactivated"];

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: USER_ROLES,
      default: "player",
      required: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    accountStatus: {
      type: String,
      enum: ACCOUNT_STATUSES,
      default: "active",
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[A-Za-z0-9_-]+$/,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    avatarURL: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
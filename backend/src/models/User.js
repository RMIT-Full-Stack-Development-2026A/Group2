import mongoose from "mongoose";
import {
  USER_ROLES,
  ACCOUNT_STATUSES,
  PREMIUM_STATUSES,
} from "configs/config/gameCatalog.js";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    usernameNorm: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    emailNorm: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    countryCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 3,
    },

    role: {
      type: String,
      enum: USER_ROLES,
      default: "player",
      required: true,
    },

    accountStatus: {
      type: String,
      enum: ACCOUNT_STATUSES,
      default: "active",
      required: true,
    },

    avatarAssetId: {
      type: Schema.Types.ObjectId,
      ref: "MediaAsset",
      default: null,
    },
    avatarUrl: {
      type: String,
      default: null,
      trim: true,
    },

    premiumStatus: {
      type: String,
      enum: PREMIUM_STATUSES,
      default: "standard",
      required: true,
    },
    premiumUntil: {
      type: Date,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.index({ emailNorm: 1 }, { unique: true });
userSchema.index({ usernameNorm: 1 }, { unique: true });
userSchema.index({ role: 1, accountStatus: 1 });
userSchema.index({ premiumStatus: 1 });

userSchema.pre("validate", function (next) {
  if (this.username) this.usernameNorm = this.username.trim().toLowerCase();
  if (this.email) this.emailNorm = this.email.trim().toLowerCase();
  if (this.countryCode) this.countryCode = this.countryCode.trim().toUpperCase();
  next();
});

export default model("User", userSchema);
const mongoose = require("mongoose");

const { Schema, model, Types } = mongoose;

const USER_ROLES = ["player", "admin"];
const ACCOUNT_STATUSES = ["active", "inactive", "suspended", "deactivated"];

const userSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = model("User", userSchema);

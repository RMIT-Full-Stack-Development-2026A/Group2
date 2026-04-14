const mongoose = require("mongoose");

const { Schema, model, Types } = mongoose;

const profileSchema = new Schema(
  {
    userID: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    avatarURL: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = model("Profile", profileSchema);

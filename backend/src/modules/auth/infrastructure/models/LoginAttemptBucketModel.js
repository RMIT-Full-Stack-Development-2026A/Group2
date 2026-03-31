import mongoose from "mongoose";

const { Schema, model } = mongoose;

const loginAttemptBucketSchema = new Schema(
  {
    accountKey: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    attemptCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    firstAttemptAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    blockedUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

loginAttemptBucketSchema.index({ accountKey: 1 }, { unique: true });
loginAttemptBucketSchema.index({ blockedUntil: 1 });
loginAttemptBucketSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 7 }
);

export default model("LoginAttemptBucket", loginAttemptBucketSchema);
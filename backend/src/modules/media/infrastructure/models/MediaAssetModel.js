import mongoose from "mongoose";

const { Schema, model } = mongoose;

const authSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sessionType: {
      type: String,
      enum: ["server-session", "refresh-token", "jwt-jti"],
      default: "server-session",
      required: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },

    issuedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
      trim: true,
    },

    ipAddress: {
      type: String,
      default: null,
      trim: true,
    },

    lastUsedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

authSessionSchema.index({ tokenHash: 1 }, { unique: true });
authSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model("AuthSession", authSessionSchema);
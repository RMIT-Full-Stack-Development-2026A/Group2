const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const refreshBlacklistSchema = new Schema(
    {
        token: { type: String, required: true, unique: true, index: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
        revokedAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, required: true },
    },
    {
        versionKey: false,
    },
);

// TTL index: document will be removed when `expiresAt` is reached
refreshBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = model("RefreshBlacklist", refreshBlacklistSchema);

const mongoose = require("mongoose");

const USER_ROLES = ["player", "admin"];
const ACCOUNT_STATUSES = ["active", "inactive", "suspended"];

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: USER_ROLES, default: "player" },
    country: { type: String, required: true, trim: true },
    accountStatus: { type: String, enum: ACCOUNT_STATUSES, default: "active" },
    avatarURL: { type: String, default: null },
    loginAttempts: { type: Number, default: 0 },
    loginLockUntil: { type: Date, default: null },
    isPremium: { type: Boolean, default: false },
    premiumExpiresAt: { type: Date, default: null },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  versionKey: false,
  transform(_doc, ret) {
    delete ret.passwordHash;
    delete ret.loginAttempts;
    delete ret.loginLockUntil;
    return ret;
  },
});

const UserModel = mongoose.model("User", userSchema);
module.exports = { UserModel, USER_ROLES, ACCOUNT_STATUSES };
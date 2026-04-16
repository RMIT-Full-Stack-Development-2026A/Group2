const AppError = require("../../shared/utils/AppError");
const User = require("./model/user.model");
const Profile = require("../profile/model/profile.model");

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function findByEmail(email) {
  return Profile.findOne({ email: email.toLowerCase() }).lean();
}

async function findByUsernameOrEmail(identifier) {
  const trimmed = String(identifier).trim();
  if (!trimmed) {
    return null;
  }
  if (trimmed.includes("@")) {
    const profile = await Profile.findOne({ email: trimmed.toLowerCase() }).lean();
    if (!profile) {
      return null;
    }
    const user = await User.findById(profile.userID).select("+passwordHash").lean();
    return mapAuthUser(user, profile);
  }
  const user = await User.findOne({
    username: new RegExp(`^${escapeRegex(trimmed)}$`, "i"),
  })
    .select("+passwordHash")
    .lean();
  if (!user) {
    return null;
  }
  const profile = await Profile.findOne({ userID: user._id }).lean();
  return mapAuthUser(user, profile);
}

async function createUser(userData) {
  const user = await User.create({
    username: userData.username,
    passwordHash: userData.passwordHash,
    role: userData.role ?? "player",
    accountStatus: userData.accountStatus ?? "active",
  });
  try {
    const profile = await Profile.create({
      userID: user._id,
      displayName: userData.displayName ?? userData.username,
      avatarURL: userData.avatarURL ?? null,
      country: userData.country,
      email: userData.email,
    });
    return mapAuthUser(user.toObject(), profile.toObject());
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw error;
  }
}

async function findById(id) {
  const [user, profile] = await Promise.all([
    User.findById(id).lean(),
    Profile.findOne({ userID: id }).lean(),
  ]);
  if (!user) {
    return null;
  }
  return mapAuthUser(user, profile);
}

async function findByIdWithPasswordHash(id) {
  const [user, profile] = await Promise.all([
    User.findById(id).select("+passwordHash").lean(),
    Profile.findOne({ userID: id }).lean(),
  ]);
  if (!user) {
    return null;
  }
  return mapAuthUser(user, profile);
}

async function updateUser(id, update) {
  const user = await User.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true, runValidators: true },
  ).lean();
  if (!user) {
    return null;
  }
  const profile = await Profile.findOne({ userID: user._id }).lean();
  return mapAuthUser(user, profile);
}

function mapAuthUser(user, profile) {
  if (!user) {
    return null;
  }
  return {
    _id: user._id,
    username: user.username,
    role: user.role,
    accountStatus: user.accountStatus,
    passwordHash: user.passwordHash,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    profile: profile ?? null,
    email: profile?.email ?? null,
    country: profile?.country ?? null,
    avatarURL: profile?.avatarURL ?? null,
    displayName: profile?.displayName ?? user.username,
    profileCreatedAt: profile?.createdAt ?? null,
    profileUpdatedAt: profile?.updatedAt ?? null,
  };
}

async function findAllUsers() {
  return await User.find({}).select("username email accountStatus");
}

async function toggleUserAccountStatus(userId) {
  const user = await findById(userId);
  if (!user) {
    throw new AppError("User not found", { code: "USER_NOT_FOUND", statusCode: 404 });
  }

  user.accountStatus = user.accountStatus === "active" ? "deactivated" : "active";
  await user.save();
  return user;
}

module.exports = {
  findByEmail,
  findByUsernameOrEmail,
  createUser,
  findById,
  findAllUsers,
  toggleUserAccountStatus,
  findByIdWithPasswordHash,
  updateUser,
};
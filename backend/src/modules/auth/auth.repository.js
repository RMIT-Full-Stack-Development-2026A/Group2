const User = require("./model/user.model");
const Profile = require("../profile/model/profile.model");

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function findByEmail(email) {
  const lowered = String(email).toLowerCase();
  const profile = await Profile.findOne({ email: lowered }).lean();
  if (profile) {
    const user = await User.findById(profile.userID).lean();
    return mapAuthUser(user, profile);
  }
  const user = await User.findOne({ email: lowered }).lean();
  return mapAuthUser(user, null);
}

async function findByUsernameOrEmail(identifier) {
  const trimmed = String(identifier).trim();
  if (!trimmed) {
    return null;
  }
  if (trimmed.includes("@")) {
    const profile = await Profile.findOne({ email: trimmed.toLowerCase() }).lean();
    if (profile) {
      const user = await User.findById(profile.userID).select("+passwordHash").lean();
      return mapAuthUser(user, profile);
    }
    const user = await User.findOne({ email: trimmed.toLowerCase() })
      .select("+passwordHash")
      .lean();
    return mapAuthUser(user, null);
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
  const createdUser = await User.create(userData);
  return mapAuthUser(createdUser.toObject(), null);
}

async function findById(id) {
  const [user, profile] = await Promise.all([
    User.findById(id).lean(),
    Profile.findOne({ userID: id }).lean(),
  ]);
  return mapAuthUser(user, profile);
}

async function findByIdWithPasswordHash(id) {
  const [user, profile] = await Promise.all([
    User.findById(id).select("+passwordHash").lean(),
    Profile.findOne({ userID: id }).lean(),
  ]);
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
    email: profile?.email ?? user.email ?? null,
    country: profile?.country ?? user.country ?? null,
    avatarURL: profile?.avatarURL ?? user.avatarURL ?? null,
    displayName: profile?.displayName ?? user.username,
    profileCreatedAt: profile?.createdAt ?? user.createdAt ?? null,
    profileUpdatedAt: profile?.updatedAt ?? user.updatedAt ?? null,
  };
}

module.exports = {
  findByEmail,
  findByUsernameOrEmail,
  createUser,
  findById,
  findByIdWithPasswordHash,
  updateUser,
};
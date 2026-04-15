const AppError = require("../../shared/utils/AppError");
const User = require("./model/user.model");

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function findByEmail(email) {
  return await User.findOne({ email: email.toLowerCase() });
}

async function findByUsernameOrEmail(identifier) {
  const trimmed = String(identifier).trim();
  if (!trimmed) {
    return null;
  }
  if (trimmed.includes("@")) {
    return User.findOne({ email: trimmed.toLowerCase() }).select(
      "+passwordHash",
    );
  }
  return User.findOne({
    username: new RegExp(`^${escapeRegex(trimmed)}$`, "i"),
  }).select("+passwordHash");
}

async function createUser(userData) {
  return await User.create(userData);
}

async function findById(id) {
  return await User.findById(id);
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
};
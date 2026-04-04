const User = require("./auth.model");

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
    return findByEmail(trimmed);
  }
  return User.findOne({
    username: new RegExp(`^${escapeRegex(trimmed)}$`, "i"),
  });
}

async function createUser(userData) {
  return await User.create(userData);
}

async function findById(id) {
  return await User.findById(id);
}

module.exports = {
  findByEmail,
  findByUsernameOrEmail,
  createUser,
  findById,
};
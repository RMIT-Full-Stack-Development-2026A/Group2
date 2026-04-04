const User = require("./auth.model");

async function findByEmail(email) {
  return await User.findOne({ email: email.toLowerCase() });
}

async function createUser(userData) {
  return await User.create(userData);
}

async function findById(id) {
  return await User.findById(id);
}

module.exports = {
  findByEmail,
  createUser,
  findById,
};
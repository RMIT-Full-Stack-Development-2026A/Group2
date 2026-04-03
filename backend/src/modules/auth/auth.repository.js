const User = require("./auth.model");

async function findByEmail(email) {
  return await User.findOne({ email: email.toLowerCase() });
}

async function createUser(userData) {
  return await User.create(userData);
}

module.exports = {
  findByEmail,
  createUser,
};
const Profile = require("./model/profile.model");

async function findByUserId(userId) {
  return Profile.findOne({ userID: userId });
}

async function updateByUserId(userId, update) {
  return Profile.findOneAndUpdate(
    { userID: userId },
    { $set: update },
    { new: true, runValidators: true },
  );
}

module.exports = {
  findByUserId,
  updateByUserId,
};

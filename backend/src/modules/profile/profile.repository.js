const Profile = require("./model/profile.model");

async function findByUserId(userId) {
  return Profile.findOne({ userID: userId });
}

async function updateByUserId(userId, update) {
  return Profile.findOneAndUpdate(
    { userID: userId },
    { $set: update, $setOnInsert: { userID: userId } },
    { new: true, runValidators: true, upsert: true },
  );
}

module.exports = {
  findByUserId,
  updateByUserId,
};

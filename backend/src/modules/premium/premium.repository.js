const SubscriptionPlan = require("./model/subscriptionPlan.model");
const UserSubscription = require("./model/userSubscription.model");
const Transaction = require("./model/transaction.model");
const User = require("../auth/model/user.model");
const Profile = require("../profile/profile.model");

async function findActiveSubscription(userId, now = new Date()) {
  return UserSubscription.findOne({
    userID: userId,
    status: "active",
    endDate: { $gt: now },
  }).populate("planID");
}

async function findOrCreatePremiumPlan(planName, price, durationMonths) {
  return SubscriptionPlan.findOneAndUpdate(
    { planName },
    {
      $setOnInsert: { planName },
      $set: { price, durationMonths, isActive: true },
    },
    { new: true, upsert: true },
  );
}

async function upsertActiveSubscription(userId, planId, startDate, endDate) {
  return UserSubscription.findOneAndUpdate(
    { userID: userId },
    { $set: { planID: planId, status: "active", startDate, endDate } },
    { upsert: true, new: true, runValidators: true },
  );
}

async function createTransaction(payload) {
  return Transaction.create(payload);
}

async function cancelAllSubscriptionsForUser(userId) {
  return UserSubscription.updateMany(
    { userID: userId, status: "active" },
    { $set: { status: "cancelled", endDate: new Date() } },
  );
}

async function findUserById(userId) {
  const [user, profile] = await Promise.all([
    User.findById(userId).lean(),
    Profile.findOne({ userID: userId }).lean(),
  ]);

  if (!user) {
    return null;
  }

  return {
    ...user,
    email: profile?.email || null,
    displayName: profile?.displayName || null,
  };
}

module.exports = {
  findActiveSubscription,
  findOrCreatePremiumPlan,
  upsertActiveSubscription,
  createTransaction,
  cancelAllSubscriptionsForUser,
  findUserById,
};

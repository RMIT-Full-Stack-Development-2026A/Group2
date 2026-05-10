const UserSubscription = require("./model/userSubscription.model");

function createPremiumInterface() {
  async function hasActiveSubscription(userId) {
    const now = new Date();

    const activeSubscription = await UserSubscription.findOne({
      userID: userId,
      status: "active",
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).lean();

    return Boolean(activeSubscription);
  }

  return {
    hasActiveSubscription,
  };
}

module.exports = {
  createPremiumInterface,
};
const UserSubscription = require("./model/userSubscription.model");
const PREMIUM_PRICE_USD = 10;
const PREMIUM_DURATION_MONTHS = 1;
const PREMIUM_PLAN_NAME = "Premium Subscription";

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
  PREMIUM_PRICE_USD,
  PREMIUM_DURATION_MONTHS,
  PREMIUM_PLAN_NAME,
};
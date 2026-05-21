export function isPremiumSubscriptionActive(subscription) {
  return Boolean(subscription?.isPremium && subscription?.expiryDate);
}

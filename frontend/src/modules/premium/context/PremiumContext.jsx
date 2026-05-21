import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { getPremiumMe } from "../services/premium.service";
import { isPremiumSubscriptionActive } from "../utils/premium.helpers";
import { PremiumContext } from "./premium-context";

export function PremiumProvider({ children }) {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [isLoadingPremium, setIsLoadingPremium] = useState(false);

  const isPremiumActive = useMemo(
    () => isPremiumSubscriptionActive(subscription),
    [subscription],
  );

  const applySubscription = useCallback((nextSubscription) => {
    setSubscription(nextSubscription ?? null);
  }, []);

  const refreshPremium = useCallback(async () => {
    if (isLoadingAuth) {
      return null;
    }

    if (!isAuthenticated || user?.role !== "player") {
      setSubscription(null);
      return null;
    }

    setIsLoadingPremium(true);
    try {
      const nextSubscription = await getPremiumMe();
      setSubscription(nextSubscription);
      return nextSubscription;
    } catch {
      setSubscription(null);
      return null;
    } finally {
      setIsLoadingPremium(false);
    }
  }, [isAuthenticated, isLoadingAuth, user?.role]);

  useEffect(() => {
    if (!isLoadingAuth) {
      refreshPremium();
    }
  }, [refreshPremium, isLoadingAuth]);

  const value = useMemo(
    () => ({
      subscription,
      isPremiumActive,
      isLoadingPremium,
      refreshPremium,
      applySubscription,
    }),
    [
      subscription,
      isPremiumActive,
      isLoadingPremium,
      refreshPremium,
      applySubscription,
    ],
  );

  return (
    <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>
  );
}

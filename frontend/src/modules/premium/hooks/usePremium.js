import { useContext } from "react";
import { PremiumContext } from "../context/premium-context";

export function usePremium() {
  const ctx = useContext(PremiumContext);
  if (!ctx) {
    throw new Error("usePremium must be used within PremiumProvider");
  }
  return ctx;
}

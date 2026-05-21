import { useState } from "react";
import { Check, Star, Zap, CreditCard } from "lucide-react";
import { createPremiumCheckoutSession } from "../services/premium.service";
import { usePremium } from "../hooks/usePremium";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const FREE_FEATURES = [
  "Play local games",
  "Play vs AI",
  "Basic online games",
  "View profile",
];

const PREMIUM_FEATURES = [
  "All free features",
  "Match replay with playback",
  "Advanced statistics",
  "Premium badge",
];

export default function PremiumPage() {
  const { subscription, isPremiumActive, isLoadingPremium } = usePremium();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handlePayStripe() {
    try {
      setBusy(true);
      setError("");
      const session = await createPremiumCheckoutSession();
      if (!session?.url) {
        throw new Error("Stripe checkout URL was not returned.");
      }
      window.location.href = session.url;
    } catch (err) {
      setBusy(false);
      setError(err.message || "Stripe checkout failed.");
    }
  }

  if (isLoadingPremium) {
    return <p className="text-secondary mb-0">Loading premium data...</p>;
  }

  return (
    <div className="container py-2">
      <div className="text-center mb-4">
        <h1 className="fw-bold mb-2">Premium Subscription</h1>
        <p className="text-secondary mb-0">
          Unlock the full TicTacToang experience
        </p>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div
            className={`card h-100 shadow-sm ${
              !isPremiumActive ? "border-primary border-2" : "border-secondary-subtle"
            }`}
          >
            <div className="card-body p-4">
              <h3 className="fw-bold mb-1">Free Plan</h3>
              <p className="text-secondary mb-3">Basic access</p>
              <div className="mb-3">
                <span className="display-6 fw-bold">$0</span>
                <span className="text-secondary"> /month</span>
              </div>
              <ul className="list-unstyled mb-0">
                {FREE_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="d-flex align-items-center gap-2 mb-2"
                  >
                    <Check size={18} strokeWidth={2.5} className="text-warning" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div
            className={`card h-100 shadow-sm ${
              isPremiumActive ? "border-warning border-2" : "border-secondary-subtle"
            }`}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-1">
                <h3 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Star size={22} strokeWidth={2.5} className="text-warning" />
                  Premium
                </h3>
                {isPremiumActive ? (
                  <span className="badge rounded-pill text-bg-warning text-dark px-3 py-2">
                    Active
                  </span>
                ) : null}
              </div>
              <p className="text-secondary mb-3">Full access to all features</p>
              <div className="mb-3">
                <span className="display-6 fw-bold">$10</span>
                <span className="text-secondary"> /month</span>
              </div>
              <ul className="list-unstyled mb-0">
                {PREMIUM_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="d-flex align-items-center gap-2 mb-2"
                  >
                    <Check size={18} strokeWidth={2.5} className="text-warning" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Zap size={20} strokeWidth={2.5} className="text-warning" />
            Checkout
          </h5>
          <p className="text-secondary mb-3">Secure payment with Stripe</p>

          {isPremiumActive ? (
            <div className="bg-light border rounded-3 text-center py-3 px-3">
              <p className="fw-semibold mb-1">You're already a Premium member!</p>
              <small className="text-secondary">
                Next billing: {formatDate(subscription?.expiryDate)}
              </small>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-primary w-100 py-2 fw-semibold d-inline-flex align-items-center justify-content-center gap-2"
              onClick={handlePayStripe}
              disabled={busy}
            >
              <CreditCard size={18} strokeWidth={2.5} />
              Pay with Stripe — $10.00/month
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

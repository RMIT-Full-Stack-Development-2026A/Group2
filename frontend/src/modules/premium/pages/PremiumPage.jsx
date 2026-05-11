import { useEffect, useMemo, useState } from "react";
import { Check, Star, Zap, CreditCard } from "lucide-react";
import {
  createPremiumCheckoutSession,
  createPremiumTestCheckoutSession,
  getPremiumMe,
  resetPremiumStatus,
  sendPremiumTestEmail,
} from "../services/premium.service";
import { getProfile } from "../../profile/services/profile.service";

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
  "Priority matchmaking",
  "Advanced statistics",
  "Email notifications",
  "Premium badge",
];

export default function PremiumPage() {
  const [subscription, setSubscription] = useState(null);
  const [accountEmail, setAccountEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [emailBusy, setEmailBusy] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function refreshStatus() {
    const [subscriptionData, profile] = await Promise.all([
      getPremiumMe(),
      getProfile(),
    ]);
    setSubscription(subscriptionData);
    setAccountEmail(profile?.email || "");
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await refreshStatus();
      } catch (err) {
        setError(err.message || "Could not load premium information.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const isPremiumActive = useMemo(
    () => Boolean(subscription?.isPremium && subscription?.expiryDate),
    [subscription],
  );

  async function handlePayStripe() {
    try {
      setBusy(true);
      setError("");
      setMessage("");
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

  async function handleTestStripePayment() {
    try {
      setBusy(true);
      setError("");
      setMessage("");
      const session = await createPremiumTestCheckoutSession();
      if (!session?.url) {
        throw new Error("Stripe test checkout URL was not returned.");
      }
      window.location.href = session.url;
    } catch (err) {
      setBusy(false);
      setError(err.message || "Stripe test checkout failed.");
    }
  }

  async function handleSendTestEmail() {
    try {
      setEmailBusy(true);
      setError("");
      setMessage("");
      const result = await sendPremiumTestEmail();
      setMessage(result);
    } catch (err) {
      setError(err.message || "Test email failed.");
    } finally {
      setEmailBusy(false);
    }
  }

  async function handleResetPremium() {
    const confirmed = window.confirm(
      "Reset your premium status? This will cancel your active subscription so you can test the flow again.",
    );
    if (!confirmed) {
      return;
    }
    try {
      setResetBusy(true);
      setError("");
      setMessage("");
      const result = await resetPremiumStatus();
      await refreshStatus();
      setMessage(result);
    } catch (err) {
      setError(err.message || "Could not reset premium status.");
    } finally {
      setResetBusy(false);
    }
  }

  if (loading) {
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

      {message ? <div className="alert alert-success">{message}</div> : null}
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

      <div className="card shadow-sm mb-3">
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

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h6 className="fw-bold text-secondary mb-2">Developer Testing</h6>
          <p className="small text-secondary mb-3">
            Email for notifications:{" "}
            <strong>{accountEmail || "No email found on this account"}</strong>
          </p>
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-outline-dark btn-sm"
              onClick={handleTestStripePayment}
              disabled={busy}
            >
              Test Stripe Payment
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={handleSendTestEmail}
              disabled={emailBusy}
            >
              {emailBusy ? "Sending..." : "Send Test Email"}
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={handleResetPremium}
              disabled={resetBusy || !isPremiumActive}
            >
              {resetBusy ? "Resetting..." : "Reset Premium"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import {
  createPremiumCheckoutSession,
  getPremiumMe,
  sendPremiumTestEmail,
} from "../services/premium.service";
import { getProfile } from "../../profile/services/profile.service";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function PremiumPage() {
  const [subscription, setSubscription] = useState(null);
  const [accountEmail, setAccountEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [emailBusy, setEmailBusy] = useState(false);
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

  if (loading) {
    return <p className="text-secondary mb-0">Loading premium data...</p>;
  }

  return (
    <div className="container-fluid px-0">
      <h1 className="fw-bold mb-3">Premium Subscription</h1>

      {message ? <div className="alert alert-success">{message}</div> : null}
      {error ? <div className="alert alert-danger">{error}</div> : null}

      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Premium Status</h5>
          <p className="mb-1">
            Status:{" "}
            <strong>{isPremiumActive ? "Premium Active" : "Free"}</strong>
          </p>
          <p className="mb-1">
            Email for notifications:{" "}
            <strong>{accountEmail || "No email found on this account"}</strong>
          </p>
          <p className="mb-3">Expiry: {formatDate(subscription?.expiryDate)}</p>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handlePayStripe}
            disabled={busy || isPremiumActive}
          >
            Pay with Stripe ($10)
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary ms-2"
            onClick={handleSendTestEmail}
            disabled={emailBusy}
          >
            {emailBusy ? "Sending..." : "Send Test Email"}
          </button>
        </div>
      </div>
    </div>
  );
}

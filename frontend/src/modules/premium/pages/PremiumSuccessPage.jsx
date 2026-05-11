import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CircleCheck, Sparkles, XCircle } from "lucide-react";
import { confirmPremiumCheckoutSession } from "../services/premium.service";

export default function PremiumSuccessPage() {
  const [searchParams] = useSearchParams();
  const [phase, setPhase] = useState("verifying");
  const [statusText, setStatusText] = useState("Verifying your payment with Stripe…");
  const confirmedSessionRef = useRef(null);

  useEffect(() => {
    (async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        setStatusText("Missing Stripe session id in return URL.");
        setPhase("error");
        return;
      }

      if (confirmedSessionRef.current === sessionId) {
        return;
      }
      confirmedSessionRef.current = sessionId;

      try {
        await confirmPremiumCheckoutSession(sessionId);
        setStatusText("Your subscription is active. Enjoy the full TicTacToang experience.");
        setPhase("success");
      } catch (error) {
        setStatusText(error.message || "We could not confirm this payment yet.");
        setPhase("error");
      }
    })();
  }, [searchParams]);

  return (
    <div className="container py-4">
      <div className="mx-auto" style={{ maxWidth: 520 }}>
        <div className="text-center mb-4">
          <h1 className="fw-bold mb-2">Payment complete</h1>
          <p className="text-secondary mb-0 small">
            {phase === "verifying"
              ? "Hang tight — we are confirming your checkout."
              : phase === "success"
                ? "Thank you for upgrading."
                : "Something went wrong"}
          </p>
        </div>

        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-body text-center px-4 py-5">
            {phase === "verifying" ? (
              <>
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary mb-4"
                  style={{ width: 88, height: 88 }}
                >
                  <div className="spinner-border" role="status" style={{ width: "2.25rem", height: "2.25rem" }}>
                    <span className="visually-hidden">Loading…</span>
                  </div>
                </div>
                <p className="text-secondary mb-0 px-2">{statusText}</p>
              </>
            ) : null}

            {phase === "success" ? (
              <>
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 text-success mb-3"
                  style={{ width: 88, height: 88 }}
                >
                  <CircleCheck size={44} strokeWidth={2} />
                </div>
                <h2 className="h5 fw-bold mb-2">You&apos;re all set</h2>
                <p className="text-secondary mb-4 px-2 small">{statusText}</p>
                <div className="d-flex align-items-center justify-content-center gap-2 text-warning mb-4">
                  <Sparkles size={18} strokeWidth={2.5} />
                  <span className="fw-semibold small">Premium unlocked</span>
                </div>
                <Link to="/premium" className="btn btn-primary px-4 fw-semibold">
                  View subscription
                </Link>
              </>
            ) : null}

            {phase === "error" ? (
              <>
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 text-danger mb-3"
                  style={{ width: 88, height: 88 }}
                >
                  <XCircle size={44} strokeWidth={2} />
                </div>
                <h2 className="h5 fw-bold mb-2">Could not confirm</h2>
                <p className="text-secondary mb-4 px-2 small">{statusText}</p>
                <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                  <Link to="/premium" className="btn btn-primary px-4 fw-semibold">
                    Back to Premium
                  </Link>
                  <Link to="/dashboard" className="btn btn-outline-secondary px-4">
                    Dashboard
                  </Link>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {phase === "verifying" ? (
          <p className="text-center text-secondary small mt-3 mb-0">
            This usually takes a few seconds.
          </p>
        ) : null}
      </div>
    </div>
  );
}

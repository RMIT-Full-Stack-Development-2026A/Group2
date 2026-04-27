import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { confirmPremiumCheckoutSession } from "../services/premium.service";

export default function PremiumSuccessPage() {
  const [searchParams] = useSearchParams();
  const [statusText, setStatusText] = useState("Verifying payment...");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    (async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        setStatusText("Missing Stripe session id in return URL.");
        setIsError(true);
        return;
      }

      try {
        await confirmPremiumCheckoutSession(sessionId);
        setStatusText("Premium has been activated successfully.");
      } catch (error) {
        setStatusText(error.message || "Could not confirm Stripe payment yet.");
        setIsError(true);
      }
    })();
  }, [searchParams]);

  return (
    <div className="container-fluid px-0">
      <div className="card">
        <div className="card-body">
          <h1 className="h4 fw-bold mb-2">Payment Successful</h1>
          <p className={`mb-3 ${isError ? "text-danger" : "text-secondary"}`}>{statusText}</p>
          <Link to="/premium" className="btn btn-primary">
            Back to Premium
          </Link>
        </div>
      </div>
    </div>
  );
}

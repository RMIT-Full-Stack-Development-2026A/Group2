import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard } from "lucide-react";

export default function PremiumCancelPage() {
  return (
    <div className="container py-4">
      <div className="mx-auto" style={{ maxWidth: 520 }}>
        <div className="text-center mb-4">
          <h1 className="fw-bold mb-2">Checkout cancelled</h1>
          <p className="text-secondary mb-0 small">
            No charge was made. You can try again whenever you&apos;re ready.
          </p>
        </div>

        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-body text-center px-4 py-5">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary bg-opacity-10 text-secondary mb-3"
              style={{ width: 88, height: 88 }}
            >
              <CreditCard size={40} strokeWidth={2} />
            </div>
            <h2 className="h5 fw-bold mb-2">Payment not completed</h2>
            <p className="text-secondary mb-4 px-2 small">
              Your Stripe session was closed before completion. Your account and subscription are unchanged.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
              <Link
                to="/premium"
                className="btn btn-primary px-4 fw-semibold d-inline-flex align-items-center justify-content-center gap-2"
              >
                <ArrowLeft size={18} strokeWidth={2.5} />
                Return to Premium
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

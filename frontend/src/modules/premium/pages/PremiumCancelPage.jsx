import { Link } from "react-router-dom";

export default function PremiumCancelPage() {
  return (
    <div className="container-fluid px-0">
      <div className="card">
        <div className="card-body">
          <h1 className="h4 fw-bold mb-2">Payment Cancelled</h1>
          <p className="text-secondary mb-3">
            Your Stripe payment was cancelled. No premium changes were made.
          </p>
          <Link to="/premium" className="btn btn-outline-primary">
            Back to Premium
          </Link>
        </div>
      </div>
    </div>
  );
}

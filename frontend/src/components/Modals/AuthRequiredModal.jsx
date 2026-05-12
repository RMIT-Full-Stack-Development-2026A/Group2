import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

/**
 * AuthRequiredModal
 * A modal displayed when unauthenticated users try to access features
 * that require login. Provides options to login or sign up.
 */
export default function AuthRequiredModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleSignUp = () => {
    onClose();
    navigate("/register");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{
          display: "block",
          zIndex: 1040,
        }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show"
        style={{
          display: "block",
          zIndex: 1050,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflowY: "auto",
        }}
        role="dialog"
        tabIndex="-1"
        aria-labelledby="authRequiredModalLabel"
        aria-hidden="false"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content border-0 rounded-4">
            {/* Modal Header */}
            <div className="modal-header bg-light border-0">
              <h5 className="modal-title fw-bold" id="authRequiredModalLabel">
                Login or sign up to continue
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <p className="text-secondary mb-0">
                You need an account to access this feature.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer border-0 gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="text-secondary"
              >
                Cancel
              </Button>
              <Button variant="secondary" onClick={handleLogin}>
                Login
              </Button>
              <Button variant="default" onClick={handleSignUp}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

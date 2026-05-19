import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthRequiredModal from "../../../components/Modals/AuthRequiredModal";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // For guests on public layout, use context modal state
  // For authenticated users in App layout, use local state
  const outletContext = useOutletContext() || {};
  const contextShowAuthModal = outletContext.showAuthModal;
  const contextSetShowAuthModal = outletContext.setShowAuthModal;
  
  const [localShowAuthModal, setLocalShowAuthModal] = useState(false);
  const showAuthModal = isAuthenticated ? localShowAuthModal : (contextShowAuthModal ?? false);
  const setShowAuthModal = isAuthenticated ? setLocalShowAuthModal : (contextSetShowAuthModal ?? setLocalShowAuthModal);
  
  const displayName = user?.displayName ?? user?.username ?? "Guest";
  const welcomeMessage = isAuthenticated 
    ? `Welcome, ${displayName}!` 
    : "Welcome to TicTacToang!";
  const subtitle = isAuthenticated
    ? "Choose a game mode to start playing"
    : "Choose a game mode or create an account to start playing";

  const handleActionClick = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
        <div className="text-center mb-5">
          <h1 className="fw-bold">{welcomeMessage}</h1>
          <p className="text-secondary fs-5">{subtitle}</p>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-md-4" onClick={() => handleActionClick("/game/local")} style={{ cursor: "pointer" }}>
            <div className="card h-100 shadow-sm border-0 rounded-4">
              <div className="card-body p-4">
                <h4 className="fw-bold">Local 2-Player</h4>
                <p className="text-secondary mb-0">Play with a friend on the same device</p>
              </div>
            </div>
          </div>

          <div className="col-md-4" onClick={() => handleActionClick("/game/ai")} style={{ cursor: "pointer" }}>
            <div className="card h-100 shadow-sm border-0 rounded-4">
              <div className="card-body p-4">
                <h4 className="fw-bold">vs AI</h4>
                <p className="text-secondary mb-0">Challenge the computer at 3 difficulty levels</p>
              </div>
            </div>
          </div>

          <div className="col-md-4" onClick={() => handleActionClick("/online")} style={{ cursor: "pointer" }}>
            <div className="card h-100 shadow-sm border-0 rounded-4">
              <div className="card-body p-4">
                <h4 className="fw-bold">Online Arena</h4>
                <p className="text-secondary mb-0">Play against others in real-time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Required Modal - only render locally for authenticated users in App layout */}
        {isAuthenticated && (
          <AuthRequiredModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        )}
    </>
  );
}

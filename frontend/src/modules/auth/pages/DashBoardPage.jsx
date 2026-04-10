import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  const displayName = user?.username ?? "player";

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container">
          <span className="navbar-brand fw-bold text-primary mb-0">TicTacToang</span>

          <div className="ms-auto d-flex align-items-center gap-3">
            <span className="badge text-bg-secondary rounded-pill px-3 py-2">
              {user?.role ?? "player"}
            </span>
            <span className="text-secondary">{displayName}</span>
            <button type="button" className="btn btn-outline-dark btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold">Welcome, {displayName}!</h1>
          <p className="text-secondary fs-5">Choose a game mode to start playing</p>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-md-4" onClick={() => navigate("/game/local")} style={{ cursor: "pointer" }}>
            <div className="card h-100 shadow-sm border-0 rounded-4">
              <div className="card-body p-4">
                <h4 className="fw-bold">Local 2-Player</h4>
                <p className="text-secondary mb-0">Play with a friend on the same device</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 rounded-4">
              <div className="card-body p-4">
                <h4 className="fw-bold">vs AI</h4>
                <p className="text-secondary mb-0">Challenge the computer at 3 difficulty levels</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 rounded-4">
              <div className="card-body p-4">
                <h4 className="fw-bold">Online Arena</h4>
                <p className="text-secondary mb-0">Play against others in real-time</p>
              </div>
            </div>
          </div>
          
          <Link to="/profile" className="col-md-4 text-decoration-none">View Profile</Link>
        </div>
      </div>
    </div>
  );
}

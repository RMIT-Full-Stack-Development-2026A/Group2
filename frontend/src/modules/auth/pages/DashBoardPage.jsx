import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.username ?? "player";

  return (
    <>
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
    </>
  );
}

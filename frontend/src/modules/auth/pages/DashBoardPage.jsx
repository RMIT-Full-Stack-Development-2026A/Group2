import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("accessToken");
    navigate("/login");
  }

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container">
          <span className="navbar-brand fw-bold text-primary mb-0">TicTacToang</span>

          <div className="ms-auto d-flex align-items-center gap-3">
            <span className="badge text-bg-warning rounded-pill px-3 py-2">PREMIUM</span>
            <span className="text-secondary">player1</span>
            <button className="btn btn-outline-dark btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold">Welcome, player1!</h1>
          <p className="text-secondary fs-5">Choose a game mode to start playing</p>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-md-4">
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
        </div>
      </div>
    </div>
  );
}
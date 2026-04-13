import { useNavigate } from "react-router-dom";

export default function WinnerBanner({ winner, player1, player2, resetGame }) {
  const navigate = useNavigate();

  if (winner === null) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="winner-dialog-title"
        style={{ backgroundColor: "rgba(33, 37, 41, 0.6)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg text-center p-4 p-md-5">
            <div className="modal-body">
              <h2 className="modal-title fw-bold mb-2" id="winner-dialog-title">
                {winner === 1 ? player1 : player2} wins!
              </h2>
              <p className="text-secondary mb-4">5 in a row!</p>
              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                <button type="button" className="btn btn-primary btn-lg px-4" onClick={resetGame}>
                  Play Again
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg px-4"
                  onClick={() => navigate("/dashboard")}
                >
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" aria-hidden="true" />
    </>
  );
}

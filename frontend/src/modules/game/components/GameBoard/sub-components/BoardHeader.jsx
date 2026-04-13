import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

export default function BoardHeader({
  boardSize,
  timer,
  aborted,
  paused,
  togglePause,
  abortGame,
  resetGame,
  gameStatus,
}) {
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const navigate = useNavigate();

  /** null | "pause" | "abort" */
  const [modal, setModal] = useState(null);

  function openPauseModal() {
    if (aborted || gameStatus === "won") return;
    if (typeof togglePause !== "function") return;
    if (!paused) {
      togglePause();
    }
    setModal("pause");
  }

  function closePauseModalStayPaused() {
    setModal(null);
  }

  function resumeFromModal() {
    if (paused && typeof togglePause === "function") {
      togglePause();
    }
    setModal(null);
  }

  function openAbortModal() {
    if (aborted || gameStatus === "won") return;
    setModal("abort");
  }

  function confirmAbortToMenu() {
    abortGame();
    setModal(null);
    navigate("/dashboard");
  }

  function cancelAbortModal() {
    setModal(null);
  }

  const controlsDisabled = aborted || gameStatus === "won";

  const pauseModal =
    modal === "pause" && !aborted && gameStatus === "ongoing" ? (
      <>
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pause-dialog-title"
          style={{ backgroundColor: "rgba(33, 37, 41, 0.5)", zIndex: 1060 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closePauseModalStayPaused();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              closePauseModalStayPaused();
            }
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header border-0 pb-0">
                <h2 className="modal-title fs-5 fw-bold" id="pause-dialog-title">
                  Game paused
                </h2>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closePauseModalStayPaused}
                />
              </div>
              <div className="modal-body text-secondary pt-2">
                The clock is stopped and moves are disabled until you resume.
              </div>
              <div className="modal-footer border-0 gap-2">
                <button type="button" className="btn btn-outline-secondary" onClick={closePauseModalStayPaused}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={resumeFromModal}>
                  Resume
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show" style={{ zIndex: 1055 }} aria-hidden="true" />
      </>
    ) : null;

  const abortModal =
    modal === "abort" && !aborted && gameStatus === "ongoing" ? (
      <>
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="abort-dialog-title"
          style={{ backgroundColor: "rgba(33, 37, 41, 0.5)", zIndex: 1060 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cancelAbortModal();
            }
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header border-0 pb-0">
                <h2 className="modal-title fs-5 fw-bold text-dark" id="abort-dialog-title">
                  Leave this game?
                </h2>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={cancelAbortModal}
                />
              </div>
              <div className="modal-body text-secondary pt-2">
                You will exit the local match and return to the dashboard. This game will not be saved.
              </div>
              <div className="modal-footer border-0 gap-2">
                <button type="button" className="btn btn-outline-secondary" onClick={cancelAbortModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmAbortToMenu}>
                  Back to menu
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show" style={{ zIndex: 1055 }} aria-hidden="true" />
      </>
    ) : null;

  return (
    <>
      <div className="position-relative d-flex align-items-center w-100 mx-auto mb-3 mb-md-4" style={{ maxWidth: "980px", minHeight: "52px" }}>
        <div className="flex-grow-1 d-flex align-items-center gap-2 position-relative z-1">
          <span className="badge rounded-pill bg-light text-secondary border fw-semibold px-3 py-2">LOCAL</span>
          <span className="badge rounded-pill bg-light text-secondary border fw-semibold px-3 py-2">
            {boardSize}x{boardSize}
          </span>
        </div>

        <div className="position-absolute top-50 start-50 translate-middle font-monospace fs-4 fw-bold text-dark user-select-none">
          {formatTime(timer)}
        </div>

        <div className="flex-grow-1 d-flex align-items-center justify-content-end gap-2 position-relative z-1">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={resetGame}>
            Restart
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={paused ? resumeFromModal : openPauseModal}
            disabled={controlsDisabled}
          >
            {paused ? "Resume" : "Pause"}
          </button>
          <button type="button" className="btn btn-danger btn-sm" onClick={openAbortModal} disabled={controlsDisabled}>
            Abort
          </button>
        </div>
      </div>

      {typeof document !== "undefined" && pauseModal ? createPortal(pauseModal, document.body) : null}
      {typeof document !== "undefined" && abortModal ? createPortal(abortModal, document.body) : null}
    </>
  );
}

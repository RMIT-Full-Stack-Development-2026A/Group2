import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, RotateCcw, Pause, Flag } from "lucide-react";

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

  useEffect(() => {
    if (aborted || gameStatus === "won") {
      setModal(null);
    }
  }, [aborted, gameStatus]);

  const pillStyle = {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.06em",
    background: "#f1f5f9",
    color: "#334155",
    border: "1px solid #e2e8f0",
  };

  const btnOutline = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    background: "#fff",
    border: "1px solid #cbd5e1",
    color: "#0f172a",
  };

  const btnPauseStyle = {
    ...btnOutline,
    border: "1px solid #94a3b8",
  };

  function openPauseModal() {
    if (aborted || gameStatus === "won") return;
    if (!paused) {
      togglePause();
    }
    setModal("pause");
  }

  function closePauseModalStayPaused() {
    setModal(null);
  }

  function resumeFromModal() {
    if (paused) {
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

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
    padding: 16,
  };

  const panelStyle = {
    background: "#fff",
    borderRadius: 16,
    padding: "28px 32px",
    maxWidth: 400,
    width: "100%",
    boxShadow: "0 24px 48px rgba(15, 23, 42, 0.2)",
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 980,
        minHeight: 52,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 8,
          justifyContent: "flex-start",
          zIndex: 1,
        }}
      >
        <span style={pillStyle}>LOCAL</span>
        <span style={pillStyle}>
          {boardSize}x{boardSize}
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "ui-monospace, monospace",
          fontSize: 22,
          fontWeight: 700,
          color: "#0f172a",
        }}
      >
        <Clock size={22} strokeWidth={2} color="#64748b" aria-hidden />
        {formatTime(timer)}
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 10,
          zIndex: 1,
        }}
      >
        <button type="button" onClick={resetGame} style={btnOutline}>
          <RotateCcw size={16} />
          Restart
        </button>
        <button
          type="button"
          onClick={paused ? resumeFromModal : openPauseModal}
          disabled={aborted || gameStatus === "won"}
          style={{
            ...btnPauseStyle,
            opacity: aborted || gameStatus === "won" ? 0.45 : 1,
          }}
        >
          <Pause size={16} />
          {paused ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          onClick={openAbortModal}
          disabled={aborted || gameStatus === "won"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: aborted || gameStatus === "won" ? "not-allowed" : "pointer",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            opacity: aborted || gameStatus === "won" ? 0.45 : 1,
          }}
        >
          <Flag size={16} />
          Abort
        </button>
      </div>

      {modal === "pause" && (
        <div
          style={overlayStyle}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pause-dialog-title"
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
          <div
            style={panelStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="pause-dialog-title" style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700 }}>
              Game paused
            </h2>
            <p style={{ margin: "0 0 24px", color: "#64748b", fontSize: 15, lineHeight: 1.5 }}>
              The clock is stopped and moves are disabled until you resume.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={closePauseModalStayPaused}
                style={{
                  ...btnOutline,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={resumeFromModal}
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                }}
              >
                Resume
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "abort" && (
        <div
          style={overlayStyle}
          role="dialog"
          aria-modal="true"
          aria-labelledby="abort-dialog-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) cancelAbortModal();
          }}
        >
          <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
            <h2 id="abort-dialog-title" style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
              Leave this game?
            </h2>
            <p style={{ margin: "0 0 24px", color: "#64748b", fontSize: 15, lineHeight: 1.5 }}>
              You will exit the local match and return to the dashboard. This game will not be saved.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button type="button" onClick={cancelAbortModal} style={{ ...btnOutline, cursor: "pointer" }}>
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAbortToMenu}
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                }}
              >
                Back to menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

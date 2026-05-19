import { X } from "lucide-react";
import { useMatchReplay } from "../../../hooks/useMatchReplay";
import MatchReplay from "../MatchReplay";
import styles from "./MatchReplayModal.module.css";

export default function MatchReplayModal({ sessionId, open, onOpenChange }) {
  const {
    replayData,
    loading,
    error,
    currentMoveIndex,
    isPlaying,
    board,
    currentMove,
    totalMoves,
    handlePlayPause,
    handlePrevious,
    handleNext,
    handleSliderChange,
  } = useMatchReplay(sessionId);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={() => onOpenChange(false)}>
      <div
        className="modal-dialog modal-xl modal-dialog-centered"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
          <div className="modal-header bg-light border-bottom py-3 px-4">
            <div>
              <h5 className="modal-title mb-0">Match Replay</h5>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              <X size={20} aria-hidden />
            </button>
          </div>

          <div className="modal-body p-0">
            {loading && (
              <div className="d-flex flex-column align-items-center justify-content-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 mb-0 text-muted">Loading replay...</p>
              </div>
            )}

            {error && (
              <div className="p-5 text-center">
                <p className="text-danger mb-3">{error}</p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </button>
              </div>
            )}

            {!loading && !error && replayData && (
              <MatchReplay
                replayData={replayData}
                board={board}
                currentMoveIndex={currentMoveIndex}
                isPlaying={isPlaying}
                currentMove={currentMove}
                totalMoves={totalMoves}
                onPlayPause={handlePlayPause}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSliderChange={handleSliderChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

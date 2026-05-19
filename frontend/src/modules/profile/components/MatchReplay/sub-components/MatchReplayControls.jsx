import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import styles from "./MatchReplayControls.module.css";

export default function MatchReplayControls({
  currentMove,
  currentMoveIndex,
  totalMoves,
  isPlaying,
  participants,
  onPlayPause,
  onPrevious,
  onNext,
  onSliderChange,
}) {
  const currentPlayer = participants?.find(
    (p) => p.id === currentMove?.participantID,
  );
  const movePosition = currentMove
    ? `${String.fromCharCode(65 + currentMove.colIndex)}${currentMove.rowIndex + 1}`
    : "-";

  return (
    <div className={styles.controls}>
      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Move</span>
          <span className={`${styles.metaValue} ${styles.metaValueLarge}`}>
            {currentMoveIndex + 1} / {totalMoves}
          </span>
        </div>
        <div className={styles.metaGroup}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Player</span>
            <span className={styles.metaValue}>
              {currentPlayer?.displayName || "-"}
            </span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Position</span>
            <span className={styles.metaValue}>{movePosition}</span>
          </div>
        </div>
      </div>

      <div className={styles.transport}>
        <button
          type="button"
          className={styles.transportBtn}
          onClick={onPrevious}
          disabled={currentMoveIndex === 0}
          title="Previous move"
          aria-label="Previous move"
        >
          <ChevronLeft size={18} aria-hidden />
        </button>
        <button
          type="button"
          className={`${styles.transportBtn} ${styles.transportBtnPrimary}`}
          onClick={onPlayPause}
          title={isPlaying ? "Pause" : "Play"}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={18} aria-hidden />
          ) : (
            <Play size={18} aria-hidden />
          )}
        </button>
        <button
          type="button"
          className={styles.transportBtn}
          onClick={onNext}
          disabled={currentMoveIndex >= totalMoves - 1}
          title="Next move"
          aria-label="Next move"
        >
          <ChevronRight size={18} aria-hidden />
        </button>
        <button
          type="button"
          className={styles.transportBtn}
          onClick={() => onSliderChange(0)}
          disabled={currentMoveIndex === 0}
          title="Restart replay"
          aria-label="Restart replay"
        >
          <RotateCcw size={18} aria-hidden />
        </button>
      </div>

      <input
        type="range"
        className={styles.scrubber}
        min="0"
        max={Math.max(0, totalMoves - 1)}
        value={currentMoveIndex}
        onChange={(event) => onSliderChange(Number(event.target.value))}
        aria-label="Replay scrubber"
      />
    </div>
  );
}

import { formatTime } from "../../../utils/game.helpers";
import styles from "./GameHeaderBar.module.css";

export default function GameHeaderBar({
  gameType,
  boardSize,
  aiDifficulty,
  elapsed,
  winner,
  aborted,
  isPaused,
  onRestart,
  onTogglePause,
  onAbort,
}) {
  const isOnline = gameType === "online";

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <span className={styles.badge}>{String(gameType).toUpperCase()}</span>
        <span className={styles.badge}>
          {boardSize}×{boardSize}
        </span>
        {aiDifficulty ? <span className={styles.secondaryBadge}>{aiDifficulty}</span> : null}
      </div>

      <div className={styles.timer}>
        <span className={styles.timerIcon}>🕒</span>
        <span>{formatTime(elapsed)}</span>
      </div>

      {!isOnline ? (
      <div className={styles.actions}>
        <button type="button" className={styles.ghostBtn} onClick={onRestart}>
          Restart
        </button>
        <button
          type="button"
          className={styles.secondaryBtn}
          disabled={!!winner || aborted}
          onClick={onTogglePause}
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button type="button" className={styles.dangerBtn} onClick={onAbort}>
          Abort
        </button>
      </div>
      ) : null}
    </div>
  );
}
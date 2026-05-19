import { Clock, Share2 } from "lucide-react";
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
  isSpectator = false,
  onShareMatch,
  isShareLoading = false,
}) {
  const isOnline = gameType === "online";
  const canShareMatch = isOnline && !isSpectator && typeof onShareMatch === "function";

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <span className={styles.badge}>
          {isSpectator ? "SPECTATOR" : String(gameType).toUpperCase()}
        </span>
        <span className={styles.badge}>
          {boardSize}x{boardSize}
        </span>
        {aiDifficulty ? <span className={styles.secondaryBadge}>{aiDifficulty}</span> : null}
      </div>

      <div className={styles.timer}>
        <Clock className={styles.timerIcon} aria-hidden="true" />
        <span>{formatTime(elapsed)}</span>
      </div>

      {canShareMatch ? (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={onShareMatch}
            disabled={isShareLoading || !!winner || aborted}
          >
            <Share2 className={styles.buttonIcon} aria-hidden="true" />
            {isShareLoading ? "Creating..." : "Share Match"}
          </button>
        </div>
      ) : null}

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

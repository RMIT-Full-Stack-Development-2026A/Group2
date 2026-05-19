import styles from "./WinnerDialog.module.css";

export default function OnlineMatchResultDialog({
  open,
  winner,
  result,
  onPlayAgain,
  onLeaveRoom,
  onHistory,
}) {
  if (!open) return null;

  const isDraw = result === "draw" || !winner;
  const label = isDraw ? "Match drawn" : `${winner} wins!`;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Online match result"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <span className={`${styles.spark} ${styles.sparkOne}`} aria-hidden="true" />
        <span className={`${styles.spark} ${styles.sparkTwo}`} aria-hidden="true" />
        <span className={`${styles.spark} ${styles.sparkThree}`} aria-hidden="true" />

        <div className={styles.header}>
          <p className={styles.kicker}>Match result</p>
          <h2 className={styles.title}>{label}</h2>
          <p className={styles.description}>
            Choose whether to request a rematch or leave this room.
          </p>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onHistory}
          >
            Match History
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onLeaveRoom}
          >
            Leave Room
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={onPlayAgain}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

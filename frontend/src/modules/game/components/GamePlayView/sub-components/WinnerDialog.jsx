import styles from "./WinnerDialog.module.css";

export default function WinnerDialog({
  open,
  winner,
  onOpenChange,
  onHistory,
  onPlayAgain,
}) {
  if (!open) return null;

  const label = winner ? `${winner} wins!` : "Game complete";

  return (
    <div
      className={styles.backdrop}
      onClick={() => onOpenChange(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Game result"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Close result popup"
          onClick={() => onOpenChange(false)}
        >
          ×
        </button>

        <div className={styles.header}>
          <p className={styles.kicker}>Match result</p>
          <h2 className={styles.title}>{label}</h2>
          <p className={styles.description}>Congratulations. The game is over.</p>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              onOpenChange(false);
              onHistory();
            }}
          >
            Match History
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              onOpenChange(false);
              onPlayAgain();
            }}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
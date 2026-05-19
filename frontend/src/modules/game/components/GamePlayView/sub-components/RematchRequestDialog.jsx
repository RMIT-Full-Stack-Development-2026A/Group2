import styles from "./WinnerDialog.module.css";

export default function RematchRequestDialog({
  open,
  opponentName,
  onAccept,
  onDecline,
}) {
  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Rematch request"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <p className={styles.kicker}>Rematch requested</p>
          <h2 className={styles.title}>Play again?</h2>
          <p className={styles.description}>
            {opponentName || "Your opponent"} wants to play again.
          </p>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onDecline}
          >
            Leave Room
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={onAccept}
          >
            Accept Rematch
          </button>
        </div>
      </div>
    </div>
  );
}

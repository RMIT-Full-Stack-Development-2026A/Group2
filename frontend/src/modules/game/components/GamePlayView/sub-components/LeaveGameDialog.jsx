import styles from "./LeaveGameDialog.module.css";

export default function LeaveGameDialog({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Leave game confirmation"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <p className={styles.kicker}>Game in progress</p>
          <h2 className={styles.title}>Leave Game?</h2>
          <p className={styles.description}>
            You have a game in progress. Leaving will abort the current game and
            no result will be recorded.
          </p>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onClose}
          >
            Stay
          </button>
          <button
            type="button"
            className={styles.dangerButton}
            onClick={onConfirm}
          >
            Leave Game
          </button>
        </div>
      </div>
    </div>
  );
}
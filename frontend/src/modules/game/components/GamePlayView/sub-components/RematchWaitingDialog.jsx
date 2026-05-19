import styles from "./WinnerDialog.module.css";

export default function RematchWaitingDialog({ open, message, onLeaveRoom }) {
  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Waiting for rematch response"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <p className={styles.kicker}>Rematch pending</p>
          <h2 className={styles.title}>Waiting for opponent</h2>
          <p className={styles.description}>
            {message || "Waiting for your opponent to respond."}
          </p>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onLeaveRoom}
          >
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
}

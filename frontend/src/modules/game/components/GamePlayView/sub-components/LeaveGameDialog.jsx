import styles from "./LeaveGameDialog.module.css";

export default function LeaveGameDialog({
  open,
  onClose,
  onConfirm,
  kicker = "Game in progress",
  title = "Leave Game?",
  description = "You have a game in progress. Leaving will abort the current game and no result will be recorded.",
  cancelText = "Stay",
  confirmText = "Leave Game",
  confirmTone = "danger",
}) {
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
          <p className={styles.kicker}>{kicker}</p>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={confirmTone === "primary" ? styles.primaryButton : styles.dangerButton}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
import styles from "./WinnerDialog.module.css";

function getTitle(reason) {
  if (reason === "opponent_disconnected") return "Opponent disconnected";
  if (reason === "opponent_left") return "Opponent left the match";
  if (reason === "timeout") return "Rematch expired";
  if (reason === "you_left") return "Room closed";
  return "Room closed";
}

export default function OnlineRoomClosedDialog({ open, reason, message, onReturn }) {
  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Online room closed"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <p className={styles.kicker}>Online room closed</p>
          <h2 className={styles.title}>{getTitle(reason)}</h2>
          <p className={styles.description}>
            {message || "This match has ended and the room has been closed."}
          </p>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={onReturn}
          >
            Return to Online Arena
          </button>
        </div>
      </div>
    </div>
  );
}

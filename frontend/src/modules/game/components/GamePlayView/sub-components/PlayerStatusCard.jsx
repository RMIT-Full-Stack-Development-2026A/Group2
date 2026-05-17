import styles from "./PlayerStatusCard.module.css";

export default function PlayerStatusCard({
  name,
  marker,
  isActive,
  turnText,
  avatarContent,
  showTurnText = false,
  compact = false
}) {
  return (
    <div className={compact ? styles.columnCompact : styles.column}>
      <div className={`${styles.card} ${isActive ? styles.active : ""}`}>
        <p className={styles.name}>{name}</p>
        <div className={styles.marker}>{marker}</div>
        {isActive || showTurnText ? <p className={styles.turnText}>{turnText}</p> : null}
      </div>

      <div className={styles.avatar}>{avatarContent}</div>
    </div>
  );
}
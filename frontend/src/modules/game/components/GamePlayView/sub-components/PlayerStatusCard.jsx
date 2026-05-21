import styles from "./PlayerStatusCard.module.css";

export default function PlayerStatusCard({
  name,
  marker,
  isActive,
  turnText,
  avatarContent,
  avatarSrc,
  avatarClassName = "",
  avatarVariant = "",
  showTurnText = false,
  compact = false
}) {
  const avatarStyleClass = avatarClassName || styles[avatarVariant] || "";

  return (
    <div className={compact ? styles.columnCompact : styles.column}>
      <div className={`${styles.card} ${isActive ? styles.active : ""}`}>
        <p className={styles.name}>{name}</p>
        <div className={styles.marker}>{marker}</div>
        {isActive || showTurnText ? <p className={styles.turnText}>{turnText}</p> : null}
      </div>

      <div className={`${styles.avatar} ${avatarStyleClass}`}>
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt=""
            className={styles.avatarImage}
            loading="eager"
            decoding="async"
          />
        ) : (
          avatarContent
        )}
      </div>
    </div>
  );
}

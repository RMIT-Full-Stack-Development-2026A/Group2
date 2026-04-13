import styles from "./SetupPlayerPreviewCard.module.css";

export default function SetupPlayerPreviewCard({
  name,
  marker,
  avatarContent,
  subtitle,
  className = "",
}) {
  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.avatar}>{avatarContent}</div>
      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <p className={styles.subtitle}>{subtitle || `Marker: ${marker}`}</p>
      </div>
    </div>
  );
}
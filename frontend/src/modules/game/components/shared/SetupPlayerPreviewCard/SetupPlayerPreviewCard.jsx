import styles from "./SetupPlayerPreviewCard.module.css";

export default function SetupPlayerPreviewCard({
  name,
  marker,
  avatarContent,
  avatarSrc,
  avatarClassName = "",
  subtitle,
  className = "",
}) {
  return (
    <div className={`${styles.card} ${className}`}>
      <div className={`${styles.avatar} ${avatarClassName}`}>
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
      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <p className={styles.subtitle}>{subtitle || `Marker: ${marker}`}</p>
      </div>
    </div>
  );
}

import styles from "./SetupFirstPlayerSelector.module.css";

export default function SetupFirstPlayerSelector({
  value,
  onChange,
  option1Value,
  option1Label,
  option2Value,
  option2Label,
}) {
  return (
    <div className={styles.section}>
      <label className={styles.label}>Who goes first?</label>
      <div className={styles.options}>
        <label className={styles.option}>
          <input
            type="radio"
            name="first-player"
            value={option1Value}
            checked={value === option1Value}
            onChange={(e) => onChange(e.target.value)}
          />
          <span>{option1Label}</span>
        </label>

        <label className={styles.option}>
          <input
            type="radio"
            name="first-player"
            value={option2Value}
            checked={value === option2Value}
            onChange={(e) => onChange(e.target.value)}
          />
          <span>{option2Label}</span>
        </label>
      </div>
    </div>
  );
}
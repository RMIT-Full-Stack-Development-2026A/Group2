import styles from "./SetupBoardSizeSelector.module.css";

export default function SetupBoardSizeSelector({
  value,
  onChange,
  compact = false,
  name = "board-size",
}) {
  return (
    <div className={styles.section}>
      <label className={styles.label}>Board Size</label>
      <div className={styles.options}>
        <label className={styles.option}>
          <input
            type="radio"
            name={name}
            value="10"
            checked={String(value) === "10"}
            onChange={(e) => onChange(Number(e.target.value))}
          />
          <span>{compact ? "10×10" : "10×10 (Standard)"}</span>
        </label>

        <label className={styles.option}>
          <input
            type="radio"
            name={name}
            value="15"
            checked={String(value) === "15"}
            onChange={(e) => onChange(Number(e.target.value))}
          />
          <span>{compact ? "15×15" : "15×15 (Advanced)"}</span>
        </label>
      </div>
    </div>
  );
}
import { AI_LEVELS } from "../../../utils/game.constants";
import styles from "./DifficultySelector.module.css";

export default function DifficultySelector({ value, onChange }) {
  return (
    <div className={styles.section}>
      <label className={styles.label}>AI Difficulty</label>
      <div className={styles.grid}>
        {AI_LEVELS.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => onChange(level.value)}
            className={`${styles.card} ${value === level.value ? styles.active : ""}`}
          >
            <p className={styles.title}>{level.label}</p>
            <p className={styles.desc}>{level.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
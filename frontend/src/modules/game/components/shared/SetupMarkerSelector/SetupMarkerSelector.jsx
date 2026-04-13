import { MARKERS } from "../../../utils/game.constants";
import styles from "./SetupMarkerSelector.module.css";

export default function SetupMarkerSelector({
  label,
  selectedMarker,
  onSelect,
  blockedMarker,
}) {
  const availableMarkers = blockedMarker
    ? MARKERS.filter((m) => m !== blockedMarker)
    : MARKERS;

  return (
    <div className={styles.section}>
      <label className={styles.label}>{label}</label>
      <div className={styles.list}>
        {availableMarkers.map((marker) => (
          <button
            key={marker}
            type="button"
            onClick={() => onSelect(marker)}
            className={`${styles.marker} ${
              selectedMarker === marker ? styles.active : ""
            }`}
          >
            {marker}
          </button>
        ))}
      </div>
    </div>
  );
}
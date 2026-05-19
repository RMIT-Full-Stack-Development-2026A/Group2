import styles from "./GameCell.module.css";

export default function GameCell({
  rowIndex,
  colIndex,
  value,
  isWinning,
  disabled,
  customBoardImage,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(rowIndex, colIndex)}
      disabled={disabled}
      className={`${styles.cell} ${isWinning ? styles.winning : ""} ${customBoardImage ? styles.customOverlay : ""} ${!value && !disabled ? styles.clickable : ""}`.trim()}
    >
      {value}
    </button>
  );
}

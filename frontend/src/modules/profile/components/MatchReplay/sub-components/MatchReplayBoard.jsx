import styles from "./MatchReplayBoard.module.css";
import {
  getColumnLabel,
  getRowLabel,
  BOARD_THEMES,
} from "../../../utils/replay.utils";

const BORDER_COLORS = {
  classic: "#e2e8f0",
  dark: "rgba(255, 255, 255, 0.1)",
  wood: "#d97706",
};

export default function MatchReplayBoard({
  board,
  size,
  boardStyle = "classic",
  marker1,
  marker2,
  winningCellsToHighlight = [],
  compact = false,
}) {
  if (!board) {
    return <div className={styles.boardShell}>Loading board...</div>;
  }

  const theme = BOARD_THEMES[boardStyle] || BOARD_THEMES.classic;
  const borderColor = BORDER_COLORS[boardStyle] || BORDER_COLORS.classic;
  const boardStyleClass =
    boardStyle === "dark"
      ? styles.darkBoard
      : boardStyle === "wood"
        ? styles.woodBoard
        : styles.classicBoard;

  const cellSize =
    size === 15
      ? "clamp(1.7rem, 2.1vw, 2.15rem)"
      : "clamp(2.2rem, 2.8vw, 2.85rem)";

  const winningCellKeys = new Set(
    winningCellsToHighlight.map(([row, col]) => `${row},${col}`),
  );

  const mapBoardValueToMarker = (value) => {
    if (value === "P1") return marker1;
    if (value === "P2") return marker2;
    return value;
  };

  const normalizedBoard = Array.from({ length: size }, (_, rowIndex) => {
    const row = board[rowIndex];
    if (Array.isArray(row) && row.length === size) {
      return row;
    }
    if (Array.isArray(row)) {
      return Array.from(
        { length: size },
        (_, colIndex) => row[colIndex] ?? null,
      );
    }
    return Array.from({ length: size }, () => null);
  });

  return (
    <div
      className={`${styles.boardShell} ${compact ? styles.boardShellCompact : ""} ${boardStyleClass}`}
      style={compact ? undefined : { "--cell-size": cellSize }}
    >
      <div
        className={styles.boardWithCoordinates}
        style={{ "--board-size": size }}
      >
        <div className={styles.cornerSpacer} aria-hidden="true" />

        <div
          className={styles.columnLabels}
          style={{ gridTemplateColumns: `repeat(${size}, var(--cell-size))` }}
          aria-hidden="true"
        >
          {Array.from({ length: size }, (_, colIndex) => (
            <span key={`col-${colIndex}`} className={styles.coordinateLabel}>
              {getColumnLabel(colIndex)}
            </span>
          ))}
        </div>

        <div className={styles.rowLabels} aria-hidden="true">
          {Array.from({ length: size }, (_, rowIndex) => (
            <span key={`row-${rowIndex}`} className={styles.coordinateLabel}>
              {getRowLabel(rowIndex)}
            </span>
          ))}
        </div>

        <div
          className={styles.boardGrid}
          style={{ gridTemplateColumns: `repeat(${size}, var(--cell-size))` }}
        >
          {normalizedBoard.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const hasStone =
                cell !== null && cell !== undefined && cell !== "";
              const winning =
                hasStone && winningCellKeys.has(`${rowIndex},${colIndex}`);
              const marker = mapBoardValueToMarker(cell);

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  type="button"
                  className={`${styles.cell} ${winning ? styles.winning : ""} ${
                    !hasStone ? styles.empty : ""
                  }`}
                  disabled
                  style={{
                    background: winning ? "#22c55e" : theme.cellBackground,
                    borderColor: winning ? "#22c55e" : borderColor,
                    color: winning ? "#fff" : theme.cellColor,
                  }}
                  title={`${getColumnLabel(colIndex)}${getRowLabel(rowIndex)}`}
                >
                  {marker}
                </button>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}

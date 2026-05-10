import styles from "./GameBoard.module.css";
import GameCell from "./GameCell";
import { isWinningCell } from "../../../utils/game.helpers";

function getColumnLabel(index) {
  let value = index + 1;
  let label = "";

  while (value > 0) {
    const remainder = (value - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    value = Math.floor((value - 1) / 26);
  }

  return label;
}

function mapBoardValueToMarker(value, marker1, marker2) {
  if (value === "P1") return marker1;
  if (value === "P2") return marker2;
  return value;
}

export default function GameBoard({
  board,
  size,
  boardStyle,
  customBoardImage,
  winner,
  aborted,
  isPaused,
  winningCells,
  marker1,
  marker2,
  onCellClick,
}) {
  const boardRows = Array.isArray(board) ? board : [];
  const normalizedBoard = Array.from({ length: size }, (_, rowIndex) => {
    const row = boardRows[rowIndex];

    if (Array.isArray(row) && row.length === size) {
      return row;
    }

    if (Array.isArray(row)) {
      return Array.from({ length: size }, (_, colIndex) => row[colIndex] ?? null);
    }

    return Array.from({ length: size }, () => null);
  });

  const boardStyleClass =
    boardStyle === "dark"
      ? styles.darkBoard
      : boardStyle === "wood"
        ? styles.woodBoard
        : styles.classicBoard;

  const cellSize =
    size === 15 ? "clamp(1.7rem, 2.1vw, 2.15rem)" : "clamp(2.2rem, 2.8vw, 2.85rem)";

  return (
    <div
      className={`${styles.boardShell} ${customBoardImage ? "" : boardStyleClass}`}
      style={{
        ...(customBoardImage
          ? {
              backgroundImage: `url(${customBoardImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}),
        "--cell-size": cellSize,
      }}
    >
      <div className={styles.boardWithCoordinates} style={{ "--board-size": size }}>
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
              {rowIndex + 1}
            </span>
          ))}
        </div>

        <div
          className={styles.boardGrid}
          style={{ gridTemplateColumns: `repeat(${size}, var(--cell-size))` }}
        >
          {normalizedBoard.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <GameCell
                key={`${rowIndex}-${colIndex}`}
                rowIndex={rowIndex}
                colIndex={colIndex}
                value={mapBoardValueToMarker(cell, marker1, marker2)}
                isWinning={isWinningCell(winningCells, rowIndex, colIndex)}
                disabled={!!winner || aborted || isPaused}
                customBoardImage={customBoardImage}
                onClick={onCellClick}
              />
            )),
          )}
        </div>
      </div>

      {isPaused ? (
        <div className={styles.pauseOverlay}>
          <p className={styles.pauseText}>Game Paused</p>
        </div>
      ) : null}
    </div>
  );
}
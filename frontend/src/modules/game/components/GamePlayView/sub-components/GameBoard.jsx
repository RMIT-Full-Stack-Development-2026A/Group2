import styles from "./GameBoard.module.css";
import GameCell from "./GameCell";
import { isWinningCell } from "../../../utils/game.helpers";

export default function GameBoard({
  board,
  size,
  boardStyle,
  customBoardImage,
  winner,
  aborted,
  isPaused,
  winningCells,
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

  return (
    <div
      className={`${styles.boardShell} ${customBoardImage ? "" : boardStyleClass}`}
      style={
        customBoardImage
          ? {
              backgroundImage: `url(${customBoardImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
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
              value={cell}
              isWinning={isWinningCell(winningCells, rowIndex, colIndex)}
              disabled={!!winner || aborted || isPaused}
              customBoardImage={customBoardImage}
              onClick={onCellClick}
            />
          )),
        )}
      </div>

      {isPaused ? (
        <div className={styles.pauseOverlay}>
          <p className={styles.pauseText}>Game Paused</p>
        </div>
      ) : null}
    </div>
  );
}
export function createEmptyBoard(size) {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

export function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function isWinningCell(winningCells, row, col) {
  return winningCells.some(([r, c]) => r === row && c === col);
}
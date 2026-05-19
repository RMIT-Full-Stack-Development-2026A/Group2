/**
 * Get alphabetic column label (A, B, C, ..., Z, AA, AB, ...)
 * @param {number} index - 0-based column index
 * @returns {string} Column label
 */
export function getColumnLabel(index) {
  let value = index + 1;
  let label = "";

  while (value > 0) {
    const remainder = (value - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    value = Math.floor((value - 1) / 26);
  }

  return label;
}

/**
 * Get row label (1-based numbering)
 * @param {number} index - 0-based row index
 * @returns {string} Row label
 */
export function getRowLabel(index) {
  return String(index + 1);
}

/**
 * Convert move data to algebraic notation (e.g., "A1", "B5")
 * @param {number} rowIndex - 0-based row
 * @param {number} colIndex - 0-based column
 * @returns {string} Algebraic notation
 */
export function toAlgebraic(rowIndex, colIndex) {
  return `${getColumnLabel(colIndex)}${getRowLabel(rowIndex)}`;
}

export function normalizeWinningLine(winningLine) {
  if (!Array.isArray(winningLine)) return [];

  return winningLine
    .map((entry) => {
      if (Array.isArray(entry) && entry.length >= 2) {
        return [Number(entry[0]), Number(entry[1])];
      }
      if (entry && typeof entry === "object") {
        const row = entry.rowIndex ?? entry.row;
        const col = entry.colIndex ?? entry.col;
        if (Number.isFinite(row) && Number.isFinite(col)) {
          return [Number(row), Number(col)];
        }
      }
      return null;
    })
    .filter(
      (coords) =>
        coords &&
        Number.isFinite(coords[0]) &&
        Number.isFinite(coords[1]),
    );
}

export function isReplayWinningCell(winningLine, row, col) {
  return normalizeWinningLine(winningLine).some(
    ([r, c]) => r === row && c === col,
  );
}

export function isWinningLineCompleteOnBoard(board, winningLine) {
  const cells = normalizeWinningLine(winningLine);
  if (!board || cells.length === 0) return false;

  return cells.every(([row, col]) => {
    const value = board[row]?.[col];
    return value !== null && value !== undefined && value !== "";
  });
}

export function shouldShowReplayWinningLine({
  board,
  winningLine,
  currentMoveIndex,
  totalMoves,
  isAborted,
}) {
  if (isAborted || totalMoves <= 0) return false;
  if (currentMoveIndex !== totalMoves - 1) return false;
  return isWinningLineCompleteOnBoard(board, winningLine);
}

export function getReplayWinningCellsToHighlight({
  board,
  winningLine,
  currentMoveIndex,
  totalMoves,
  isAborted,
}) {
  if (
    !shouldShowReplayWinningLine({
      board,
      winningLine,
      currentMoveIndex,
      totalMoves,
      isAborted,
    })
  ) {
    return [];
  }

  return normalizeWinningLine(winningLine).filter(([row, col]) => {
    const value = board?.[row]?.[col];
    return value !== null && value !== undefined && value !== "";
  });
}

/**
 * Format time duration
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted time
 */
export function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Get marker display for participant
 * @param {string} marker - Player marker (X, O, △, etc.)
 * @returns {string} Display marker
 */
export function getDisplayMarker(value) {
  if (value === "P1" || value === "P2") return null;
  return value;
}

/**
 * Get participant display name with marker
 * @param {object} participant - Participant data
 * @returns {string} Display name with marker
 */
export function getParticipantDisplay(participant) {
  if (!participant) return "Unknown";
  return `${participant.displayName} (${participant.marker})`;
}

export const BOARD_THEMES = {
  classic: {
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    cellBackground: "#f8fafc",
    cellBorder: "1px solid #e2e8f0",
    cellColor: "#1e293b",
  },
  dark: {
    background: "linear-gradient(180deg, #1e1e2e 0%, #0f172a 100%)",
    cellBackground: "#2a2a3e",
    cellBorder: "1px solid rgba(255,255,255,0.1)",
    cellColor: "#a5b4fc",
  },
  wood: {
    background: "linear-gradient(180deg, #f6ead4 0%, #ead7b3 100%)",
    cellBackground: "#fffbeb",
    cellBorder: "1px solid #d97706",
    cellColor: "#78350f",
  },
};

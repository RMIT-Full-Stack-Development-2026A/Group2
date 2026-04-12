function createEmptyBoard(size) {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

function buildBoard(size, moves, participantMap) {
  const board = createEmptyBoard(size);

  for (const move of moves) {
    const participant = participantMap[String(move.participantID)];
    if (!participant) continue;

    board[move.rowIndex][move.colIndex] =
      participant.turnOrder === 1 ? "P1" : "P2";
  }

  return board;
}

function getEmptyCells(board) {
  const cells = [];
  for (let r = 0; r < board.length; r += 1) {
    for (let c = 0; c < board[r].length; c += 1) {
      if (board[r][c] === null) {
        cells.push([r, c]);
      }
    }
  }
  return cells;
}

function getAdjacentEmptyCells(board, row, col) {
  const cells = [];

  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if (dr === 0 && dc === 0) continue;

      const r = row + dr;
      const c = col + dc;

      if (
        r >= 0 &&
        r < board.length &&
        c >= 0 &&
        c < board[0].length &&
        board[r][c] === null
      ) {
        cells.push([r, c]);
      }
    }
  }

  return cells;
}

module.exports = {
  createEmptyBoard,
  buildBoard,
  getEmptyCells,
  getAdjacentEmptyCells,
};
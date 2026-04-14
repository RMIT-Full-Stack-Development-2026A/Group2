function createEmptyBoard(size) {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

function buildBoard(size, moves, participantMap) {
  const board = createEmptyBoard(size);

  for (const move of moves) {
    const participant = participantMap[String(move.participantID)];
    if (!participant) continue;
    board[move.rowIndex][move.colIndex] = participant.marker;
  }

  return board;
}

module.exports = {
  createEmptyBoard,
  buildBoard,
};
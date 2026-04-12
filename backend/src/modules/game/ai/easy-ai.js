const { getAdjacentEmptyCells, getEmptyCells } = require("../utils/board.utils");

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function chooseEasyAiMove(board, lastHumanMove) {
  if (lastHumanMove) {
    const adjacent = getAdjacentEmptyCells(
      board,
      lastHumanMove.rowIndex,
      lastHumanMove.colIndex,
    );

    if (adjacent.length) {
      const [rowIndex, colIndex] = pickRandom(adjacent);
      return { rowIndex, colIndex };
    }
  }

  const emptyCells = getEmptyCells(board);
  if (!emptyCells.length) return null;

  const [rowIndex, colIndex] = pickRandom(emptyCells);
  return { rowIndex, colIndex };
}

module.exports = {
  chooseEasyAiMove,
};
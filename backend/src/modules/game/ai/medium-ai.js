const { getEmptyCells } = require("../utils/board.utils");
const { getWinningLine } = require("../utils/winChecker");

function chooseMediumAiMove(board, humanToken) {
  const emptyCells = getEmptyCells(board);

  for (const [rowIndex, colIndex] of emptyCells) {
    const copy = board.map((row) => [...row]);
    copy[rowIndex][colIndex] = humanToken;

    const winningLine = getWinningLine(copy, rowIndex, colIndex, humanToken);
    if (winningLine) {
      return { rowIndex, colIndex };
    }
  }

  return null;
}

module.exports = {
  chooseMediumAiMove,
};
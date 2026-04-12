const { getEmptyCells } = require("../utils/board.utils");
const { getWinningLine } = require("../utils/winChecker");
const { chooseMediumAiMove } = require("./medium-ai");

function chooseHardAiMove(board, aiToken, humanToken) {
  const emptyCells = getEmptyCells(board);

  for (const [rowIndex, colIndex] of emptyCells) {
    const copy = board.map((row) => [...row]);
    copy[rowIndex][colIndex] = aiToken;

    const winningLine = getWinningLine(copy, rowIndex, colIndex, aiToken);
    if (winningLine) {
      return { rowIndex, colIndex };
    }
  }

  return chooseMediumAiMove(board, humanToken);
}

module.exports = {
  chooseHardAiMove,
};
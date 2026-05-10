const { getAdjacentEmptyCells, getEmptyCells } = require("../utils/board.utils");
const { getWinningLine } = require("../utils/winChecker");

function isInside(board, rowIndex, colIndex) {
  return (
    rowIndex >= 0 &&
    rowIndex < board.length &&
    colIndex >= 0 &&
    colIndex < board[0].length
  );
}

function getCell(board, rowIndex, colIndex) {
  if (!isInside(board, rowIndex, colIndex)) return null;
  return board[rowIndex][colIndex];
}

function countDirection(board, rowIndex, colIndex, marker, dr, dc) {
  let count = 0;
  let r = rowIndex + dr;
  let c = colIndex + dc;

  while (isInside(board, r, c) && board[r][c] === marker) {
    count += 1;
    r += dr;
    c += dc;
  }

  return { count, edgeRow: r, edgeCol: c };
}

function hasOpenEndedFourFromMove(board, rowIndex, colIndex, marker) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (const [dr, dc] of directions) {
    const forward = countDirection(board, rowIndex, colIndex, marker, dr, dc);
    const backward = countDirection(board, rowIndex, colIndex, marker, -dr, -dc);
    const runLength = 1 + forward.count + backward.count;

    if (runLength !== 4) continue;

    const forwardEnd = getCell(board, forward.edgeRow, forward.edgeCol);
    const backwardEnd = getCell(board, backward.edgeRow, backward.edgeCol);

    if (forwardEnd === null && backwardEnd === null) {
      return true;
    }
  }

  return false;
}

function hasForkOpenThreeFromMove(board, rowIndex, colIndex, marker) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  let openThreeLines = 0;

  for (const [dr, dc] of directions) {
    const forward = countDirection(board, rowIndex, colIndex, marker, dr, dc);
    const backward = countDirection(board, rowIndex, colIndex, marker, -dr, -dc);
    const runLength = 1 + forward.count + backward.count;

    if (runLength !== 3) continue;

    const forwardEnd = getCell(board, forward.edgeRow, forward.edgeCol);
    const backwardEnd = getCell(board, backward.edgeRow, backward.edgeCol);

    if (forwardEnd === null && backwardEnd === null) {
      openThreeLines += 1;
    }
  }

  return openThreeLines >= 2;
}

function compareMoves(a, b, boardSize) {
  const center = (boardSize - 1) / 2;
  const distanceA = Math.abs(a.rowIndex - center) + Math.abs(a.colIndex - center);
  const distanceB = Math.abs(b.rowIndex - center) + Math.abs(b.colIndex - center);

  if (distanceA !== distanceB) return distanceA - distanceB;
  if (a.rowIndex !== b.rowIndex) return a.rowIndex - b.rowIndex;
  return a.colIndex - b.colIndex;
}

function chooseDeterministicFallbackMove(board, lastHumanMove) {
  let candidates = [];

  if (lastHumanMove) {
    candidates = getAdjacentEmptyCells(board, lastHumanMove.rowIndex, lastHumanMove.colIndex)
      .map(([rowIndex, colIndex]) => ({ rowIndex, colIndex }));
  }

  if (!candidates.length) {
    candidates = getEmptyCells(board).map(([rowIndex, colIndex]) => ({ rowIndex, colIndex }));
  }

  if (!candidates.length) return null;
  candidates.sort((a, b) => compareMoves(a, b, board.length));
  return candidates[0];
}

function chooseMediumAiMove(board, humanToken, lastHumanMove = null) {
  const emptyCells = getEmptyCells(board);
  let bestThreat = null;

  for (const [rowIndex, colIndex] of emptyCells) {
    const copy = board.map((row) => [...row]);
    copy[rowIndex][colIndex] = humanToken;

    let threatLevel = 0;

    if (getWinningLine(copy, rowIndex, colIndex, humanToken)) {
      threatLevel = 3;
    } else if (hasOpenEndedFourFromMove(copy, rowIndex, colIndex, humanToken)) {
      threatLevel = 2;
    } else if (hasForkOpenThreeFromMove(copy, rowIndex, colIndex, humanToken)) {
      threatLevel = 1;
    }

    if (!threatLevel) continue;

    const move = { rowIndex, colIndex, threatLevel };
    if (!bestThreat) {
      bestThreat = move;
      continue;
    }

    if (move.threatLevel > bestThreat.threatLevel) {
      bestThreat = move;
      continue;
    }

    if (
      move.threatLevel === bestThreat.threatLevel &&
      compareMoves(move, bestThreat, board.length) < 0
    ) {
      bestThreat = move;
    }
  }

  if (bestThreat) {
    return { rowIndex: bestThreat.rowIndex, colIndex: bestThreat.colIndex };
  }

  return chooseDeterministicFallbackMove(board, lastHumanMove);
}

module.exports = {
  chooseMediumAiMove,
  chooseDeterministicFallbackMove,
};
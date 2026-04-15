import { checkWinner } from "./checkWinner";

function isInside(board, rowIndex, colIndex) {
  return (
    rowIndex >= 0 &&
    rowIndex < board.length &&
    colIndex >= 0 &&
    colIndex < board[0].length
  );
}

function getEmptyCells(board) {
  const cells = [];
  for (let rowIndex = 0; rowIndex < board.length; rowIndex += 1) {
    for (let colIndex = 0; colIndex < board[rowIndex].length; colIndex += 1) {
      if (!board[rowIndex][colIndex]) {
        cells.push({ rowIndex, colIndex });
      }
    }
  }
  return cells;
}

function getAdjacentEmptyCells(board, rowIndex, colIndex) {
  const cells = [];
  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if (dr === 0 && dc === 0) continue;
      const r = rowIndex + dr;
      const c = colIndex + dc;
      if (isInside(board, r, c) && !board[r][c]) {
        cells.push({ rowIndex: r, colIndex: c });
      }
    }
  }
  return cells;
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
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

function getCell(board, rowIndex, colIndex) {
  if (!isInside(board, rowIndex, colIndex)) return null;
  return board[rowIndex][colIndex];
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
    if (forwardEnd === null && backwardEnd === null) return true;
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
    candidates = getAdjacentEmptyCells(board, lastHumanMove.rowIndex, lastHumanMove.colIndex);
  }
  if (!candidates.length) {
    candidates = getEmptyCells(board);
  }
  if (!candidates.length) return null;
  candidates.sort((a, b) => compareMoves(a, b, board.length));
  return candidates[0];
}

function chooseEasyAiMove(board, lastHumanMove) {
  if (lastHumanMove) {
    const adjacent = getAdjacentEmptyCells(board, lastHumanMove.rowIndex, lastHumanMove.colIndex);
    if (adjacent.length) return pickRandom(adjacent);
  }
  const emptyCells = getEmptyCells(board);
  if (!emptyCells.length) return null;
  return pickRandom(emptyCells);
}

function chooseMediumAiMove(board, humanMarker, lastHumanMove) {
  const emptyCells = getEmptyCells(board);
  let bestThreat = null;

  for (const { rowIndex, colIndex } of emptyCells) {
    const copy = board.map((row) => [...row]);
    copy[rowIndex][colIndex] = humanMarker;

    let threatLevel = 0;
    if (checkWinner(copy, rowIndex, colIndex)) {
      threatLevel = 3;
    } else if (hasOpenEndedFourFromMove(copy, rowIndex, colIndex, humanMarker)) {
      threatLevel = 2;
    } else if (hasForkOpenThreeFromMove(copy, rowIndex, colIndex, humanMarker)) {
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

function chooseHardAiMove(board, aiMarker, humanMarker, lastHumanMove) {
  const emptyCells = getEmptyCells(board);
  for (const { rowIndex, colIndex } of emptyCells) {
    const copy = board.map((row) => [...row]);
    copy[rowIndex][colIndex] = aiMarker;
    if (checkWinner(copy, rowIndex, colIndex)) {
      return { rowIndex, colIndex };
    }
  }

  return chooseMediumAiMove(board, humanMarker, lastHumanMove);
}

export function selectAiMove({
  board,
  difficulty,
  aiMarker,
  humanMarker,
  lastHumanMove,
}) {
  if (difficulty === "easy") {
    return chooseEasyAiMove(board, lastHumanMove);
  }

  if (difficulty === "medium") {
    return chooseMediumAiMove(board, humanMarker, lastHumanMove);
  }

  return chooseHardAiMove(board, aiMarker, humanMarker, lastHumanMove);
}

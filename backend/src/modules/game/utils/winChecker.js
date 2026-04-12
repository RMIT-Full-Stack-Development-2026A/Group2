function collectDirection(board, row, col, marker, dr, dc) {
  const cells = [[row, col]];

  for (let i = 1; i < 5; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) break;
    if (board[r][c] !== marker) break;
    cells.push([r, c]);
  }

  for (let i = 1; i < 5; i++) {
    const r = row - dr * i;
    const c = col - dc * i;
    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) break;
    if (board[r][c] !== marker) break;
    cells.push([r, c]);
  }

  return cells;
}

function getWinningLine(board, row, col, marker) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (const [dr, dc] of directions) {
    const cells = collectDirection(board, row, col, marker, dr, dc);
    if (cells.length >= 5) {
      return cells.slice(0, 5);
    }
  }

  return null;
}

module.exports = { getWinningLine };
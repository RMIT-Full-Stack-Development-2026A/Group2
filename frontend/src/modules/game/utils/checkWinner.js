export function checkWinner(board, row, col) {
  const marker = board[row][col];
  if (!marker) return null;

  const size = board.length;
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (const [dr, dc] of directions) {
    const cells = [[row, col]];

    for (let d = 1; d < 5; d += 1) {
      const r = row + dr * d;
      const c = col + dc * d;
      if (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === marker) {
        cells.push([r, c]);
      } else {
        break;
      }
    }

    for (let d = 1; d < 5; d += 1) {
      const r = row - dr * d;
      const c = col - dc * d;
      if (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === marker) {
        cells.push([r, c]);
      } else {
        break;
      }
    }

    if (cells.length >= 5) {
      return cells.slice(0, 5);
    }
  }

  return null;
}
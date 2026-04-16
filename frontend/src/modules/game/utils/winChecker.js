

export default function checkWin(newBoard, row, col, marker) {
  const directions = [[0,1], [1,0], [1,1], [1,-1]];

  for (const [dr, dc] of directions) {
    const cells = [[row,col]];

    // check forward
    for (let i = 1; i < 5; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= newBoard.length || c < 0 || c >= newBoard[0].length) break;
      if (newBoard[r][c] !== marker) break;
      cells.push([r,c])
    }

    // check backward
    for (let i = 1; i < 5; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r < 0 || r >= newBoard.length || c < 0 || c >= newBoard[0].length) break;
      if (newBoard[r][c] !== marker) break;
      cells.push([r,c]);
    }

    if (cells.length >= 5) return cells;
  }

  return null;
}
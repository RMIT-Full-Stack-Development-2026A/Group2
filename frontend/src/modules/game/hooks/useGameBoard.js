import { useState } from "react";

const createEmptyBoard = (size = 10) =>
  Array(size).fill(null).map(() => Array(size).fill(null));

export default function useGameBoard(player1Marker, player2Marker) {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameStatus, setGameStatus] = useState("ongoing");
  const [winner, setWinner] = useState(null);

  function handleCellClick(row, col) {
    if(gameStatus !== "ongoing") return;
    if(board[row][col] !== null) return;

    const newBoard = board.map(r => [...r]);
    const marker = currentPlayer === 1 ? player1Marker : player2Marker;
    newBoard[row][col] = marker;

    setBoard(newBoard);
    if (checkWin(newBoard, row, col, marker)) {
      setGameStatus("won");
      setWinner(currentPlayer);
    } 
    else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  }

  function resetGame() {
    setBoard(createEmptyBoard());
    setCurrentPlayer(1);
    setGameStatus("ongoing");
    setWinner(null);
  }

  function checkWin(newBoard, row, col, marker) {
  const directions = [[0,1], [1,0], [1,1], [1,-1]];

  for (const [dr, dc] of directions) {
    let count = 1; // count the clicked cell itself

    // check forward
    for (let i = 1; i < 5; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= newBoard.length || c < 0 || c >= newBoard[0].length) break;
      if (newBoard[r][c] !== marker) break;
      count++;
    }

    // check backward
    for (let i = 1; i < 5; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r < 0 || r >= newBoard.length || c < 0 || c >= newBoard[0].length) break;
      if (newBoard[r][c] !== marker) break;
      count++;
    }

    if (count >= 5) return true;
  }

  return false;
}

  return {
    board,
    currentPlayer,
    gameStatus,
    winner,
    handleCellClick,
    resetGame,
    checkWin
  }
}
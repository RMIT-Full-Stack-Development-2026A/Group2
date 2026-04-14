import { useState, useEffect } from "react";
import checkWin from "../utils/winChecker";
import { createEmptyBoard } from "../utils/board.utils";

export default function useGameBoard(player1Marker, player2Marker, boardSize, firstTurn = 1) {
  const [board, setBoard] = useState(createEmptyBoard(boardSize));
  const [currentPlayer, setCurrentPlayer] = useState(firstTurn);
  const [gameStatus, setGameStatus] = useState("ongoing");
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [timer, setTimer] = useState(0);
  const [aborted, setAborted] = useState(false); 
  
  useEffect(() => {
    if (gameStatus !== "ongoing" || aborted) return;
    
    const interval = setInterval(() => {
      setTimer(e => e + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStatus, aborted]);

  function handleCellClick(row, col) {
    if(gameStatus !== "ongoing") return;
    if(board[row][col] !== null) return;
    if(aborted) return;

    const newBoard = board.map(r => [...r]);
    const marker = currentPlayer === 1 ? player1Marker : player2Marker;
    newBoard[row][col] = marker;

    setBoard(newBoard);
    const winCells = checkWin(newBoard, row, col, marker)
    if (checkWin(newBoard, row, col, marker)) {
      setGameStatus("won");
      setWinner(currentPlayer);
      setWinningCells(winCells)
    } 
    else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  }

  function abortGame() {
    setAborted(true);
  }

  function resetGame() {
    setBoard(createEmptyBoard(boardSize));
    setCurrentPlayer(1);
    setGameStatus("ongoing");
    setWinner(null);
    setWinningCells([]);
    setTimer(0);
    setAborted(false);
  }

  return {
    board,
    currentPlayer,
    gameStatus,
    winner,
    winningCells,
    timer,
    aborted,
    handleCellClick,
    resetGame,
    abortGame
  }
}
import { useState, useEffect } from "react";
import checkWin from "../utils/winChecker";
import { createEmptyBoard } from "../utils/board.utils";

export default function useGameBoard(player1Marker, player2Marker, boardSize, firstTurn = 1) {
  const resolvedBoardSize = Number.parseInt(boardSize, 10) || 10;

  const [board, setBoard] = useState(() => createEmptyBoard(resolvedBoardSize));
  const [currentPlayer, setCurrentPlayer] = useState(firstTurn);
  const [gameStatus, setGameStatus] = useState("ongoing");
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [timer, setTimer] = useState(0);
  const [aborted, setAborted] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (gameStatus !== "ongoing" || aborted || paused) return;

    const interval = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStatus, aborted, paused]);

  function handleCellClick(rowIndex, colIndex) {
    if (gameStatus !== "ongoing") return;
    if (aborted) return;
    if (paused) return;
    if (board[rowIndex][colIndex] != null) return;

    const marker = currentPlayer === 1 ? player1Marker : player2Marker;
    const newBoard = board.map((row) => [...row]);
    newBoard[rowIndex][colIndex] = marker;

    const winCells = checkWin(newBoard, rowIndex, colIndex, marker);

    setBoard(newBoard);

    if (winCells) {
      setGameStatus("won");
      setWinner(currentPlayer);
      setWinningCells(winCells);
    } else {
      setCurrentPlayer((p) => (p === 1 ? 2 : 1));
    }
  }

  function abortGame() {
    setAborted(true);
  }

  function togglePause() {
    if (gameStatus !== "ongoing" || aborted) return;
    setPaused((p) => !p);
  }

  function resetGame() {
    setBoard(createEmptyBoard(resolvedBoardSize));
    setCurrentPlayer(firstTurn);
    setGameStatus("ongoing");
    setWinner(null);
    setWinningCells([]);
    setTimer(0);
    setAborted(false);
    setPaused(false);
  }

  return {
    board,
    currentPlayer,
    gameStatus,
    winner,
    winningCells,
    timer,
    aborted,
    paused,
    handleCellClick,
    resetGame,
    abortGame,
    togglePause,
  };
}

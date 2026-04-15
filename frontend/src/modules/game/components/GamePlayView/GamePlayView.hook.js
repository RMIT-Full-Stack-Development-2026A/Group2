import { useCallback, useEffect, useRef, useState } from "react";
import { createEmptyBoard } from "../../utils/game.helpers";
import { checkWinner } from "../../utils/checkWinner";
import { selectAiMove } from "../../utils/aiMove";

export default function useGamePlayView(config) {
  const size = config?.boardSize || 10;
  const firstPlayer = config?.firstPlayer;

  const [board, setBoard] = useState(() => createEmptyBoard(size));
  const [currentPlayer, setCurrentPlayer] = useState(
    firstPlayer === "player2" ? 2 : 1,
  );
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [aborted, setAborted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [aiThinking, setAiThinking] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const startTime = useRef(new Date().toISOString());
  const lastHumanMoveRef = useRef(null);

  useEffect(() => {
    if (winner || aborted || isPaused) return;
    const interval = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [winner, aborted, isPaused]);

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard(size));
    setWinner(null);
    setWinningCells([]);
    setAborted(false);
    setElapsed(0);
    setAiThinking(false);
    setShowWinnerModal(false);
    setIsPaused(false);
    setCurrentPlayer(firstPlayer === "player2" ? 2 : 1);
    lastHumanMoveRef.current = null;
  }, [firstPlayer, size]);

  const makeAIMove = useCallback(
    (currentBoard) => {
      setAiThinking(true);

      setTimeout(() => {
        const aiMove = selectAiMove({
          board: currentBoard,
          difficulty: config.aiDifficulty || "easy",
          aiMarker: config.marker2,
          humanMarker: config.marker1,
          lastHumanMove: lastHumanMoveRef.current,
        });

        if (!aiMove) {
          setAiThinking(false);
          return;
        }

        const { rowIndex: r, colIndex: c } = aiMove;
        const nextBoard = currentBoard.map((row) => [...row]);
        nextBoard[r][c] = config.marker2;
        setBoard(nextBoard);

        const win = checkWinner(nextBoard, r, c);
        if (win) {
          setWinningCells(win);
          setWinner(config.player2);
          setShowWinnerModal(true);
        } else {
          setCurrentPlayer(1);
        }

        setAiThinking(false);
      }, 600);
    },
    [config.marker2, config.player2, size],
  );

  const handleCellClick = useCallback(
    (row, col) => {
      if (winner || aborted || board[row][col] || aiThinking || isPaused) return;
      if (config.gameType === "ai" && currentPlayer === 2) return;

      const marker = currentPlayer === 1 ? config.marker1 : config.marker2;
      const nextBoard = board.map((r) => [...r]);
      nextBoard[row][col] = marker;
      setBoard(nextBoard);

      if (config.gameType === "ai" && currentPlayer === 1) {
        lastHumanMoveRef.current = { rowIndex: row, colIndex: col };
      }

      const win = checkWinner(nextBoard, row, col);
      if (win) {
        setWinningCells(win);
        setWinner(currentPlayer === 1 ? config.player1 : config.player2);
        setShowWinnerModal(true);
      } else {
        const next = currentPlayer === 1 ? 2 : 1;
        setCurrentPlayer(next);
        if (config.gameType === "ai" && next === 2) {
          makeAIMove(nextBoard);
        }
      }
    },
    [winner, aborted, board, aiThinking, isPaused, config, currentPlayer, makeAIMove],
  );

  return {
    size,
    board,
    currentPlayer,
    winner,
    winningCells,
    aborted,
    elapsed,
    aiThinking,
    showWinnerModal,
    isPaused,
    startTime,
    setAborted,
    setIsPaused,
    setShowWinnerModal,
    resetGame,
    handleCellClick,
  };
}
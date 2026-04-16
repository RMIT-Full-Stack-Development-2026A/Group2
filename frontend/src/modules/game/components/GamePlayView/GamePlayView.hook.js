import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createEmptyBoard } from "../../utils/game.helpers";
import {
  abortGameSession,
  getGameSession,
  makeGameMove,
} from "../../api/game.api";
import { normalizeBackendGameState } from "./GamePlayView.service";

export default function useGamePlayView(config) {
  const AI_THINKING_DELAY_MS = 600;
  const size = config?.boardSize || 10;
  const firstPlayer = config?.firstPlayer;
  const isBackendManaged =
    !!config?.sessionId &&
    (config?.gameType === "ai" || config?.gameType === "local");

  const initialBackendState = useMemo(() => {
    if (!isBackendManaged || !config?.backendSession) {
      return null;
    }

    return normalizeBackendGameState(config.backendSession, config);
  }, [config, isBackendManaged]);

  const [board, setBoard] = useState(() =>
    initialBackendState?.board || createEmptyBoard(size),
  );
  const [currentPlayer, setCurrentPlayer] = useState(() =>
    initialBackendState?.currentPlayer || (firstPlayer === "player2" ? 2 : 1),
  );
  const [winner, setWinner] = useState(() => initialBackendState?.winner || null);
  const [winningCells, setWinningCells] = useState(
    () => initialBackendState?.winningCells || [],
  );
  const [aborted, setAborted] = useState(() => initialBackendState?.aborted || false);
  const [elapsed, setElapsed] = useState(0);
  const [aiThinking, setAiThinking] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(
    () => initialBackendState?.showWinnerModal || false,
  );
  const [isPaused, setIsPaused] = useState(false);
  const [apiError, setApiError] = useState("");
  const startTime = useRef(
    initialBackendState?.startedAt || new Date().toISOString(),
  );

  useEffect(() => {
    if (winner || aborted || isPaused) return;
    const interval = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [winner, aborted, isPaused]);

  const applyBackendState = useCallback(
    (dto) => {
      const nextState = normalizeBackendGameState(dto, config);
      setBoard(nextState.board);
      setCurrentPlayer(nextState.currentPlayer);
      setWinner(nextState.winner);
      setWinningCells(nextState.winningCells);
      setAborted(nextState.aborted);
      setShowWinnerModal(nextState.showWinnerModal);

      if (nextState.startedAt) {
        startTime.current = nextState.startedAt;
      }
    },
    [config],
  );

  useEffect(() => {
    if (!isBackendManaged || !config?.sessionId) return;

    let active = true;

    async function loadSession() {
      try {
        setApiError("");
        const dto = await getGameSession(config.sessionId);
        if (!active) return;
        applyBackendState(dto);
      } catch (error) {
        if (!active) return;
        setApiError(
          error?.data?.message ||
            error?.message ||
            "Could not load game session.",
        );
      }
    }

    loadSession();

    return () => {
      active = false;
    };
  }, [applyBackendState, config?.sessionId, isBackendManaged]);

  const resetGame = useCallback(() => {
    if (isBackendManaged) {
      setShowWinnerModal(false);
      return;
    }

    setBoard(createEmptyBoard(size));
    setWinner(null);
    setWinningCells([]);
    setAborted(false);
    setElapsed(0);
    setAiThinking(false);
    setShowWinnerModal(false);
    setIsPaused(false);
    setApiError("");
    setCurrentPlayer(firstPlayer === "player2" ? 2 : 1);
  }, [firstPlayer, isBackendManaged, size]);

  const handleBackendCellClick = useCallback(
    async (row, col) => {
      if (winner || aborted || aiThinking || isPaused) return;
      if (board[row]?.[col]) return;

      if (config.gameType === "ai" && currentPlayer !== 1) {
        return;
      }

      const previousBoard = board;
      const previousPlayer = currentPlayer;

      try {
        setApiError("");
        const marker = currentPlayer === 1 ? config.marker1 : config.marker2;
        const optimisticBoard = board.map((r) => [...r]);
        optimisticBoard[row][col] = marker;

        // Show the player's move immediately while waiting for backend processing.
        setBoard(optimisticBoard);
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);

        const shouldShowAiThinking =
          config.gameType === "ai" && previousPlayer === 1;
        setAiThinking(shouldShowAiThinking);

        const movePromise = makeGameMove(config.sessionId, {
          rowIndex: row,
          colIndex: col,
        });

        // Keep the indicator visible long enough for users to perceive the AI turn.
        const delayPromise = shouldShowAiThinking
          ? new Promise((resolve) => setTimeout(resolve, AI_THINKING_DELAY_MS))
          : Promise.resolve();

        const [dto] = await Promise.all([movePromise, delayPromise]);

        applyBackendState(dto);
      } catch (error) {
        setBoard(previousBoard);
        setCurrentPlayer(previousPlayer);
        setApiError(
          error?.data?.message ||
            error?.message ||
            "Could not submit move.",
        );
      } finally {
        setAiThinking(false);
      }
    },
    [
      aborted,
      aiThinking,
      applyBackendState,
      board,
      config.gameType,
      config.marker1,
      config.marker2,
      config.sessionId,
      currentPlayer,
      isPaused,
      winner,
    ],
  );

  const handleCellClick = useCallback(
    (row, col) => {
      if (isBackendManaged) {
        handleBackendCellClick(row, col);
      }
    },
    [handleBackendCellClick, isBackendManaged],
  );

  const abortCurrentGame = useCallback(async () => {
    if (!isBackendManaged || !config?.sessionId) {
      setAborted(true);
      return;
    }

    try {
      setApiError("");
      const dto = await abortGameSession(config.sessionId);
      applyBackendState(dto);
    } catch (error) {
      setApiError(
        error?.data?.message ||
          error?.message ||
          "Could not abort the game.",
      );
    }
  }, [applyBackendState, config?.sessionId, isBackendManaged]);

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
    apiError,
    setAborted,
    setIsPaused,
    setShowWinnerModal,
    resetGame,
    handleCellClick,
    abortCurrentGame,
  };
}
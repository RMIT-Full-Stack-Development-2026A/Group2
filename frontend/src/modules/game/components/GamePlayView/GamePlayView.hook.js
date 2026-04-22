import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createEmptyBoard } from "../../utils/game.helpers";
import {
  abortGameSession,
  createLocalGamePayload,
  createLocalGameSession,
  createSinglePlayerGamePayload,
  createSinglePlayerGameSession,
  getGameSession,
  makeGameMove,
} from "../../api/game.api";
import { normalizeBackendGameState } from "./GamePlayView.service";

function getElapsedSecondsFromStart(startedAt) {
  if (!startedAt) return 0;

  const startedAtMs = new Date(startedAt).getTime();
  if (Number.isNaN(startedAtMs)) return 0;

  return Math.max(0, Math.floor((Date.now() - startedAtMs) / 1000));
}

export default function useGamePlayView(config) {
  const AI_THINKING_DELAY_MS = 600;
  const size = config?.boardSize || 10;
  const firstPlayer = config?.firstPlayer;
  const [sessionId, setSessionId] = useState(() => config?.sessionId || null);
  const isBackendManaged =
    !!sessionId &&
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
  const initialStartTime =
    initialBackendState?.startedAt || new Date().toISOString();
  const [elapsed, setElapsed] = useState(() =>
    getElapsedSecondsFromStart(initialStartTime),
  );
  const [aiThinking, setAiThinking] = useState(false);
  const [isMovePending, setIsMovePending] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(
    () => initialBackendState?.showWinnerModal || false,
  );
  const [isPaused, setIsPaused] = useState(false);
  const [apiError, setApiError] = useState("");
  const startTime = useRef(initialStartTime);

  useEffect(() => {
    if (winner || aborted || isPaused) return;

    const syncElapsedFromStart = () => {
      setElapsed(getElapsedSecondsFromStart(startTime.current));
    };

    syncElapsedFromStart();
    const interval = setInterval(syncElapsedFromStart, 1000);
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
        setElapsed(getElapsedSecondsFromStart(nextState.startedAt));
      }
    },
    [config],
  );

  useEffect(() => {
    if (!isBackendManaged || !sessionId) return;

    let active = true;

    async function loadSession() {
      try {
        setApiError("");
        const dto = await getGameSession(sessionId);
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
  }, [applyBackendState, isBackendManaged, sessionId]);

  const resetGame = useCallback(async () => {
    if (isBackendManaged) {
      try {
        setApiError("");
        setAiThinking(false);
        setIsMovePending(false);
        setIsPaused(false);
        setShowWinnerModal(false);
        setWinner(null);
        setWinningCells([]);
        setAborted(false);

        let nextState = null;

        if (config?.gameType === "local") {
          const payload = createLocalGamePayload({
            player2Name: config?.player2,
            firstPlayer: config?.firstPlayer,
            boardSize: config?.boardSize || size,
          });
          nextState = await createLocalGameSession(payload);
        } else if (config?.gameType === "ai") {
          const payload = createSinglePlayerGamePayload({
            firstPlayer: config?.firstPlayer === "player1" ? "player" : "cpu",
            boardSize: config?.boardSize || size,
            aiDifficulty: config?.aiDifficulty,
          });
          nextState = await createSinglePlayerGameSession(payload);
        }

        const nextSessionId = nextState?.session?.id;

        if (!nextSessionId) {
          throw new Error("Could not start a new game session.");
        }

        setSessionId(nextSessionId);
        setElapsed(0);
        applyBackendState(nextState);
      } catch (error) {
        setApiError(
          error?.data?.message ||
            error?.message ||
            "Could not restart the game.",
        );
      }
      return;
    }

    setBoard(createEmptyBoard(size));
    startTime.current = new Date().toISOString();
    setWinner(null);
    setWinningCells([]);
    setAborted(false);
    setElapsed(0);
    setAiThinking(false);
    setIsMovePending(false);
    setShowWinnerModal(false);
    setIsPaused(false);
    setApiError("");
    setCurrentPlayer(firstPlayer === "player2" ? 2 : 1);
  }, [applyBackendState, config?.aiDifficulty, config?.boardSize, config?.firstPlayer, config?.gameType, config?.player2, firstPlayer, isBackendManaged, size]);

  const handleBackendCellClick = useCallback(
    async (row, col) => {
      if (!sessionId) return;
      if (winner || aborted || aiThinking || isMovePending || isPaused) return;
      if (board[row]?.[col]) return;

      if (config.gameType === "ai" && currentPlayer !== 1) {
        return;
      }

      const previousBoard = board;
      const previousPlayer = currentPlayer;

      try {
        setApiError("");
        setIsMovePending(true);
        const marker = currentPlayer === 1 ? config.marker1 : config.marker2;
        const optimisticBoard = board.map((r) => [...r]);
        optimisticBoard[row][col] = marker;

        // Show the player's move immediately while waiting for backend processing.
        setBoard(optimisticBoard);
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);

        const shouldShowAiThinking =
          config.gameType === "ai" && previousPlayer === 1;
        setAiThinking(shouldShowAiThinking);

        const movePromise = makeGameMove(sessionId, {
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
        setIsMovePending(false);
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
      currentPlayer,
      isMovePending,
      isPaused,
      sessionId,
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
    if (!isBackendManaged || !sessionId) {
      setAborted(true);
      return;
    }

    try {
      setApiError("");
      const dto = await abortGameSession(sessionId);
      applyBackendState(dto);
    } catch (error) {
      setApiError(
        error?.data?.message ||
          error?.message ||
          "Could not abort the game.",
      );
    }
  }, [applyBackendState, isBackendManaged, sessionId]);

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
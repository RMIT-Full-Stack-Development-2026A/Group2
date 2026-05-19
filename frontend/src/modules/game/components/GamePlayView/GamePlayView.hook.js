import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import socket from "@/lib/socket";

function getElapsedSecondsFromStart(startedAt) {
  if (!startedAt) return 0;

  const startedAtMs = new Date(startedAt).getTime();
  if (Number.isNaN(startedAtMs)) return 0;

  return Math.max(0, Math.floor((Date.now() - startedAtMs) / 1000));
}

export default function useGamePlayView(config) {
  const navigate = useNavigate();
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
  const [sessionResult, setSessionResult] = useState(
    () => initialBackendState?.sessionResult || "pending",
  );
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
  const [onlineRoomClosed, setOnlineRoomClosed] = useState(null);
  const [rematchWaiting, setRematchWaiting] = useState(false);
  const [incomingRematch, setIncomingRematch] = useState(null);
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
      setSessionId(nextState.sessionId);
      setCurrentPlayer(nextState.currentPlayer);
      setWinner(nextState.winner);
      setSessionResult(nextState.sessionResult);
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


  const isOnline = config?.gameType === "online";
  const myRole = config?.myRole || null;

  const currentPlayerRef = useRef(currentPlayer);

  useEffect(() => {
    currentPlayerRef.current = currentPlayer;
  }, [currentPlayer]);

  useEffect(() => {
    if (!isOnline) return;

    if (!socket.connected) socket.connect();

    let firstConnect = true;
    
    const handleConnect = () => {
      if(firstConnect) {
        firstConnect = false;
        return;
      }

      const isPlayer1 = config?.player1SocketId === socket.id;
      const isPlayer2 = config?.player2SocketId === socket.id;
      if (!isPlayer1 && !isPlayer2) {
        navigate("/online", { replace: true });
      }
    };

    socket.on("connect", handleConnect);

    const handleMoveResult = (dto) => {
      applyBackendState(dto);
    };

    const handleOnlineMatchTerminated = (payload = {}) => {
      setIsMovePending(false);
      setAiThinking(false);
      setIsPaused(true);
      setShowWinnerModal(false);
      setRematchWaiting(false);
      setIncomingRematch(null);
      setOnlineRoomClosed({
        reason: payload.reason || "opponent_left",
        message:
          payload.message ||
          "This match has ended and the room has been closed.",
      });
    };

    const handleRematchWaiting = (payload = {}) => {
      setShowWinnerModal(false);
      setIncomingRematch(null);
      setRematchWaiting(payload.message || "Waiting for your opponent to respond.");
    };

    const handleRematchRequested = (payload = {}) => {
      setShowWinnerModal(false);
      setRematchWaiting(false);
      setIncomingRematch({
        requestedByName: payload.requestedByName || "Your opponent",
        message: payload.message || "Your opponent wants to play again.",
      });
    };

    const handleRematchDeclined = (payload = {}) => {
      setShowWinnerModal(false);
      setRematchWaiting(false);
      setIncomingRematch(null);
      setIsPaused(true);
      setOnlineRoomClosed({
        reason: payload.reason || "opponent_declined",
        message:
          payload.message ||
          "Your opponent did not accept the rematch. This room has been closed.",
      });
    };

    const handleRematchStarting = ({ nextMatchConfig } = {}) => {
      if (!nextMatchConfig) return;

      const myRole =
        nextMatchConfig.player1SocketId === socket.id ? "player1" : "player2";

      navigate("/game/play", {
        replace: true,
        state: {
          gameType: "online",
          roomCode: nextMatchConfig.roomCode,
          boardSize: nextMatchConfig.boardSize,
          boardStyle: nextMatchConfig.boardStyle,
          customBoardImage: nextMatchConfig.customBoardImage,
          marker1: nextMatchConfig.marker1,
          marker2: nextMatchConfig.marker2,
          player1: nextMatchConfig.player1Name,
          player2: nextMatchConfig.player2Name,
          player1SocketId: nextMatchConfig.player1SocketId,
          player2SocketId: nextMatchConfig.player2SocketId,
          myRole,
          sessionId: nextMatchConfig.sessionId,
          backendSession: nextMatchConfig.backendSession,
        },
      });
    };

    const handleRoomLifecycleError = ({ message } = {}) => {
      setApiError(message || "The online room could not be updated.");
    };

    socket.on("moveResult", handleMoveResult);
    socket.on("onlineMatchTerminated", handleOnlineMatchTerminated);
    socket.on("rematchWaitingForOpponent", handleRematchWaiting);
    socket.on("rematchRequested", handleRematchRequested);
    socket.on("rematchDeclined", handleRematchDeclined);
    socket.on("rematchStarting", handleRematchStarting);
    socket.on("roomLifecycleError", handleRoomLifecycleError);

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("moveResult", handleMoveResult);
      socket.off("onlineMatchTerminated", handleOnlineMatchTerminated);
      socket.off("rematchWaitingForOpponent", handleRematchWaiting);
      socket.off("rematchRequested", handleRematchRequested);
      socket.off("rematchDeclined", handleRematchDeclined);
      socket.off("rematchStarting", handleRematchStarting);
      socket.off("roomLifecycleError", handleRoomLifecycleError);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [applyBackendState, config, isOnline, navigate]);

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
      if (isOnline) {
        
        if (winner || aborted || onlineRoomClosed || rematchWaiting || incomingRematch) return;
        if (board[row]?.[col]) return;

        const isMyTurn =
          (myRole === "player1" && currentPlayerRef.current === 1) ||
          (myRole === "player2" && currentPlayerRef.current === 2);
        if (!isMyTurn) return;

        const myMarker = myRole === "player1" ? config.marker1 : config.marker2;
        const newBoard = board.map((r) => [...r]);
        newBoard[row][col] = myMarker;
        setBoard(newBoard);
        setCurrentPlayer((p) => (p === 1 ? 2 : 1));

        socket.emit("makeMove", {
          roomCode: config.roomCode,
          rowIndex: row,
          colIndex: col,
        });
        return;
      }

      if (isBackendManaged) {
        handleBackendCellClick(row, col);
      }
    },
    [
      isOnline, myRole, winner, aborted, board,
      onlineRoomClosed, rematchWaiting, incomingRematch,
      config, isBackendManaged, handleBackendCellClick
    ],
  );

  const requestOnlineRematch = useCallback(() => {
    if (!isOnline || !config?.roomCode || !sessionId) return;
    socket.emit("requestRematch", {
      roomCode: config.roomCode,
      sessionId,
    });
  }, [config?.roomCode, isOnline, sessionId]);

  const respondOnlineRematch = useCallback(
    (accept) => {
      if (!isOnline || !config?.roomCode) return;
      socket.emit("respondRematch", {
        roomCode: config.roomCode,
        accept,
      });
      if (!accept) {
        setShowWinnerModal(false);
        setIncomingRematch(null);
        setRematchWaiting(false);
      }
    },
    [config?.roomCode, isOnline],
  );

  const leaveOnlineMatch = useCallback(() => {
    if (!isOnline || !config?.roomCode) return;
    socket.emit("leaveOnlineMatch", {
      roomCode: config.roomCode,
      sessionId,
      reason: "player_left",
    });
  }, [config?.roomCode, isOnline, sessionId]);

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
    sessionResult,
    winningCells,
    aborted,
    elapsed,
    aiThinking,
    showWinnerModal,
    isPaused,
    startTime,
    apiError,
    onlineRoomClosed,
    rematchWaiting,
    incomingRematch,
    setAborted,
    setIsPaused,
    setShowWinnerModal,
    resetGame,
    handleCellClick,
    abortCurrentGame,
    requestOnlineRematch,
    respondOnlineRematch,
    leaveOnlineMatch,
    setOnlineRoomClosed,
  };
}

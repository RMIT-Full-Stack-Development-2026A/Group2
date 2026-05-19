import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getSpectatorMatch } from "../../api/game.api";
import { normalizeBackendGameState } from "../GamePlayView/GamePlayView.service";
import spectatorSocket from "@/lib/spectatorSocket";

function getElapsedSecondsFromStart(startedAt) {
  if (!startedAt) return 0;

  const startedAtMs = new Date(startedAt).getTime();
  if (Number.isNaN(startedAtMs)) return 0;

  return Math.max(0, Math.floor((Date.now() - startedAtMs) / 1000));
}

function buildConfig(match) {
  if (!match) return null;

  return {
    gameType: "online",
    viewerMode: "spectator",
    roomCode: match.roomCode,
    sessionId: match.sessionId,
    boardSize: match.boardSize,
    boardStyle: match.boardStyle,
    customBoardImage: match.customBoardImage,
    marker1: match.marker1,
    marker2: match.marker2,
    player1: match.player1Name,
    player2: match.player2Name,
  };
}

export default function useSpectatorMatchView(token) {
  const [match, setMatch] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [eventMessage, setEventMessage] = useState("");
  const [socketMessage, setSocketMessage] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(null);

  const config = useMemo(() => buildConfig(match), [match]);
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const applyBackendState = useCallback(
    (dto, nextConfig) => {
      const renderConfig = nextConfig || configRef.current;
      if (!renderConfig) return;

      const nextState = normalizeBackendGameState(dto, renderConfig);
      setGameState(nextState);

      if (nextState.startedAt) {
        startTimeRef.current = nextState.startedAt;
        setElapsed(getElapsedSecondsFromStart(nextState.startedAt));
      }
    },
    [],
  );

  useEffect(() => {
    let active = true;

    async function loadMatch() {
      try {
        setLoading(true);
        setError("");
        setEventMessage("");

        const nextMatch = await getSpectatorMatch(token);
        if (!active) return;

        if (!nextMatch?.backendSession) {
          throw new Error("This spectator link is invalid or no longer available.");
        }

        const nextConfig = buildConfig(nextMatch);
        setMatch(nextMatch);
        applyBackendState(nextMatch.backendSession, nextConfig);
      } catch (loadError) {
        if (!active) return;
        setError(
          loadError?.data?.message ||
            loadError?.message ||
            "This spectator link is invalid, expired, or the match is no longer available.",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMatch();

    return () => {
      active = false;
    };
  }, [applyBackendState, token]);

  useEffect(() => {
    if (!match?.shareToken) return undefined;

    const handleConnect = () => {
      spectatorSocket.emit("watchMatch", { shareToken: match.shareToken });
    };

    const handleAccepted = () => {
      setSocketMessage("");
    };

    const handleWatchError = ({ message } = {}) => {
      setSocketMessage(message || "This spectator link is invalid or no longer available.");
    };

    const handleMoveResult = (dto) => {
      setEventMessage("");
      applyBackendState(dto);
    };

    const handleRoomClosed = ({ reason } = {}) => {
      setEventMessage(
        reason === "closed_by_admin" ? "This room was closed." : "This live match is no longer active.",
      );
    };

    const handlePlayerDisconnected = () => {
      setEventMessage("A player disconnected. This live match is no longer active.");
    };

    spectatorSocket.on("connect", handleConnect);
    spectatorSocket.on("watchMatchAccepted", handleAccepted);
    spectatorSocket.on("watchMatchError", handleWatchError);
    spectatorSocket.on("spectatorMoveResult", handleMoveResult);
    spectatorSocket.on("roomClosed", handleRoomClosed);
    spectatorSocket.on("playerDisconnected", handlePlayerDisconnected);

    if (!spectatorSocket.connected) {
      spectatorSocket.connect();
    } else {
      handleConnect();
    }

    return () => {
      spectatorSocket.off("connect", handleConnect);
      spectatorSocket.off("watchMatchAccepted", handleAccepted);
      spectatorSocket.off("watchMatchError", handleWatchError);
      spectatorSocket.off("spectatorMoveResult", handleMoveResult);
      spectatorSocket.off("roomClosed", handleRoomClosed);
      spectatorSocket.off("playerDisconnected", handlePlayerDisconnected);
      spectatorSocket.disconnect();
    };
  }, [applyBackendState, match?.shareToken]);

  useEffect(() => {
    if (eventMessage) return undefined;
    if (!startTimeRef.current || gameState?.winner || gameState?.aborted) return undefined;
    if (gameState?.sessionStatus === "finished") return undefined;

    const syncElapsed = () => {
      setElapsed(getElapsedSecondsFromStart(startTimeRef.current));
    };

    syncElapsed();
    const interval = setInterval(syncElapsed, 1000);
    return () => clearInterval(interval);
  }, [eventMessage, gameState?.aborted, gameState?.sessionStatus, gameState?.winner]);

  return {
    match,
    config,
    gameState,
    loading,
    error,
    eventMessage,
    socketMessage,
    elapsed,
  };
}

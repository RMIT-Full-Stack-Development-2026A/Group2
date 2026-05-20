import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import spectatorSocket from "@/lib/spectatorSocket";
import { fetchSpectatorMatch } from "../../api/game.api";
import { normalizeBackendGameState } from "../GamePlayView/GamePlayView.service";

const UNAVAILABLE_MESSAGE =
  "This spectator link is invalid or the live match is no longer available.";

function buildConfig(match) {
  return {
    gameType: "online",
    roomCode: match?.roomCode,
    sessionId: match?.sessionId,
    boardSize: match?.boardSize || 10,
    boardStyle: match?.boardStyle || "classic",
    customBoardImage: match?.customBoardImage || null,
    marker1: match?.marker1 || "X",
    marker2: match?.marker2 || "O",
    player1: match?.player1Name || "Player 1",
    player2: match?.player2Name || "Player 2",
    player1AvatarURL: match?.player1AvatarURL || null,
    player2AvatarURL: match?.player2AvatarURL || null,
  };
}

export default function useSpectatorMatchView() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [match, setMatch] = useState(null);
  const [backendSession, setBackendSession] = useState(null);
  const [closedMessage, setClosedMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMatch() {
      setLoading(true);
      setError("");
      try {
        const nextMatch = await fetchSpectatorMatch(token);
        if (!active) return;
        setMatch(nextMatch);
        setBackendSession(nextMatch?.backendSession || null);
      } catch {
        if (!active) return;
        setError(UNAVAILABLE_MESSAGE);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMatch();

    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    if (!match?.shareToken) return undefined;

    function handleMoveResult(dto) {
      setBackendSession(dto);
    }

    function handleRoomClosed({ reason } = {}) {
      setClosedMessage(
        reason === "closed_by_admin"
          ? "This room was closed by an administrator."
          : "This room was closed.",
      );
    }

    function handlePlayerDisconnected() {
      setClosedMessage(
        "A player disconnected. This live match is no longer available.",
      );
    }

    function handleWatchError({ message } = {}) {
      setError(message || UNAVAILABLE_MESSAGE);
    }

    function handleWatchAccepted() {
      setError("");
    }

    spectatorSocket.connect();
    spectatorSocket.emit("watchMatch", { shareToken: match.shareToken });
    spectatorSocket.on("watchMatchAccepted", handleWatchAccepted);
    spectatorSocket.on("spectatorMoveResult", handleMoveResult);
    spectatorSocket.on("roomClosed", handleRoomClosed);
    spectatorSocket.on("playerDisconnected", handlePlayerDisconnected);
    spectatorSocket.on("watchMatchError", handleWatchError);

    return () => {
      spectatorSocket.off("spectatorMoveResult", handleMoveResult);
      spectatorSocket.off("watchMatchAccepted", handleWatchAccepted);
      spectatorSocket.off("roomClosed", handleRoomClosed);
      spectatorSocket.off("playerDisconnected", handlePlayerDisconnected);
      spectatorSocket.off("watchMatchError", handleWatchError);
      spectatorSocket.disconnect();
    };
  }, [match?.shareToken]);

  const config = useMemo(() => buildConfig(match), [match]);
  const state = useMemo(
    () => normalizeBackendGameState(backendSession, config),
    [backendSession, config],
  );

  return {
    loading,
    error,
    closedMessage,
    config,
    state,
    backendSession,
  };
}

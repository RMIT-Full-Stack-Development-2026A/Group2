import {
  createSinglePlayerGamePayload,
  createSinglePlayerGameSession,
} from "../../api/game.api";

export function buildAIGameNavigationState({
  username,
  botName,
  firstPlayer,
  boardSize,
  boardStyle,
  playerMarker,
  aiMarker,
  difficulty,
  useCustomBoard,
  customBoardImage,
  playerAvatarURL,
  backendSession,
}) {
  return {
    sessionId: backendSession?.session?.id || null,
    backendSession: backendSession || null,
    gameType: "ai",
    player1: username,
    player2: botName,
    firstPlayer: firstPlayer === "player" ? "player1" : "player2",
    boardSize,
    boardStyle: useCustomBoard ? "custom" : boardStyle,
    marker1: playerMarker,
    marker2: aiMarker,
    aiDifficulty: difficulty,
    player1AvatarURL: playerAvatarURL || "",
    customBoardImage: useCustomBoard ? customBoardImage : undefined,
  };
}

export async function startAIGame({
  username,
  botName,
  firstPlayer,
  boardSize,
  boardStyle,
  playerMarker,
  aiMarker,
  difficulty,
  useCustomBoard,
  customBoardImage,
  playerAvatarURL,
}) {
  const payload = createSinglePlayerGamePayload({
    firstPlayer,
    boardSize,
    aiDifficulty: difficulty,
  });

  const backendSession = await createSinglePlayerGameSession(payload);

  return buildAIGameNavigationState({
    username,
    botName,
    firstPlayer,
    boardSize,
    boardStyle,
    playerMarker,
    aiMarker,
    difficulty,
    useCustomBoard,
    customBoardImage,
    playerAvatarURL,
    backendSession,
  });
}

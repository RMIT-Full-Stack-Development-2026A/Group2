import {
  createLocalGamePayload,
  createLocalGameSession,
} from "../../api/game.api";

export function buildLocalGameNavigationState({
  username,
  player2Name,
  firstPlayer,
  boardSize,
  boardStyle,
  marker1,
  marker2,
  useCustomBoard,
  customBoardImage,
  backendSession,
}) {
  return {
    sessionId: backendSession?.session?.id || null,
    backendSession: backendSession || null,
    gameType: "local",
    player1: username,
    player2: player2Name || "Player 2",
    firstPlayer,
    boardSize,
    boardStyle: useCustomBoard ? "custom" : boardStyle,
    marker1,
    marker2,
    customBoardImage: useCustomBoard ? customBoardImage : undefined,
  };
}

export async function startLocalGame({
  username,
  player2Name,
  firstPlayer,
  boardSize,
  boardStyle,
  marker1,
  marker2,
  useCustomBoard,
  customBoardImage,
}) {
  const payload = createLocalGamePayload({
    player2Name,
    firstPlayer,
    boardSize,
  });

  const backendSession = await createLocalGameSession(payload);

  return buildLocalGameNavigationState({
    username,
    player2Name,
    firstPlayer,
    boardSize,
    boardStyle,
    marker1,
    marker2,
    useCustomBoard,
    customBoardImage,
    backendSession,
  });
}
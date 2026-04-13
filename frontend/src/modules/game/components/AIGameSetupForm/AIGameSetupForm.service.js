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
}) {
  return {
    gameType: "ai",
    player1: username,
    player2: botName,
    firstPlayer: firstPlayer === "player" ? "player1" : "player2",
    boardSize,
    boardStyle: useCustomBoard ? "custom" : boardStyle,
    marker1: playerMarker,
    marker2: aiMarker,
    aiDifficulty: difficulty,
    customBoardImage: useCustomBoard ? customBoardImage : undefined,
  };
}
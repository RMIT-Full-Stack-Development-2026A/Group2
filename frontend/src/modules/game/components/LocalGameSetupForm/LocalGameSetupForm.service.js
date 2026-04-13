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
}) {
  return {
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
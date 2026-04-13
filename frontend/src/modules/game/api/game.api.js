export function createLocalGamePayload({ player2Name, firstPlayer, boardSize }) {
  return {
    player2Name,
    firstTurn: firstPlayer === "player1" ? 1 : 2,
    boardSize,
  };
}

export function createSinglePlayerGamePayload({
  firstPlayer,
  boardSize,
  aiDifficulty,
}) {
  return {
    firstTurn: firstPlayer === "player" ? 1 : 2,
    boardSize,
    aiDifficulty,
  };
}
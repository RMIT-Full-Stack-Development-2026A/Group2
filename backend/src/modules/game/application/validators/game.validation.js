const AppError = require("../../../../shared/errors/AppError");

function validateCreateLocalGame(body) {
  const errors = [];
  const { player2Name, boardSize = 10, player1Marker, player2Marker, firstTurn } = body ?? {};

  if (!player2Name || !String(player2Name).trim()) {
    errors.push({
      field: "player2Name",
      message: "Second player's name is required.",
      example: "Example: Anna",
    });
  }

  if (![10, 15].includes(boardSize)) {
    errors.push({
      field: "boardSize",
      message: "Board size must be 10 or 15.",
      example: "Example: 10",
    });
  }

  if (!player1Marker || !player2Marker || player1Marker === player2Marker) {
    errors.push({
      field: "markers",
      message: "Players must use distinct markers.",
      example: "Example: X and O",
    });
  }

  if (![1, 2].includes(firstTurn)) {
    errors.push({
      field: "firstTurn",
      message: "First turn must be 1 or 2.",
      example: "Example: 1",
    });
  }

  return errors;
}

function validateMoveInput(body) {
  const errors = [];
  const { rowIndex, colIndex } = body ?? {};

  if (!Number.isInteger(rowIndex) || rowIndex < 0) {
    errors.push({
      field: "rowIndex",
      message: "rowIndex must be a non-negative integer.",
      example: "Example: 0",
    });
  }

  if (!Number.isInteger(colIndex) || colIndex < 0) {
    errors.push({
      field: "colIndex",
      message: "colIndex must be a non-negative integer.",
      example: "Example: 0",
    });
  }

  return errors;
}

module.exports = {
  validateCreateLocalGame,
  validateMoveInput,
};
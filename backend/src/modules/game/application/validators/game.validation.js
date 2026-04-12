const AppError = require("../../../../shared/errors/AppError");

const ALLOWED_AI = ["easy", "medium", "hard"];

function validateCreateLocalGame(body) {
  const errors = [];
  const { player2Name, boardSize = 10, firstTurn } = body ?? {};

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

  if (![1, 2].includes(firstTurn)) {
    errors.push({
      field: "firstTurn",
      message: "First turn must be 1 or 2.",
      example: "Example: 1",
    });
  }

  return errors;
}

function validateCreateSinglePlayerGame(body) {
  const errors = [];
  const { boardSize = 10, aiDifficulty, firstTurn } = body ?? {};

  if (![10, 15].includes(boardSize)) {
    errors.push({
      field: "boardSize",
      message: "Board size must be 10 or 15.",
      example: "Example: 10",
    });
  }

  if (!ALLOWED_AI.includes(aiDifficulty)) {
    errors.push({
      field: "aiDifficulty",
      message: "AI difficulty must be easy, medium, or hard.",
      example: "Example: medium",
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
  validateCreateSinglePlayerGame,
  validateMoveInput,
};
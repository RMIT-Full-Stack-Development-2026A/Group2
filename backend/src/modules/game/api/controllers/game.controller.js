const AppError = require("../../../../shared/errors/AppError");
const { sendError } = require("../../../../shared/utils/httpResponse");
const gameService = require("../../application/services/game.service");
const {
  validateCreateLocalGame,
  validateCreateSinglePlayerGame,
  validateMoveInput,
} = require("../../application/validators/game.validation");

function handleControllerError(res, err) {
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.code, err.message, err.errors);
  }

  return sendError(
    res,
    err.statusCode || 500,
    err.code || "INTERNAL_ERROR",
    err.message || "Something went wrong.",
    err.errors,
  );
}

async function createLocalGame(req, res) {
  const errors = validateCreateLocalGame(req.body);
  if (errors.length) {
    return sendError(res, 400, "VALIDATION_ERROR", "Validation failed.", errors);
  }

  try {
    const data = await gameService.createLocalGame(req.user, req.body);
    return res.status(201).json({
      status: "success",
      data,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
}

async function createSinglePlayerGame(req, res) {
  const errors = validateCreateSinglePlayerGame(req.body);
  if (errors.length) {
    return sendError(res, 400, "VALIDATION_ERROR", "Validation failed.", errors);
  }

  try {
    const data = await gameService.createSinglePlayerGame(req.user, req.body);
    return res.status(201).json({
      status: "success",
      data,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
}

async function makeMove(req, res) {
  const errors = validateMoveInput(req.body);
  if (errors.length) {
    return sendError(res, 400, "VALIDATION_ERROR", "Validation failed.", errors);
  }

  try {
    const data = await gameService.makeMove(req.user, req.params.id, req.body);
    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
}

async function abortGame(req, res) {
  try {
    const data = await gameService.abortGame(req.user, req.params.id);
    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
}

async function getSession(req, res) {
  try {
    const data = await gameService.getSessionState(req.params.id);
    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
}

module.exports = {
  createLocalGame,
  createSinglePlayerGame,
  makeMove,
  abortGame,
  getSession,
};
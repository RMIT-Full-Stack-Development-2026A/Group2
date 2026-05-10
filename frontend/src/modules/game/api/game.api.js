import { API_ENDPOINTS, apiRequest } from "@/config/api.config";

export function createLocalGamePayload({ player2Name, firstPlayer, boardSize }) {
  return {
    player2Name: String(player2Name || "").trim(),
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

export async function createLocalGameSession(payload, options = {}) {
  const response = await apiRequest(API_ENDPOINTS.game.createLocalGame, {
    method: "POST",
    body: JSON.stringify(payload),
    ...options,
  });

  return response?.data ?? null;
}

export async function createSinglePlayerGameSession(payload, options = {}) {
  const response = await apiRequest(API_ENDPOINTS.game.createSinglePlayer, {
    method: "POST",
    body: JSON.stringify(payload),
    ...options,
  });

  return response?.data ?? null;
}

export async function getGameSession(sessionId, options = {}) {
  const response = await apiRequest(API_ENDPOINTS.game.getSession(sessionId), {
    method: "GET",
    ...options,
  });

  return response?.data ?? null;
}

export async function makeGameMove(sessionId, payload, options = {}) {
  const response = await apiRequest(API_ENDPOINTS.game.makeMove(sessionId), {
    method: "POST",
    body: JSON.stringify(payload),
    ...options,
  });

  return response?.data ?? null;
}

export async function abortGameSession(sessionId, options = {}) {
  const response = await apiRequest(API_ENDPOINTS.game.abortSession(sessionId), {
    method: "POST",
    ...options,
  });

  return response?.data ?? null;
}
import { httpGet, httpPost } from "../../../../lib/httpClient";

async function parseResponse(response) {
    const data = await response.json();
    if(!response.ok) {
        throw new Error(data.message);
    }
    return data;
}

export async function createGameSession(payload) {
  const endpoint = payload.gameMode === "single_player" 
    ? "/api/game/sessions/single-player"
    : "/api/game/sessions/local";
  const response = await httpPost(endpoint, payload);
  return parseResponse(response)
}

export async function makeMove(sessionId, rowIndex, colIndex) {
  const response = await httpPost(`/api/game/sessions/${sessionId}/moves`, { rowIndex, colIndex });
  return parseResponse(response)
}

export async function abort(sessionId) {
  const response = await httpPost(`/api/game/sessions/${sessionId}/abort`);
  return parseResponse(response)
}

export async function getGameSession(sessionId) {
  const response = await httpGet(`/api/game/sessions/${sessionId}`);
  return parseResponse(response)
}
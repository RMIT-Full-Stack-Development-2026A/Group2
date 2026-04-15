import { httpGet, httpPost } from "../../../../lib/httpClient";
import { GAME_API } from "../../api/game.api";

async function parseResponse(response) {
    const data = await response.json();
    if(!response.ok) {
        throw new Error(data.message);
    }
    return data;
}

export async function createGameSession(payload) {
  const endpoint = payload.gameMode === "single_player" 
    ? GAME_API.createSinglePlayerSession
    : GAME_API.createLocalSession
  const response = await httpPost(endpoint, payload);
  return parseResponse(response)
}

export async function makeMove(sessionId, rowIndex, colIndex) {
  const response = await httpPost(GAME_API.makeMove(sessionId), {rowIndex, colIndex});
  return parseResponse(response)
}

export async function abort(sessionId) {
  const response = await httpPost(GAME_API.abortGame(sessionId));
  return parseResponse(response)
}

export async function getGameSession(sessionId) {
  const response = await httpGet(GAME_API.getSession(sessionId));
  return parseResponse(response)
}
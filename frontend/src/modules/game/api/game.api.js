export const GAME_API = {
  createLocalSession: "/api/game/sessions/local",
  createSinglePlayerSession: "/api/game/sessions/single-player",
  makeMove: (sessionId) => `/api/game/sessions/${sessionId}/moves`,
  abortGame: (sessionId) => `/api/game/sessions/${sessionId}/abort`,
  getSession: (sessionId) => `/api/game/sessions/${sessionId}`
};
import { createEmptyBoard } from "../../utils/game.helpers";

export function getPlayerAvatarFallback(value) {
  if (!value) return "?";
  return value.charAt(0).toUpperCase();
}

export function getParticipantByTurnOrder(participants = [], turnOrder) {
  return participants.find((participant) => participant.turnOrder === turnOrder) || null;
}

export function getParticipantDisplayName(participants = [], turnOrder, fallback = "") {
  return getParticipantByTurnOrder(participants, turnOrder)?.displayName || fallback;
}

export function getWinnerNameFromSession(dto, fallbackPlayer1, fallbackPlayer2) {
  const winnerId = dto?.session?.winnerParticipantID;
  if (!winnerId) return null;

  const winnerParticipant = (dto?.participants || []).find(
    (participant) => participant.id === winnerId,
  );

  if (!winnerParticipant) return null;

  if (winnerParticipant.turnOrder === 1) {
    return fallbackPlayer1 || winnerParticipant.displayName;
  }

  if (winnerParticipant.turnOrder === 2) {
    return fallbackPlayer2 || winnerParticipant.displayName;
  }

  return winnerParticipant.displayName;
}

export function normalizeBackendGameState(dto, config) {
  const boardSize = dto?.session?.boardSize || config?.boardSize || 10;
  const participants = Array.isArray(dto?.participants) ? dto.participants : [];
  const board = Array.isArray(dto?.board)
    ? dto.board
    : createEmptyBoard(boardSize);

  const player1Name =
    getParticipantDisplayName(participants, 1, config?.player1) || config?.player1;
  const player2Name =
    getParticipantDisplayName(participants, 2, config?.player2) || config?.player2;

  const currentTurnParticipantId = dto?.session?.currentTurn || null;
  const currentTurnParticipant = participants.find(
    (participant) => participant.id === currentTurnParticipantId,
  );

  const currentPlayer = currentTurnParticipant?.turnOrder || 1;
  const winner = getWinnerNameFromSession(dto, player1Name, player2Name);
  const aborted = dto?.session?.status === "aborted";
  const finished = dto?.session?.status === "finished";

  return {
    sessionId: dto?.session?.id || config?.sessionId || null,
    sessionStatus: dto?.session?.status || "ongoing",
    sessionResult: dto?.session?.result || "pending",
    board,
    size: boardSize,
    currentPlayer,
    winner,
    winningCells: Array.isArray(dto?.session?.winningLine)
      ? dto.session.winningLine
      : [],
    aborted,
    participants,
    startedAt: dto?.session?.startTime || null,
    showWinnerModal: finished,
  };
}

import { fetchMatchHistoryRequest } from "../api/profile.api";

function normalizePlayersLabel(item) {
  const opponentType = String(item?.opponentType || "").toLowerCase();
  const opponentName = String(item?.opponentName || "").trim();

  if (opponentType === "ai") {
    const level = String(item?.aiDifficulty || "").trim();
    const botName = opponentName && opponentName !== "Unknown Opponent" ? opponentName : "AI Bot";
    return level ? `You vs ${botName} (${level})` : `You vs ${botName}`;
  }

  return `You vs ${opponentName || "Unknown Opponent"}`;
}

function normalizeHistoryItem(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const rawResult = String(item.result || "").toLowerCase();
  const normalizedResult = rawResult === "unknown" || !rawResult ? "aborted" : rawResult;

  return {
    sessionId: String(item.sessionId || ""),
    sessionNumber: String(item.sessionNumber || ""),
    startTime: item.startTime || null,
    endTime: item.endTime || null,
    gameType: item.gameTypeLabel || item.gameType || "Unknown",
    result: normalizedResult,
    playersLabel: normalizePlayersLabel(item),
  };
}

export async function getMatchHistoryResult(search = "") {
  const response = await fetchMatchHistoryRequest(search);

  let body = {};
  try {
    body = await response.json();
  } catch {
    body = {};
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      code: typeof body.code === "string" ? body.code : undefined,
      message:
        typeof body.message === "string" && body.message.trim()
          ? body.message
          : "Could not load match history.",
      items: [],
    };
  }

  const items = Array.isArray(body?.history?.items)
    ? body.history.items.map(normalizeHistoryItem).filter(Boolean)
    : [];

  return {
    ok: true,
    items,
  };
}

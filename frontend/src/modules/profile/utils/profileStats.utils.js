const MODE_LABELS = {
  ai: "AI",
  local: "Local",
  online: "Online",
};

export function formatDurationMs(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return "—";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

export function getModeLabel(gameType) {
  return MODE_LABELS[String(gameType || "").toLowerCase()] || "Other";
}

export function computeProfileStats(items = []) {
  const empty = {
    totalGames: 0,
    winRate: 0,
    mostPlayedMode: null,
    mostPlayedModeLabel: "—",
    averageDurationMs: null,
    averageDurationLabel: "—",
    resultBreakdown: { win: 0, lose: 0, draw: 0, aborted: 0 },
    modeBreakdown: { ai: 0, local: 0, online: 0 },
    hasData: false,
  };

  if (!items.length) return empty;

  const resultBreakdown = { win: 0, lose: 0, draw: 0, aborted: 0 };
  const modeBreakdown = { ai: 0, local: 0, online: 0 };
  let durationTotal = 0;
  let durationCount = 0;

  for (const item of items) {
    const result = String(item.result || "aborted").toLowerCase();
    if (result in resultBreakdown) {
      resultBreakdown[result] += 1;
    } else {
      resultBreakdown.aborted += 1;
    }

    const mode = String(item.gameType || "").toLowerCase();
    if (mode in modeBreakdown) {
      modeBreakdown[mode] += 1;
    }

    if (item.startTime && item.endTime) {
      const start = new Date(item.startTime).getTime();
      const end = new Date(item.endTime).getTime();
      if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
        durationTotal += end - start;
        durationCount += 1;
      }
    }
  }

  const decisiveGames = resultBreakdown.win + resultBreakdown.lose;
  const winRate =
    decisiveGames > 0
      ? Math.round((resultBreakdown.win / decisiveGames) * 100)
      : 0;

  const modeEntries = Object.entries(modeBreakdown).filter(([, count]) => count > 0);
  const topMode = modeEntries.sort((a, b) => b[1] - a[1])[0];
  const averageDurationMs =
    durationCount > 0 ? Math.round(durationTotal / durationCount) : null;

  return {
    totalGames: items.length,
    winRate,
    mostPlayedMode: topMode?.[0] ?? null,
    mostPlayedModeLabel: topMode ? getModeLabel(topMode[0]) : "—",
    averageDurationMs,
    averageDurationLabel: formatDurationMs(averageDurationMs),
    resultBreakdown,
    modeBreakdown,
    hasData: true,
  };
}

export function toPercentages(breakdown) {
  const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  if (total === 0) {
    return Object.fromEntries(Object.keys(breakdown).map((key) => [key, 0]));
  }
  return Object.fromEntries(
    Object.entries(breakdown).map(([key, value]) => [
      key,
      Math.round((value / total) * 100),
    ]),
  );
}

export function buildConicGradient(segments) {
  const entries = segments.filter((segment) => segment.value > 0);
  if (!entries.length) return "#e2e8f0";

  let cursor = 0;
  const stops = entries.map((segment) => {
    const start = cursor;
    cursor += segment.value;
    return `${segment.color} ${start}% ${cursor}%`;
  });

  return `conic-gradient(${stops.join(", ")})`;
}

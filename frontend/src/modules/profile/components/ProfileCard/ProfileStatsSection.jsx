import { useMemo } from "react";
import { useProfileStats } from "../../hooks/useProfileStats";
import { getModeLabel, toPercentages } from "../../utils/profileStats.utils";
import styles from "./ProfileStatsSection.module.css";

const RESULT_META = [
  { key: "win", label: "Wins", color: "#22c55e" },
  { key: "lose", label: "Losses", color: "#ef4444" },
  { key: "draw", label: "Draws", color: "#94a3b8" },
  { key: "aborted", label: "Aborted", color: "#cbd5e1" },
];

const MODE_COLORS = {
  ai: "#8b5cf6",
  local: "#0d6efd",
  online: "#f59e0b",
};

export default function ProfileStatsSection() {
  const { stats, loading, error } = useProfileStats();

  const resultPercents = useMemo(
    () => toPercentages(stats.resultBreakdown),
    [stats.resultBreakdown],
  );

  const winRateGradient = `conic-gradient(#22c55e 0% ${stats.winRate}%, #e2e8f0 ${stats.winRate}% 100%)`;

  const resultLegend = RESULT_META.map((meta) => ({
    key: meta.key,
    label: meta.label,
    color: meta.color,
    value: stats.resultBreakdown[meta.key] ?? 0,
  }));

  const modeBarMax = Math.max(...Object.values(stats.modeBreakdown), 1);

  return (
    <section className={styles.section} aria-label="Game statistics">
      <header className="mb-4">
        <h2 className="fs-3 fw-bold text-dark mb-0">Game Statistics</h2>
      </header>

      {error ? (
        <p className="text-danger small mb-3" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="d-flex align-items-center gap-2 text-muted small py-2">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading statistics...</span>
          </div>
          Loading statistics...
        </div>
      ) : null}

      {!loading && !stats.hasData ? (
        <p className={styles.emptyState}>
          Play a few matches to see your win rate, favourite mode, and duration
          stats here.
        </p>
      ) : null}

      {!loading && stats.hasData ? (
        <>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Win rate</p>
              <div className={styles.winRateWrap}>
                <div
                  className={styles.winRateRing}
                  style={{ background: winRateGradient }}
                  aria-hidden
                >
                  <div className={styles.winRateRingInner}>{stats.winRate}%</div>
                </div>
                <div>
                  <p className={styles.summaryValue}>{stats.winRate}%</p>
                  <p className={styles.summaryHint}>
                    {stats.resultBreakdown.win}W / {stats.resultBreakdown.lose}L
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Most played mode</p>
              <p className={styles.summaryValue}>{stats.mostPlayedModeLabel}</p>
              <p className={styles.summaryHint}>
                {stats.mostPlayedMode
                  ? `${stats.modeBreakdown[stats.mostPlayedMode]} games`
                  : "No mode data"}
              </p>
            </div>

            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Avg. game duration</p>
              <p className={styles.summaryValue}>{stats.averageDurationLabel}</p>
              <p className={styles.summaryHint}>
                Across {stats.totalGames} recorded games
              </p>
            </div>
          </div>

          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Results breakdown</h3>
              <div
                className={styles.stackedBar}
                role="img"
                aria-label="Results breakdown"
              >
                {RESULT_META.map((meta) =>
                  resultPercents[meta.key] > 0 ? (
                    <div
                      key={meta.key}
                      className={styles.stackedSegment}
                      style={{
                        width: `${resultPercents[meta.key]}%`,
                        background: meta.color,
                      }}
                    />
                  ) : null,
                )}
              </div>
              <div className={styles.legend}>
                {resultLegend.map((item) => (
                  <div key={item.key} className={styles.legendRow}>
                    <span className={styles.legendLabel}>
                      <span
                        className={styles.legendSwatch}
                        style={{ background: item.color }}
                        aria-hidden
                      />
                      {item.label}
                    </span>
                    <span className="fw-semibold">
                      {item.value} ({resultPercents[item.key] || 0}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Modes played</h3>
              <div className={styles.barChart}>
                {Object.entries(stats.modeBreakdown)
                  .filter(([, count]) => count > 0)
                  .map(([mode, count]) => (
                  <div key={mode} className={styles.barRow}>
                    <span>{getModeLabel(mode)}</span>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{
                          width: `${Math.round((count / modeBarMax) * 100)}%`,
                          background: MODE_COLORS[mode] || "#64748b",
                        }}
                      />
                    </div>
                    <span className="fw-semibold text-end">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

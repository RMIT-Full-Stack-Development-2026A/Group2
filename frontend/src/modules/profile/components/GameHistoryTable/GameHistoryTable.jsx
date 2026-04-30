import { Calendar, Clock3 } from "lucide-react";
import { useGameHistoryTable } from "../../hooks/useGameHistoryTable";

export default function GameHistoryTable({ embedded = false }) {
  const { items, loading, error } = useGameHistoryTable();

  function formatDateTime(value) {
    if (!value) {
      return "-";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

  function resultClassName(result) {
    const normalized = String(result || "").toLowerCase();
    const base = "badge rounded-pill text-uppercase fw-bold px-3 py-2";
    if (normalized === "win") return `${base} text-bg-primary`;
    if (normalized === "lose") return `${base} text-bg-danger`;
    if (normalized === "draw") return `${base} text-bg-secondary`;
    if (normalized === "aborted") return `${base} bg-body-secondary text-secondary`;
    return `${base} text-bg-secondary`;
  }

  function resultLabel(result) {
    const normalized = String(result || "").toLowerCase();
    if (normalized === "win") return "Win";
    if (normalized === "lose") return "Lose";
    if (normalized === "draw") return "Draw";
    if (normalized === "aborted") return "Aborted";
    return "Aborted";
  }

  const inner = (
    <div>
      <h2 className="h3 fw-bold text-dark mb-3">Match History</h2>

      {loading ? (
        <p className="text-secondary mb-0">Loading match history...</p>
      ) : null}

      {error ? (
        <p className="text-danger mb-0" role="alert">
          {error}
        </p>
      ) : null}

      {!loading && !error && items.length === 0 ? (
        <p className="text-secondary mb-0">No past sessions found.</p>
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <div className="d-grid gap-3">
          {items.map((item) => (
            <article
              key={item.sessionId}
              className="border border-secondary-subtle rounded-3 bg-white p-3"
            >
              <div className="d-flex align-items-start justify-content-between gap-3">
                <div className="d-flex gap-3">
                  <div className="fw-bold text-secondary">{item.sessionNumber || "#"}</div>
                  <div>
                    <p className="fw-bold text-dark mb-1">{item.playersLabel}</p>
                    <div className="d-flex flex-wrap gap-2 column-gap-3 text-secondary small">
                      <span className="d-inline-flex align-items-center gap-1">
                        <Calendar size={14} aria-hidden />
                        Start: {formatDateTime(item.startTime)}
                      </span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <Clock3 size={14} aria-hidden />
                        End: {formatDateTime(item.endTime)}
                      </span>
                      <span>Type: {item.gameType}</span>
                    </div>
                  </div>
                </div>

                <span className={resultClassName(item.result)}>{resultLabel(item.result)}</span>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );

  if (embedded) {
    return inner;
  }

  return (
    <div className="card w-100 shadow-sm border border-secondary-subtle rounded-3">
      <div className="card-body p-4">{inner}</div>
    </div>
  );
}

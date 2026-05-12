import { useEffect, useRef, useState } from "react";
import { ArrowDownUp, Calendar, ChevronDown, Eye, RotateCcw, Search } from "lucide-react";
import { useGameHistoryTable } from "../../hooks/useGameHistoryTable";

function formatDate(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function resultBadge(result) {
  const value = String(result || "aborted").toLowerCase();
  const color =
    value === "win"
      ? "text-bg-primary"
      : value === "lose"
        ? "text-bg-danger"
        : "bg-body-secondary text-secondary";
  return `badge rounded-pill text-uppercase fw-bold px-3 py-2 ${color}`;
}

export default function GameHistoryTable({ embedded = false }) {
  const [dateOpen, setDateOpen] = useState(false);
  const rootRef = useRef(null);
  const {
    items,
    totalCount,
    loading,
    error,
    search,
    setSearch,
    result,
    setResult,
    gameType,
    setGameType,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    sort,
    setSort,
    clearFilters,
  } = useGameHistoryTable();

  const hasFilters = Boolean(search.trim() || result || gameType || dateFrom || dateTo || sort !== "desc");

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (!rootRef.current?.contains(event.target)) setDateOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const content = (
    <div ref={rootRef}>
      <h2 className="h3 fw-bold text-dark mb-3">Match History</h2>

      <div className="history-filter-bar mb-2">
        <div className="input-group history-search">
          <span className="input-group-text bg-white border-end-0">
            <Search size={20} aria-hidden />
          </span>
          <input
            type="search"
            className="form-control border-start-0 ps-0"
            placeholder="Search session #, player, room..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search match history"
          />
        </div>

        <select
          className="form-select history-filter-select"
          value={result}
          onChange={(event) => setResult(event.target.value)}
          aria-label="Filter by result"
        >
          <option value="">All Results</option>
          <option value="win">Win</option>
          <option value="lose">Lose</option>
          <option value="aborted">Aborted</option>
        </select>

        <select
          className="form-select history-filter-select"
          value={gameType}
          onChange={(event) => setGameType(event.target.value)}
          aria-label="Filter by game type"
        >
          <option value="">All Types</option>
          <option value="local">Local</option>
          <option value="ai">AI</option>
          <option value="online">Online</option>
        </select>

        <div className="history-filter">
          <button
            type="button"
            className={`history-filter-btn btn ${dateOpen ? "btn-dark" : "btn-outline-secondary"}`}
            onClick={() => setDateOpen((open) => !open)}
          >
            <Calendar size={18} aria-hidden />
            Date
            <ChevronDown size={16} aria-hidden />
            {dateFrom || dateTo ? <span className="history-filter-dot" /> : null}
          </button>
          {dateOpen ? (
            <div className="history-menu history-date-menu">
              <input
                type="date"
                className="form-control"
                value={dateFrom}
                onChange={(event) => setDateFrom(event.target.value)}
                aria-label="From date"
              />
              <input
                type="date"
                className="form-control"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
                aria-label="To date"
              />
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary history-reset-btn"
          onClick={() => setSort(sort === "desc" ? "asc" : "desc")}
          aria-label={sort === "desc" ? "Sort oldest first" : "Sort newest first"}
          title={sort === "desc" ? "Newest first" : "Oldest first"}
        >
          <ArrowDownUp size={18} aria-hidden />
        </button>

        <button
          type="button"
          className="btn btn-outline-secondary history-reset-btn"
          onClick={clearFilters}
          disabled={!hasFilters}
          aria-label="Reset filters"
          title="Reset filters"
        >
          <RotateCcw size={18} aria-hidden />
        </button>
      </div>

      <p className="history-count text-secondary mb-3">
        {items.length} of {totalCount} matches
      </p>

      {loading && <p className="text-secondary mb-0">Loading match history...</p>}
      {error && <p className="text-danger mb-0">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="text-secondary mb-0">
          {hasFilters ? "No matching sessions found." : "No past sessions found."}
        </p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="d-grid gap-3">
          {items.map((item) => (
            <article className="history-row" key={item.sessionId}>
              <strong className="history-id text-secondary">{item.sessionNumber || "#"}</strong>
              <div className="history-info">
                <div className="fw-bold text-dark">{item.playersLabel.replace(/^You\s+/i, "")}</div>
                <div className="history-meta text-secondary">
                  <span className="d-inline-flex align-items-center gap-1">
                    <Calendar size={15} aria-hidden />
                    {formatDate(item.startTime)}
                  </span>
                  <span className="history-pill">{item.gameType}</span>
                </div>
              </div>
              <span className={resultBadge(item.result)}>{item.result || "aborted"}</span>
              <button type="button" className="btn btn-link text-dark p-0" aria-label={`View ${item.sessionNumber || "session"}`}>
                <Eye size={22} aria-hidden />
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );

  if (embedded) return content;

  return (
    <div className="card w-100 shadow-sm border border-secondary-subtle rounded-3">
      <div className="card-body p-4">{content}</div>
    </div>
  );
}

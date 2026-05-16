import { useEffect, useState } from "react";
import { getMatchHistoryResult } from "../services/history.service";

export function useGameHistoryTable() {
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [result, setResult] = useState("");
  const [gameType, setGameType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState("desc");

  const normalizedSearch = search.trim();

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const historyResult = await getMatchHistoryResult({
          search: normalizedSearch,
          result,
          gameType,
          dateFrom,
          dateTo,
          sort,
        });
        if (cancelled) {
          return;
        }

        if (!historyResult.ok) {
          setItems([]);
          setTotalCount(0);
          setError(historyResult.message || "Could not load match history.");
          return;
        }

        setItems(historyResult.items);
        setTotalCount(historyResult.totalCount);
      } catch {
        if (!cancelled) {
          setItems([]);
          setTotalCount(0);
          setError("Could not load match history.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [normalizedSearch, result, gameType, dateFrom, dateTo, sort]);

  function clearFilters() {
    setSearch("");
    setResult("");
    setGameType("");
    setDateFrom("");
    setDateTo("");
    setSort("desc");
  }

  return {
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
  };
}

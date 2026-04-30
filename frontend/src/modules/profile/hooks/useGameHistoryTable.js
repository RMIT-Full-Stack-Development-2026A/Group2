import { useEffect, useState } from "react";
import { getMatchHistoryResult } from "../services/history.service";

export function useGameHistoryTable() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const normalizedSearch = search.trim();

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getMatchHistoryResult(normalizedSearch);
        if (cancelled) {
          return;
        }

        if (!result.ok) {
          setItems([]);
          setError(result.message || "Could not load match history.");
          return;
        }

        setItems(result.items);
      } catch {
        if (!cancelled) {
          setItems([]);
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
  }, [normalizedSearch]);

  return {
    items,
    loading,
    error,
    search,
    setSearch,
  };
}

import { useEffect, useState } from "react";
import { getMatchHistoryResult } from "../services/history.service";

export function useGameHistoryTable() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getMatchHistoryResult();
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
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    items,
    loading,
    error,
  };
}

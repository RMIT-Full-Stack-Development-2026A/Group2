import { useEffect, useState } from "react";
import { getMatchHistoryResult } from "../services/history.service";
import { computeProfileStats } from "../utils/profileStats.utils";

export function useProfileStats() {
  const [stats, setStats] = useState(() => computeProfileStats([]));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getMatchHistoryResult({ sort: "desc" });
        if (cancelled) return;

        if (!result.ok) {
          setStats(computeProfileStats([]));
          setError(result.message || "Could not load game statistics.");
          return;
        }

        setStats(computeProfileStats(result.items));
      } catch (err) {
        if (!cancelled) {
          setStats(computeProfileStats([]));
          setError(err?.message || "Could not load game statistics.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, loading, error };
}

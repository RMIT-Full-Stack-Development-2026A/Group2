import { useEffect, useState } from "react";
import { getProfile } from "../services/profile.service";

export function useProfileCard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const next = await getProfile();
        if (!cancelled) {
          setUser(next);
          if (!next) {
            setError("Could not load profile.");
          }
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setError("Could not load profile.");
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

  return { user, loading, error };
}

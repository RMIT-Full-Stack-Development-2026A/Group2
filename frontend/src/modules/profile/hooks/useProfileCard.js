import { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";

export function useProfileCard() {
  const { user: authUser, refreshUser } = useAuth();
  const [user, setUser] = useState(authUser?.profile ? authUser : null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authUser?.profile) {
      setUser(authUser);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const next = await refreshUser();
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
  }, [authUser, refreshUser]);

  return { user, loading, error };
}

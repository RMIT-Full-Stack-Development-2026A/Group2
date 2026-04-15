import { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { getProfile } from "../services/profile.service";

export function useProfileCard() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser ?? null);
  const [loading, setLoading] = useState(!authUser);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authUser) {
      // Show available auth user data immediately to avoid UI flash.
      setUser(authUser);
      setLoading(false);
      setError(null);
    }

    let cancelled = false;

    (async () => {
      if (!authUser) {
        setLoading(true);
        setError(null);
      }
      try {
        const next = await getProfile();
        if (!cancelled) {
          if (next) {
            setUser(next);
            setError(null);
          } else if (!authUser) {
            setError("Could not load profile.");
          }
        }
      } catch {
        if (!cancelled) {
          if (!authUser) {
            setUser(null);
            setError("Could not load profile.");
          }
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
  }, [authUser]);

  return { user, loading, error };
}

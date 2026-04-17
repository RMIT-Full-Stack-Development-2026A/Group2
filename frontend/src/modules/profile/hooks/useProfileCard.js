import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { uploadProfileLogo } from "../services/profile.service";

export function useProfileCard() {
  const { user: authUser, refreshUser, accessToken, login } = useAuth();
  const [user, setUser] = useState(authUser?.profile ? authUser : null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadLogoSuccess, setUploadLogoSuccess] = useState("");

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

  const handleLogoUpload = useCallback(
    async (file) => {
      if (!file) {
        return;
      }
      setUploadLogoSuccess("");
      setUploadingLogo(true);
      try {
        const result = await uploadProfileLogo(file);
        if (!result.ok) {
          return;
        }

        const synced = await refreshUser();
        if (!synced && result.user && accessToken) {
          login(accessToken, result.user);
          setUser(result.user);
        } else if (synced) {
          setUser(synced);
        }
        setUploadLogoSuccess("Logo uploaded successfully.");
      } finally {
        setUploadingLogo(false);
      }
    },
    [accessToken, login, refreshUser],
  );

  return {
    user,
    loading,
    error,
    handleLogoUpload,
    uploadingLogo,
    uploadLogoSuccess,
  };
}

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { getProfileResult, uploadProfileLogo } from "../services/profile.service";

export function useProfileCard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadLogoSuccess, setUploadLogoSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getProfileResult();
        if (!cancelled) {
          if (result.ok && result.user) {
            setUser(result.user);
          } else {
            setUser(null);
            setError(result.message || "Could not load profile.");
            if (
              result.code === "ACCOUNT_INACTIVE" ||
              result.status === 401 ||
              result.status === 403
            ) {
              await logout();
              navigate("/login", { replace: true });
            }
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
  }, [logout, navigate]);

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

        setUser(result.user);
        setUploadLogoSuccess("Logo uploaded successfully.");
      } finally {
        setUploadingLogo(false);
      }
    },
    [],
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

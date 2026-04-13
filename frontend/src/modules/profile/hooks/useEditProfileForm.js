import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { ALLOWED_COUNTRIES } from "../../auth/utils/auth.validation";
import { changePassword, updateProfile } from "../services/profile.service";

const emptyForm = {
  username: "",
  email: "",
  country: "",
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

function mapApiErrorsToIssues(errors) {
  if (!Array.isArray(errors) || !errors.length) {
    return null;
  }
  return errors.map((e) => ({
    message:
      e.field && e.message
        ? `${e.field}: ${e.message}`
        : e.message || "Invalid input.",
  }));
}

/**
 * @param {object | null} initialUser — profile from GET /api/auth/profile (username, email, country, …)
 */
export function useEditProfileForm(initialUser) {
  const navigate = useNavigate();
  const { accessToken, login, refreshUser } = useAuth();
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorIssues, setErrorIssues] = useState(null);

  useEffect(() => {
    if (!initialUser) {
      return;
    }
    const country = ALLOWED_COUNTRIES.includes(initialUser.country)
      ? initialUser.country
      : "";
    setFormData({
      username: initialUser.username ?? "",
      email: initialUser.email ?? "",
      country,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setError("");
    setErrorIssues(null);
  }, [initialUser]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setError("");
      setErrorIssues(null);

      const currentPw = formData.currentPassword.trim();
      const newPw = formData.newPassword.trim();
      const confirmPw = formData.confirmNewPassword.trim();
      const anyPw = currentPw || newPw || confirmPw;
      const allPw = currentPw && newPw && confirmPw;

      if (anyPw && !allPw) {
        setError(
          "To change your password, fill in current password, new password, and confirmation.",
        );
        return;
      }

      if (allPw && newPw !== confirmPw) {
        setError("New password and confirmation do not match.");
        return;
      }

      if (!formData.country) {
        setError("Please select a country.");
        return;
      }

      setLoading(true);
      try {
        const profileResult = await updateProfile({
          username: formData.username.trim(),
          email: formData.email.trim(),
          country: formData.country,
        });

        if (!profileResult.ok) {
          setError(profileResult.message);
          setErrorIssues(mapApiErrorsToIssues(profileResult.errors));
          return;
        }

        let latestUser = profileResult.user;

        if (allPw) {
          const pwdResult = await changePassword({
            currentPassword: currentPw,
            newPassword: newPw,
            confirmNewPassword: confirmPw,
          });
          if (!pwdResult.ok) {
            setError(pwdResult.message);
            setErrorIssues(mapApiErrorsToIssues(pwdResult.errors));
            return;
          }
          latestUser = pwdResult.user ?? latestUser;
        }

        const synced = await refreshUser();
        if (!synced && latestUser && accessToken) {
          login(accessToken, latestUser);
        }

        navigate("/profile", { replace: true });
      } finally {
        setLoading(false);
      }
    },
    [accessToken, formData, login, navigate, refreshUser],
  );

  return {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
    errorIssues,
  };
}

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { ALLOWED_COUNTRIES } from "../../auth/utils/auth.validation";
import { changePassword, getProfile, updateProfile } from "../services/profile.service";

const emptyForm = {
  username: "",
  displayName: "",
  email: "",
  country: "",
  avatarURL: "",
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
 * @param {object | null} initialUser — profile from GET /api/profile
 */
export function useEditProfileForm(initialUser) {
  const navigate = useNavigate();
  const { accessToken, login } = useAuth();
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorIssues, setErrorIssues] = useState(null);

  useEffect(() => {
    if (!initialUser) {
      return;
    }
    const country = ALLOWED_COUNTRIES.includes(initialUser.profile?.country)
      ? initialUser.profile.country
      : "";
    setFormData({
      username: initialUser.username ?? "",
      displayName: initialUser.profile?.displayName ?? initialUser.username ?? "",
      email: initialUser.profile?.email ?? "",
      country,
      avatarURL: initialUser.profile?.avatarURL ?? "",
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

      if (!formData.country) {
        setError("Please select a country.");
        return;
      }

      setLoading(true);
      try {
        let latestUser = null;
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
          latestUser = pwdResult.user ?? null;
        }

        const profileResult = await updateProfile({
          username: formData.username.trim(),
          displayName: formData.displayName.trim(),
          email: formData.email.trim(),
          country: formData.country,
          avatarURL: formData.avatarURL.trim() || null,
        });

        if (!profileResult.ok) {
          setError(profileResult.message);
          setErrorIssues(mapApiErrorsToIssues(profileResult.errors));
          return;
        }

        latestUser = profileResult.user ?? latestUser;

        const synced = await getProfile();
        if (accessToken) {
          if (synced) {
            login(accessToken, synced);
          } else if (latestUser) {
            login(accessToken, latestUser);
          }
        }

        navigate("/profile", {
          replace: true,
          state: {
            successMessage: allPw
              ? "Profile and password updated successfully."
              : "Profile updated successfully.",
          },
        });
      } finally {
        setLoading(false);
      }
    },
    [accessToken, formData, login, navigate],
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

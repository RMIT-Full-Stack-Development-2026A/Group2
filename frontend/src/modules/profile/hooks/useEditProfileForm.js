import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ALLOWED_COUNTRIES } from "../../auth/utils/auth.validation";
import {
  changePassword,
  updateProfile,
  uploadProfileLogo,
} from "../services/profile.service";

const emptyForm = {
  username: "",
  displayName: "",
  email: "",
  country: "",
  avatarURL: "",
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

function buildProfilePayload(formData) {
  return {
    username: formData.username.trim(),
    displayName: formData.displayName.trim(),
    email: formData.email.trim(),
    country: formData.country,
    avatarURL: formData.avatarURL.trim() || null,
  };
}

/**
 * @param {object | null} initialUser — profile from GET /api/profile
 */
export function useEditProfileForm(initialUser) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState("");
  const [logoSuccess, setLogoSuccess] = useState("");
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
      newPassword: "",
      confirmNewPassword: "",
    });
    setError("");
    setErrorIssues(null);
    setLogoError("");
    setLogoSuccess("");
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

      const newPw = formData.newPassword.trim();
      const confirmPw = formData.confirmNewPassword.trim();
      const anyPw = newPw || confirmPw;

      if (anyPw && (!newPw || !confirmPw)) {
        setError(
          "To change your password, fill in both new password and confirmation.",
        );
        return;
      }

      if (!formData.country) {
        setError("Please select a country.");
        return;
      }

      setLoading(true);
      try {
        if (anyPw) {
          const pwdResult = await changePassword({
            newPassword: newPw,
            confirmNewPassword: confirmPw,
          });
          if (!pwdResult.ok) {
            setError(pwdResult.message);
            setErrorIssues(mapApiErrorsToIssues(pwdResult.errors));
            return;
          }
        }

        const profileResult = await updateProfile(buildProfilePayload(formData));

        if (!profileResult.ok) {
          setError(profileResult.message);
          setErrorIssues(mapApiErrorsToIssues(profileResult.errors));
          return;
        }

        navigate("/profile", {
          replace: true,
          state: {
            successMessage: anyPw
              ? "Profile and password updated successfully."
              : "Profile updated successfully.",
          },
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate],
  );

  async function handleLogoUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    setLogoError("");
    setLogoSuccess("");
    setLogoUploading(true);
    try {
      let result = await uploadProfileLogo(file);
      if (!result.ok && result.code === "PROFILE_NOT_FOUND") {
        if (
          !formData.username.trim() ||
          !formData.displayName.trim() ||
          !formData.email.trim() ||
          !formData.country
        ) {
          setLogoError(
            "Fill in username, display name, email, and country, then try uploading again.",
          );
          return;
        }

        const profileResult = await updateProfile(buildProfilePayload(formData));
        if (!profileResult.ok) {
          setLogoError(profileResult.message);
          return;
        }

        result = await uploadProfileLogo(file);
      }

      if (!result.ok) {
        setLogoError(result.message);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        avatarURL: result.user?.profile?.avatarURL ?? prev.avatarURL,
      }));
      setLogoSuccess("Logo uploaded successfully.");
    } finally {
      setLogoUploading(false);
    }
  }

  return {
    formData,
    handleChange,
    handleSubmit,
    handleLogoUpload,
    loading,
    logoUploading,
    logoError,
    logoSuccess,
    error,
    errorIssues,
  };
}

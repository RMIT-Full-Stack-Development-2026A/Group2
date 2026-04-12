import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service";
import { useAuth } from "./useAuth";
import { validateEmail } from "../utils/auth.validation";

export default function useLoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [errorIssues, setErrorIssues] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setErrorIssues(null);

    const id = formData.identifier.trim();
    if (id.includes("@")) {
      const emailErrs = validateEmail(id, "identifier");
      if (emailErrs.length) {
        setErrorIssues(emailErrs);
        return;
      }
    }

    try {
      const result = await loginUser({
        identifier: formData.identifier.trim(),
        password: formData.password,
      });

      login(result.accessToken, result.user);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.validationErrors?.length) {
        setErrorIssues(err.validationErrors);
        setError("");
      } else {
        setErrorIssues(null);
        setError(err.message);
      }
    }
  }

  return {
    formData,
    error,
    errorIssues,
    handleChange,
    handleSubmit,
  };
}

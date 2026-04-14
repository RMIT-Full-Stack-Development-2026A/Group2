import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth.service";
import { validateRegisterForm } from "../utils/auth.validation";

const initialForm = {
  username: "",
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
  country: "",
};

export default function useRegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [errorIssues, setErrorIssues] = useState(null);
  const [success, setSuccess] = useState("");

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
    setSuccess("");

    const clientErrors = validateRegisterForm(formData);
    if (clientErrors.length) {
      setErrorIssues(clientErrors);
      return;
    }

    try {
      await registerUser({
        username: formData.username.trim(),
        displayName: formData.displayName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        country: formData.country,
      });

      setSuccess("Register success");
      setTimeout(() => {
        navigate("/login");
      }, 800);
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
    success,
    handleChange,
    handleSubmit,
  };
}

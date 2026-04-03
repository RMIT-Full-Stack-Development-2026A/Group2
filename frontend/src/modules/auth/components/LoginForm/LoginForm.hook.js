import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth.service";

export default function useLoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

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

    try {
      const result = await loginUser(formData);
      localStorage.setItem("accessToken", result.accessToken);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return {
    formData,
    error,
    handleChange,
    handleSubmit,
  };
}
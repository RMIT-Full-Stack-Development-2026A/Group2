import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";

const initialForm = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  country: "",
};

export default function useRegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
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
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        country: formData.country,
      });

      setSuccess("Register success");
      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (err) {
      setError(err.message);
    }
  }

  return {
    formData,
    error,
    success,
    handleChange,
    handleSubmit,
  };
}
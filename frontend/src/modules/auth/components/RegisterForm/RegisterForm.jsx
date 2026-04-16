import { Link } from "react-router-dom";
import useRegisterForm from "../../hooks/useRegisterForm";
import FormErrorAlert from "../FormErrorAlert/FormErrorAlert";
import {
  ALLOWED_COUNTRIES,
  getPasswordRulesStatus,
  PASSWORD_HINT,
} from "../../utils/auth.validation";

export default function RegisterForm() {
  const { formData, error, errorIssues, success, handleChange, handleSubmit } =
    useRegisterForm();

  const passwordRules = getPasswordRulesStatus(formData.password);

  return (
    <div className="card shadow-sm border-0 rounded-4 p-4" style={{ width: "100%", maxWidth: "470px" }}>
      <div className="text-center mb-4">
        <div className="fs-2 mb-2">🎮</div>
        <h2 className="fw-bold mb-2">Create Account</h2>
        <p className="text-secondary mb-0">Join TicTacToang and start playing</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Username</label>
          <input
            type="text"
            name="username"
            className="form-control form-control-lg"
            placeholder="Letters, numbers, underscores"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input
            type="email"
            name="email"
            className="form-control form-control-lg"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Display Name</label>
          <input
            type="text"
            name="displayName"
            className="form-control form-control-lg"
            placeholder="Name displayed on your profile"
            value={formData.displayName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label className="form-label fw-semibold">Password</label>
          <input
            type="password"
            name="password"
            className="form-control form-control-lg"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="small mb-3">
          {passwordRules.map((rule) => (
            <div
              key={rule.label}
              className={rule.ok ? "text-success" : "text-secondary"}
            >
              <span className="me-1">{rule.ok ? "✓" : "○"}</span>
              {rule.label}
            </div>
          ))}
          <div className="text-muted mt-2 fst-italic">{PASSWORD_HINT}</div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-control form-control-lg"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Country</label>
          <select
            name="country"
            className="form-select form-select-lg"
            value={formData.country}
            onChange={handleChange}
            required
          >
            <option value="">Select country</option>
            {ALLOWED_COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <FormErrorAlert issues={errorIssues} message={error} />
        {success ? <div className="alert alert-success py-2">{success}</div> : null}

        <button type="submit" className="btn btn-primary btn-lg w-100">
          Register
        </button>

        <p className="text-center mt-4 mb-0 text-secondary">
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none fw-semibold">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
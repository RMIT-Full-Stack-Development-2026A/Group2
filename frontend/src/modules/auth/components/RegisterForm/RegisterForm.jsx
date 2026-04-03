import { Link } from "react-router-dom";
import useRegisterForm from "./RegisterForm.hook";

const countryOptions = ["Vietnam", "Australia", "USA"];

export default function RegisterForm() {
  const { formData, error, success, handleChange, handleSubmit } =
    useRegisterForm();

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

        <div className="small text-secondary mb-3">
          <div>× At least 8 characters</div>
          <div>× At least 1 number</div>
          <div>× At least 1 special character</div>
          <div>× At least 1 uppercase letter</div>
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
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {error ? <div className="alert alert-danger py-2">{error}</div> : null}
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
import { Link } from "react-router-dom";
import useLoginForm from "../../hooks/useLoginForm";
import FormErrorAlert from "../FormErrorAlert/FormErrorAlert";

export default function LoginForm() {
  const { formData, error, errorIssues, handleChange, handleSubmit } =
    useLoginForm();

  return (
    <div className="card shadow-sm border-0 rounded-4 p-4" style={{ width: "100%", maxWidth: "470px" }}>
      <div className="text-center mb-4">
        <div className="fs-2 mb-2">🎮</div>
        <h2 className="fw-bold mb-2">Welcome to TicTacToang</h2>
        <p className="text-secondary mb-0">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Username or Email</label>
          <input
            type="text"
            name="identifier"
            className="form-control form-control-lg"
            placeholder="Enter username or email"
            value={formData.identifier}
            onChange={handleChange}
            autoComplete="username"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Password</label>
          <input
            type="password"
            name="password"
            className="form-control form-control-lg"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </div>

        <FormErrorAlert issues={errorIssues} message={error} />

        <button type="submit" className="btn btn-primary btn-lg w-100">
          Sign In
        </button>

        <p className="text-center mt-4 mb-2 text-secondary">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-decoration-none fw-semibold">
            Register
          </Link>
        </p>

        <p className="text-center small text-secondary mb-0">
          Sign in with the <strong>username</strong> or <strong>email</strong> you used when you registered.
        </p>
      </form>
    </div>
  );
}

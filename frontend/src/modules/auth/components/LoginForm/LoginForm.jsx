import { Link } from "react-router-dom";
import useLoginForm from "./LoginForm.hook";

export default function LoginForm() {
  const { formData, error, handleChange, handleSubmit } = useLoginForm();

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
            type="email"
            name="email"
            className="form-control form-control-lg"
            placeholder="Enter username or email"
            value={formData.email}
            onChange={handleChange}
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
            required
          />
        </div>

        {error ? <div className="alert alert-danger py-2">{error}</div> : null}

        <button type="submit" className="btn btn-primary btn-lg w-100">
          Sign In
        </button>

        <p className="text-center mt-4 mb-2 text-secondary">
          Don't have an account?{" "}
          <Link to="/register" className="text-decoration-none fw-semibold">
            Register
          </Link>
        </p>

        <p className="text-center small text-secondary mb-0">
          Demo accounts: <strong>player1 / Player1!</strong> or <strong>admin / Admin1!</strong>
        </p>
      </form>
    </div>
  );
}
import { Link } from "react-router-dom";
import FormErrorAlert from "../../../auth/components/FormErrorAlert/FormErrorAlert";
import { ALLOWED_COUNTRIES } from "../../../auth/utils/auth.validation";
import { useEditProfileForm } from "../../hooks/useEditProfileForm";

/**
 * @param {{ initialUser: object | null }} props — null while parent loads profile
 */
export default function EditProfileForm({ initialUser }) {
  const { formData, handleChange, handleSubmit, loading, error, errorIssues } =
    useEditProfileForm(initialUser);

  if (!initialUser) {
    return <p className="text-secondary mb-0">Loading profile…</p>;
  }

  return (
    <div className="card shadow-sm border-secondary-subtle rounded-3 mx-auto profile-page-shell">
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="h4 fw-bold text-dark mb-0">Edit profile</h1>
          <Link to="/profile" className="btn btn-outline-secondary btn-sm">
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="edit-username" className="form-label fw-semibold">
              Username
            </label>
            <input
              id="edit-username"
              type="text"
              name="username"
              className="form-control"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="edit-display-name" className="form-label fw-semibold">
              Display Name
            </label>
            <input
              id="edit-display-name"
              type="text"
              name="displayName"
              className="form-control"
              value={formData.displayName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="edit-email" className="form-label fw-semibold">
              Email
            </label>
            <input
              id="edit-email"
              type="email"
              name="email"
              className="form-control"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="edit-avatar-url" className="form-label fw-semibold">
              Avatar URL
            </label>
            <input
              id="edit-avatar-url"
              type="url"
              name="avatarURL"
              className="form-control"
              value={formData.avatarURL}
              onChange={handleChange}
            />
            <small className="text-muted">
              Leave blank to remove your avatar.
            </small>
          </div>

          <div className="mb-4">
            <label htmlFor="edit-country" className="form-label fw-semibold">
              Country
            </label>
            <select
              id="edit-country"
              name="country"
              className="form-select"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">Select country</option>
              {ALLOWED_COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="border rounded-3 p-3 mb-4">
            <legend className=" w-auto px-1 fs-6 fw-semibold mb-3">
              Change password{" "}
              <span className="fw-normal text-secondary">(optional)</span>
            </legend>
            <p className="small text-muted mb-3">
              Leave fields blank to keep your current password.
            </p>
            <div className="mb-3">
              <label
                htmlFor="edit-current-password"
                className="form-label fw-semibold"
              >
                Current password
              </label>
              <input
                id="edit-current-password"
                type="password"
                name="currentPassword"
                className="form-control"
                autoComplete="current-password"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="edit-new-password"
                className="form-label fw-semibold"
              >
                New password
              </label>
              <input
                id="edit-new-password"
                type="password"
                name="newPassword"
                className="form-control"
                autoComplete="new-password"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>
            <div className="mb-0">
              <label
                htmlFor="edit-confirm-password"
                className="form-label fw-semibold"
              >
                Confirm new password
              </label>
              <input
                id="edit-confirm-password"
                type="password"
                name="confirmNewPassword"
                className="form-control"
                autoComplete="new-password"
                value={formData.confirmNewPassword}
                onChange={handleChange}
              />
            </div>
          </fieldset>

          <FormErrorAlert issues={errorIssues} message={error} />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

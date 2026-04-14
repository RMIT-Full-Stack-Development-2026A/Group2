import { Link } from "react-router-dom";
import { Folder, Hexagon, Pencil, Upload } from "lucide-react";
import { useProfileCard } from "../../hooks/useProfileCard";
import { formatMemberSince, getAvatarInitials } from "./ProfileCard.service";

export default function ProfileCard({ embedded = false }) {
  const { user, loading, error } = useProfileCard();

  const shell = (inner) =>
    embedded ? (
      inner
    ) : (
      <div className="card w-100 shadow-sm border border-secondary-subtle rounded-3">
        {inner}
      </div>
    );

  const bodyClass = embedded ? "p-0" : "card-body p-4";

  if (loading) {
    return shell(
      <div className={bodyClass}>
        <p className="text-secondary small mb-0">Loading…</p>
      </div>,
    );
  }

  if (error || !user) {
    return (
      <p className="text-danger mb-0" role="alert">
        {error ?? "Could not load profile."}
      </p>
    );
  }

  const initial = getAvatarInitials(user.displayName || user.username);
  const country = user.profile?.country?.trim() ? user.profile.country : "—";
  const memberSince = formatMemberSince(user.createdAt);
  const avatarSrc = user.profile?.avatarURL?.trim() ? user.profile.avatarURL : null;

  return shell(
    <div className={bodyClass}>
      <header className="d-flex align-items-center justify-content-between gap-3 mb-4">
        <h2 className="fs-3 fw-bold text-dark mb-0">User Information</h2>
        <Link
          to="/profile/edit"
          className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-2"
        >
          <Pencil size={16} strokeWidth={2} aria-hidden />
          Edit
        </Link>
      </header>

      <div className="d-flex flex-wrap align-items-start gap-4 mb-4">
        <div className="position-relative flex-shrink-0">
          <div
            className="profile-avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold overflow-hidden"
            aria-hidden={!!avatarSrc}
          >
            {avatarSrc ? (
              <img className="w-100 h-100 object-fit-cover" src={avatarSrc} alt="" />
            ) : (
              initial
            )}
          </div>
          <button
            type="button"
            className="profile-upload-overlay btn btn-light border border-secondary-subtle rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center text-secondary"
            disabled
            title="Avatar upload — coming soon"
            aria-label="Avatar upload — coming soon"
          >
            <Upload size={14} strokeWidth={2} aria-hidden />
          </button>
        </div>

        <div className="flex-grow-1 profile-identity-text">
          <p className="fs-5 fw-bold text-dark mb-1">
            {user.profile?.displayName || user.username}
          </p>
          <p className="text-secondary small mb-1">@{user.username}</p>
          <p className="text-secondary small mb-3">{user.profile?.email}</p>
          <div className="d-flex flex-wrap gap-2">
            <span className="badge rounded-pill bg-white text-dark border border-secondary-subtle d-inline-flex align-items-center gap-1 px-2 py-2 fw-semibold">
              <Hexagon size={14} strokeWidth={2} aria-hidden />
              {user.role}
            </span>
            <span className="badge rounded-pill bg-warning text-dark d-inline-flex align-items-center gap-1 px-2 py-2 fw-semibold">
              <Folder size={14} strokeWidth={2} aria-hidden />
              Premium
            </span>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 g-4 mb-4">
        <div className="col">
          <small className="text-muted d-block mb-1">Country</small>
          <div className="fw-semibold text-dark">{country}</div>
        </div>
        <div className="col">
          <small className="text-muted d-block mb-1">Member since</small>
          <div className="fw-semibold text-dark">{memberSince}</div>
        </div>
      </div>

      <p className="small text-muted border-top pt-3 mb-0">
        Avatar: Upload a square image (max 200x200px). It will be auto-resized.
      </p>
    </div>,
  );
}

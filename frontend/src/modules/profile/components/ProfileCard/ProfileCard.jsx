import { useRef } from "react";
import { Link } from "react-router-dom";
import { Folder, Hexagon, Pencil, Upload } from "lucide-react";
import { useProfileCard } from "../../hooks/useProfileCard";
import { formatMemberSince, getAvatarInitials } from "./ProfileCard.service";

export default function ProfileCard({ embedded = false }) {
  const logoInputRef = useRef(null);
  const {
    user,
    error,
    handleLogoUpload,
    uploadingLogo,
  } = useProfileCard();

  const shell = (inner) =>
    embedded ? (
      inner
    ) : (
      <div className="card w-100 shadow-sm border border-secondary-subtle rounded-3">
        {inner}
      </div>
    );

  const bodyClass = embedded ? "p-0" : "card-body p-4";

  const safeUser = user ?? {};
  const initial = getAvatarInitials(safeUser.displayName || safeUser.username || "U");
  const country = safeUser.profile?.country?.trim() ? safeUser.profile.country : "—";
  const memberSince = formatMemberSince(safeUser.createdAt);
  const avatarSrc = safeUser.profile?.avatarURL?.trim() ? safeUser.profile.avatarURL : null;
  const onLogoButtonClick = () => {
    logoInputRef.current?.click();
  };

  const onLogoFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    await handleLogoUpload(file);
  };

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
      {error ? (
        <p className="text-danger small mb-3" role="alert">
          {error}
        </p>
      ) : null}

      <div className="d-flex flex-wrap align-items-start gap-4 mb-4">
        <div className="position-relative flex-shrink-0">
          <div
            className="profile-avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold overflow-hidden"
            aria-hidden={!!avatarSrc}
          >
            {avatarSrc ? (
              <img
                className="w-100 h-100 object-fit-cover"
                src={avatarSrc}
                width="96"
                height="96"
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                alt=""
              />
            ) : (
              initial
            )}
          </div>
          <button
            type="button"
            className="profile-upload-overlay btn btn-light border border-secondary-subtle rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center text-secondary"
            onClick={onLogoButtonClick}
            disabled={uploadingLogo}
            title={uploadingLogo ? "Uploading logo..." : "Upload logo"}
            aria-label={uploadingLogo ? "Uploading logo..." : "Upload logo"}
          >
            <Upload size={14} strokeWidth={2} aria-hidden />
          </button>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="d-none"
            onChange={onLogoFileChange}
          />
        </div>

        <div className="flex-grow-1 profile-identity-text">
          <p className="fs-5 fw-bold text-dark mb-1">
            {safeUser.profile?.displayName || safeUser.username || "—"}
          </p>
          <p className="text-secondary small mb-1">username: {safeUser.username || "—"}</p>
          <p className="text-secondary small mb-3">email: {safeUser.profile?.email || "—"}</p>
          <div className="d-flex flex-wrap gap-2">
            <span className="badge rounded-pill bg-white text-dark border border-secondary-subtle d-inline-flex align-items-center gap-1 px-2 py-2 fw-semibold">
              <Hexagon size={14} strokeWidth={2} aria-hidden />
              {safeUser.role || "player"}
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

      
    </div>,
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditProfileForm from "../components/EditProfileForm/EditProfileForm";
import { getProfile } from "../services/profile.service";

export default function EditProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const user = await getProfile();
        if (!cancelled) {
          if (!user) {
            setLoadError("Could not load your profile. Try signing in again.");
          } else {
            setProfile(user);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto profile-page-shell">
        <div className="mb-3">
          <Link to="/profile" className="btn btn-outline-secondary btn-sm">
            Back to profile
          </Link>
        </div>
        <p className="text-secondary mb-0">Loading…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto profile-page-shell">
        <div className="alert alert-danger" role="alert">
          {loadError}
        </div>
        <Link to="/profile" className="btn btn-outline-secondary btn-sm">
          Back to profile
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto profile-page-shell">
      <EditProfileForm initialUser={profile} />
    </div>
  );
}

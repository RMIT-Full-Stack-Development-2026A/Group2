import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditProfileForm from "../components/EditProfileForm/EditProfileForm";
import { useAuth } from "../../auth/hooks/useAuth";

export default function EditProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (user?.profile) {
      setProfile(user);
      setLoading(false);
      setLoadError("");
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const nextUser = await refreshUser();
        if (!cancelled) {
          if (!nextUser) {
            setLoadError("Could not load your profile. Try signing in again.");
          } else {
            setProfile(nextUser);
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
  }, [refreshUser, user]);

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

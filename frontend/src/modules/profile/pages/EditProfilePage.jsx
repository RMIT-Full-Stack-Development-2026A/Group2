import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditProfileForm from "../components/EditProfileForm/EditProfileForm";
import { useAuth } from "../../auth/hooks/useAuth";
import { getProfile } from "../services/profile.service";
import "../styles/profile.css";

export default function EditProfilePage() {
  const { user } = useAuth();
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
        const nextUser = await getProfile();
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
  }, [user]);

  if (loading) {
    return (
      <div className="mx-auto profile-page-shell">
        <div className="mb-3">
          <Link to="/profile" className="btn btn-outline-secondary btn-sm">
            Back to profile
          </Link>
        </div>
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

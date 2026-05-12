import { Navigate, useLocation, useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import ProfileTabs from "../components/ProfileTabs/ProfileTabs";
import "../styles/profile.css";

export default function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const tabFromQuery = new URLSearchParams(location.search).get("tab");
  const successMessage = location.state?.successMessage ?? "";

  if (tabFromQuery === "history") {
    return <Navigate to="/profile/history" replace />;
  }

  function dismissSuccessMessage() {
    navigate(location.pathname, { replace: true, state: null });
  }

  function handleTabChange(tab) {
    if (tab === "history") {
      navigate("/profile/history");
    }
  }

  return (
    <div className="mx-auto w-100 profile-page-shell">
      {successMessage ? (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button
            type="button"
            className="btn-close"
            onClick={dismissSuccessMessage}
            aria-label="Close"
          />
        </div>
      ) : null}

      <div className="mb-3">
        <ProfileTabs active="profile" onChange={handleTabChange} />
      </div>

      <ProfileCard />
    </div>
  );
}

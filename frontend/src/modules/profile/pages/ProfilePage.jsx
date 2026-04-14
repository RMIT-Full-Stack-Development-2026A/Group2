import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameHistoryTable from "../components/GameHistoryTable/GameHistoryTable";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import ProfileTabs from "../components/ProfileTabs/ProfileTabs";

export default function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const successMessage = location.state?.successMessage ?? "";

  function dismissSuccessMessage() {
    navigate(location.pathname, { replace: true, state: null });
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
        <ProfileTabs active={activeTab} onChange={setActiveTab} />
      </div>

      <div className="card bg-white border border-secondary-subtle shadow-sm rounded-3">
        <div className="card-body p-4">
          {activeTab === "history" ? (
            <GameHistoryTable embedded />
          ) : (
            <ProfileCard embedded />
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import GameHistoryTable from "../components/GameHistoryTable/GameHistoryTable";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import ProfileTabs from "../components/ProfileTabs/ProfileTabs";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="mx-auto w-100 profile-page-shell">
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

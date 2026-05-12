import { useNavigate } from "react-router-dom";
import GameHistoryTable from "../components/GameHistoryTable/GameHistoryTable";
import ProfileTabs from "../components/ProfileTabs/ProfileTabs";
import "../styles/profile.css";

export default function GameHistoryPage() {
  const navigate = useNavigate();

  function handleTabChange(tab) {
    navigate(tab === "history" ? "/profile/history" : "/profile");
  }

  return (
    <div className="mx-auto w-100 profile-page-shell">
      <div className="mb-3">
        <ProfileTabs active="history" onChange={handleTabChange} />
      </div>

      <div className="card bg-white border border-secondary-subtle shadow-sm rounded-3">
        <div className="card-body p-4">
          <GameHistoryTable embedded />
        </div>
      </div>
    </div>
  );
}

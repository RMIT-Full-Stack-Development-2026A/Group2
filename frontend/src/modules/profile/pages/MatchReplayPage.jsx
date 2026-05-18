import { useNavigate, useParams } from "react-router-dom";
import MatchReplay from "../components/MatchReplay/MatchReplay";
import { useMatchReplay } from "../hooks/useMatchReplay";
import ProfileTabs from "../components/ProfileTabs/ProfileTabs";
import "../styles/profile.css";

export default function MatchReplayPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const {
    replayData,
    loading,
    error,
    currentMoveIndex,
    isPlaying,
    board,
    currentMove,
    totalMoves,
    handlePlayPause,
    handlePrevious,
    handleNext,
    handleSliderChange,
  } = useMatchReplay(sessionId);

  const handleTabChange = (tab) => {
    navigate(tab === "history" ? "/profile/history" : "/profile");
  };

  return (
    <div className="mx-auto w-100 profile-page-shell">
      <div className="mb-3">
        <ProfileTabs active="history" onChange={handleTabChange} />
      </div>

      <div className="card bg-white border border-secondary-subtle shadow-sm rounded-3">
        <div className="card-body p-0">
          {loading && (
            <div className="d-flex flex-column align-items-center justify-content-center py-5 p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 mb-0 text-muted">Loading replay...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger m-4" role="alert">
              {error || "Unable to load replay."}
            </div>
          )}

          {!loading && !error && replayData && (
            <MatchReplay
              replayData={replayData}
              board={board}
              currentMoveIndex={currentMoveIndex}
              isPlaying={isPlaying}
              currentMove={currentMove}
              totalMoves={totalMoves}
              onPlayPause={handlePlayPause}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSliderChange={handleSliderChange}
            />
          )}

          {!loading && !error && !replayData && (
            <div className="text-center py-5 text-secondary p-4">
              No replay data found for this session.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

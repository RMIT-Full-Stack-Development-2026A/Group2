import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Bot } from "lucide-react";
import useAIGameSetupForm from "./AIGameSetupForm.hook";
import { startAIGame } from "./AIGameSetupForm.service";
import DifficultySelector from "./sub-components/DifficultySelector";
import SetupPlayerPreviewCard from "../shared/SetupPlayerPreviewCard/SetupPlayerPreviewCard";
import SetupFirstPlayerSelector from "../shared/SetupFirstPlayerSelector/SetupFirstPlayerSelector";
import SetupBoardSizeSelector from "../shared/SetupBoardSizeSelector/SetupBoardSizeSelector";
import SetupBoardStyleSelector from "../shared/SetupBoardStyleSelector/SetupBoardStyleSelector";
import SetupMarkerSelector from "../shared/SetupMarkerSelector/SetupMarkerSelector";
import styles from "./AIGameSetupForm.module.css";

export default function AIGameSetupForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    difficulty,
    setDifficulty,
    firstPlayer,
    setFirstPlayer,
    boardSize,
    setBoardSize,
    boardStyle,
    setBoardStyle,
    playerMarker,
    setPlayerMarker,
    aiMarker,
    setAiMarker,
    customBoardImage,
    setCustomBoardImage,
    useCustomBoard,
    setUseCustomBoard,
    botName,
  } = useAIGameSetupForm();

  const handleStart = async () => {
    setSubmitError("");
    setSubmitting(true);

    try {
      const state = await startAIGame({
        username: user?.username,
        botName,
        firstPlayer,
        boardSize,
        boardStyle,
        playerMarker,
        aiMarker,
        difficulty,
        useCustomBoard,
        customBoardImage,
      });

      navigate("/game/play", {
        state,
      });
    } catch (error) {
      setSubmitError(
        error?.data?.message ||
          error?.message ||
          "Could not start the single-player game.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.shell}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              <Bot size={20} />
              Single Player Setup
            </h2>
            <p className={styles.subtitle}>Choose your AI opponent and settings</p>
          </div>

          <div className={styles.stack}>
            <DifficultySelector value={difficulty} onChange={setDifficulty} />

            <div className={styles.previewGrid}>
              <SetupPlayerPreviewCard
                name={user?.username}
                marker={playerMarker}
                avatarContent={user?.username?.charAt(0)?.toUpperCase()}
              />

              <div className={styles.botPreview}>
                <SetupPlayerPreviewCard
                  name={botName}
                  marker={aiMarker}
                  avatarContent={<Bot size={18} />}
                  subtitle=""
                  className={styles.botPreviewCard}
                />
                <span className={styles.badge}>{difficulty}</span>
              </div>
            </div>

            <SetupFirstPlayerSelector
              value={firstPlayer}
              onChange={setFirstPlayer}
              option1Value="player"
              option1Label="You"
              option2Value="ai"
              option2Label={botName}
            />

            <SetupBoardSizeSelector
              value={boardSize}
              onChange={setBoardSize}
              compact
              name="ai-board-size"
            />

            <SetupBoardStyleSelector
              boardStyle={boardStyle}
              setBoardStyle={setBoardStyle}
              customBoardImage={customBoardImage}
              setCustomBoardImage={setCustomBoardImage}
              useCustomBoard={useCustomBoard}
              setUseCustomBoard={setUseCustomBoard}
              compact
              customLabel="Custom"
              previewSize="sm"
            />

            <div className={styles.markerGrid}>
              <SetupMarkerSelector
                label="Your Marker"
                selectedMarker={playerMarker}
                onSelect={(marker) => {
                  setPlayerMarker(marker);
                  if (marker === aiMarker) setAiMarker("O");
                }}
              />
              <SetupMarkerSelector
                label="AI Marker"
                selectedMarker={aiMarker}
                blockedMarker={playerMarker}
                onSelect={setAiMarker}
              />
            </div>

            {submitError ? (
              <p className={styles.errorText}>{submitError}</p>
            ) : null}

            <button
              type="button"
              onClick={handleStart}
              className={styles.startButton}
              disabled={submitting}
            >
              {submitting ? "Starting..." : `Start Game vs ${botName}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
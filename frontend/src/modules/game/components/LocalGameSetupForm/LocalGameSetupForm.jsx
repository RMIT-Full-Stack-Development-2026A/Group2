import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useLocalGameSetupForm from "./LocalGameSetupForm.hook";
import { buildLocalGameNavigationState } from "./LocalGameSetupForm.service";
import SetupPlayerPreviewCard from "../shared/SetupPlayerPreviewCard/SetupPlayerPreviewCard";
import SetupFirstPlayerSelector from "../shared/SetupFirstPlayerSelector/SetupFirstPlayerSelector";
import SetupBoardSizeSelector from "../shared/SetupBoardSizeSelector/SetupBoardSizeSelector";
import SetupBoardStyleSelector from "../shared/SetupBoardStyleSelector/SetupBoardStyleSelector";
import SetupMarkerSelector from "../shared/SetupMarkerSelector/SetupMarkerSelector";
import styles from "./LocalGameSetupForm.module.css";

export default function LocalGameSetupForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    player2Name,
    setPlayer2Name,
    firstPlayer,
    setFirstPlayer,
    boardSize,
    setBoardSize,
    boardStyle,
    setBoardStyle,
    marker1,
    setMarker1,
    marker2,
    setMarker2,
    customBoardImage,
    setCustomBoardImage,
    useCustomBoard,
    setUseCustomBoard,
  } = useLocalGameSetupForm();

  const handleStart = () => {
    navigate("/game/play", {
      state: buildLocalGameNavigationState({
        username: user?.username,
        player2Name,
        firstPlayer,
        boardSize,
        boardStyle,
        marker1,
        marker2,
        useCustomBoard,
        customBoardImage,
      }),
    });
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.shell}>
          <div className={styles.header}>
            <h2 className={styles.title}>Local 2-Player Game Setup</h2>
            <p className={styles.subtitle}>Configure your match settings</p>
          </div>

          <div className={styles.stack}>
            <div className={styles.previewGrid}>
              <div className={styles.previewColumn}>
                <label className={styles.sectionLabel}>Player 1</label>
                <SetupPlayerPreviewCard
                  name={user?.username}
                  marker={marker1}
                  avatarContent={user?.username?.charAt(0)?.toUpperCase()}
                />
              </div>

              <div className={styles.previewColumn}>
                <label className={styles.sectionLabel}>Player 2</label>
                <input
                  className={styles.input}
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  placeholder="Enter name"
                />
                <SetupPlayerPreviewCard
                  name={player2Name || "Player 2"}
                  marker={marker2}
                  avatarContent={(player2Name || "P2").charAt(0).toUpperCase()}
                />
              </div>
            </div>

            <SetupFirstPlayerSelector
              value={firstPlayer}
              onChange={setFirstPlayer}
              option1Value="player1"
              option1Label={user?.username}
              option2Value="player2"
              option2Label={player2Name || "Player 2"}
            />

            <SetupBoardSizeSelector
              value={boardSize}
              onChange={setBoardSize}
              compact={false}
              name="local-board-size"
            />

            <SetupBoardStyleSelector
              boardStyle={boardStyle}
              setBoardStyle={setBoardStyle}
              customBoardImage={customBoardImage}
              setCustomBoardImage={setCustomBoardImage}
              useCustomBoard={useCustomBoard}
              setUseCustomBoard={setUseCustomBoard}
              compact={false}
              customLabel="Custom Board"
              previewSize="md"
            />

            <div className={styles.markerGrid}>
              <SetupMarkerSelector
                label="Player 1 Marker"
                selectedMarker={marker1}
                onSelect={(marker) => {
                  setMarker1(marker);
                  if (marker === marker2) setMarker2("O");
                }}
              />
              <SetupMarkerSelector
                label="Player 2 Marker"
                selectedMarker={marker2}
                blockedMarker={marker1}
                onSelect={setMarker2}
              />
            </div>

            <button
              type="button"
              onClick={handleStart}
              className={styles.startButton}
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
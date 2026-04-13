import { useLocation, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bot } from "lucide-react";
import GameChat from "@/components/GameChat";
import styles from "./GamePlayView.module.css";

import useGamePlayView from "./GamePlayView.hook";
import GameHeaderBar from "./sub-components/GameHeaderBar";
import PlayerStatusCard from "./sub-components/PlayerStatusCard";
import GameBoard from "./sub-components/GameBoard";
import WinnerDialog from "./sub-components/WinnerDialog";

export default function GamePlayView() {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state;

  if (!config) {
    return (
      <div className={styles.emptyState}>
        <p>No game configuration found.</p>
      </div>
    );
  }

  return <GamePlayViewContent config={config} navigate={navigate} />;
}

function GamePlayViewContent({ config, navigate }) {
  const {
    size,
    board,
    currentPlayer,
    winner,
    winningCells,
    aborted,
    elapsed,
    aiThinking,
    showWinnerModal,
    isPaused,
    startTime,
    setAborted,
    setIsPaused,
    setShowWinnerModal,
    resetGame,
    handleCellClick,
  } = useGamePlayView(config);

  const isOnline = config.gameType === "online";

  return (
    <div className={styles.root}>
      <GameHeaderBar
        gameType={config.gameType}
        boardSize={config.boardSize}
        aiDifficulty={config.aiDifficulty}
        elapsed={elapsed}
        winner={winner}
        aborted={aborted}
        isPaused={isPaused}
        onRestart={resetGame}
        onTogglePause={() => setIsPaused((prev) => !prev)}
        onAbort={() => setAborted(true)}
      />

      {aborted ? (
        <Alert variant="destructive">
          <AlertDescription>Game aborted. No result recorded.</AlertDescription>
        </Alert>
      ) : null}

      <div className={isOnline ? styles.mainOnline : styles.mainLocal}>
        <div className={styles.centerRow}>
          <PlayerStatusCard
            name={config.player1}
            marker={config.marker1}
            isActive={currentPlayer === 1 && !winner && !aborted}
            turnText="Your turn"
            avatarContent={config.player1.charAt(0).toUpperCase()}
          />

          <GameBoard
            board={board}
            size={size}
            boardStyle={config.boardStyle}
            customBoardImage={config.customBoardImage}
            winner={winner}
            aborted={aborted}
            isPaused={isPaused}
            winningCells={winningCells}
            onCellClick={handleCellClick}
          />

          <PlayerStatusCard
            name={config.player2}
            marker={config.marker2}
            isActive={currentPlayer === 2 && !winner && !aborted}
            turnText={aiThinking ? "Thinking..." : "Their turn"}
            avatarContent={
              config.gameType === "ai"
                ? <Bot className="h-5 w-5" />
                : config.player2.charAt(0).toUpperCase()
            }
          />
        </div>

        {isOnline ? (
          <div className={styles.chatPanel}>
            <GameChat currentUser={config.player1} opponent={config.player2} />
          </div>
        ) : null}
      </div>

      <p className={styles.startedText}>
        Started: {new Date(startTime.current).toLocaleTimeString()}
      </p>

      <WinnerDialog
        open={showWinnerModal}
        winner={winner}
        onOpenChange={setShowWinnerModal}
        onHistory={() => navigate("/profile?tab=history")}
        onPlayAgain={resetGame}
      />
    </div>
  );
}
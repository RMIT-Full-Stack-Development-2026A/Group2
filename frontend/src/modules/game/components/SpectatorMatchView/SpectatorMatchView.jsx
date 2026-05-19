import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import GameHeaderBar from "../GamePlayView/sub-components/GameHeaderBar";
import GameBoard from "../GamePlayView/sub-components/GameBoard";
import PlayerStatusCard from "../GamePlayView/sub-components/PlayerStatusCard";
import useSpectatorMatchView from "./SpectatorMatchView.hook";
import styles from "./SpectatorMatchView.module.css";

function getAvatarLabel(name, fallback) {
  return String(name || fallback || "?").charAt(0).toUpperCase();
}

function getResultText(gameState) {
  if (!gameState) return "";
  if (gameState.winner) return `${gameState.winner} wins.`;
  if (gameState.result === "draw") return "This match ended in a draw.";
  if (gameState.aborted) return "This match was aborted.";
  return "";
}

export default function SpectatorMatchView({ token }) {
  const navigate = useNavigate();
  const {
    match,
    config,
    gameState,
    loading,
    error,
    eventMessage,
    socketMessage,
    elapsed,
  } = useSpectatorMatchView(token);

  if (loading) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>Loading live match...</p>
      </div>
    );
  }

  if (error || !match || !config || !gameState) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>Match unavailable</p>
        <p className={styles.emptyText}>
          {error || "This spectator link is invalid, expired, or the match is no longer available."}
        </p>
        <button type="button" className={styles.primaryButton} onClick={() => navigate("/")}>
          Back Home
        </button>
      </div>
    );
  }

  const resultText = getResultText(gameState);
  const currentPlayer = gameState.currentPlayer;
  const isFrozen = !!eventMessage || gameState.sessionStatus === "finished" || gameState.aborted;

  return (
    <div className={styles.root}>
      <GameHeaderBar
        gameType="online"
        boardSize={gameState.size}
        elapsed={elapsed}
        winner={gameState.winner}
        aborted={gameState.aborted}
        isPaused={false}
        isSpectator
      />

      {eventMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{eventMessage}</AlertDescription>
        </Alert>
      ) : null}

      {socketMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{socketMessage}</AlertDescription>
        </Alert>
      ) : null}

      {resultText ? (
        <div className={styles.resultCard}>
          <p className={styles.resultKicker}>Match result</p>
          <p className={styles.resultText}>{resultText}</p>
        </div>
      ) : null}

      <div className={styles.matchShell}>
        <div className={styles.playerRail}>
          <PlayerStatusCard
            compact
            name={config.player1}
            marker={config.marker1}
            isActive={currentPlayer === 1 && !isFrozen}
            turnText="To move"
            avatarContent={getAvatarLabel(config.player1, "P1")}
          />
          <PlayerStatusCard
            compact
            name={config.player2}
            marker={config.marker2}
            isActive={currentPlayer === 2 && !isFrozen}
            turnText="To move"
            avatarContent={getAvatarLabel(config.player2, "P2")}
          />
        </div>

        <GameBoard
          board={gameState.board}
          size={gameState.size}
          boardStyle={config.boardStyle}
          customBoardImage={config.customBoardImage}
          winner={gameState.winner}
          aborted={gameState.aborted}
          isPaused={false}
          winningCells={gameState.winningCells}
          marker1={config.marker1}
          marker2={config.marker2}
          readOnly
        />
      </div>

      <p className={styles.startedText}>
        Room {config.roomCode} - Read-only spectator view
      </p>
    </div>
  );
}

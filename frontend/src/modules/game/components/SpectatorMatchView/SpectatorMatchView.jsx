import { useNavigate } from "react-router-dom";
import GameBoard from "../GamePlayView/sub-components/GameBoard";
import PlayerStatusCard from "../GamePlayView/sub-components/PlayerStatusCard";
import useSpectatorMatchView from "./SpectatorMatchView.hook";
import styles from "./SpectatorMatchView.module.css";

function getResultText(state, closedMessage) {
  if (closedMessage) return closedMessage;
  if (state.sessionStatus === "finished") {
    if (state.sessionResult === "draw") return "Match drawn.";
    return state.winner ? `${state.winner} wins.` : "Match finished.";
  }
  return state.currentPlayer === 1 ? "Player 1 turn" : "Player 2 turn";
}

export default function SpectatorMatchView() {
  const navigate = useNavigate();
  const { loading, error, closedMessage, config, state } =
    useSpectatorMatchView();

  if (loading) {
    return (
      <div className={styles.centerState}>
        <p className={styles.kicker}>Spectator mode</p>
        <h1 className={styles.title}>Loading live match...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.centerState}>
        <p className={styles.kicker}>Spectator mode</p>
        <h1 className={styles.title}>Match unavailable</h1>
        <p className={styles.description}>{error}</p>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => navigate("/")}
        >
          Return Home
        </button>
      </div>
    );
  }

  const isFrozen = Boolean(closedMessage) || state.sessionStatus === "finished";
  const player1Active = !isFrozen && state.currentPlayer === 1;
  const player2Active = !isFrozen && state.currentPlayer === 2;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Spectator mode</p>
          <h1 className={styles.title}>
            {config.player1} vs {config.player2}
          </h1>
        </div>
        <div className={styles.badges}>
          <span className={styles.badge}>LIVE</span>
          <span className={styles.badge}>
            {config.boardSize}x{config.boardSize}
          </span>
        </div>
      </div>

      <div className={styles.statusBand}>{getResultText(state, closedMessage)}</div>

      <div className={styles.matchLayout}>
        <div className={styles.players}>
          <PlayerStatusCard
            name={config.player1}
            marker={config.marker1}
            isActive={player1Active}
            turnText="Their turn"
            avatarContent={config.player1.charAt(0).toUpperCase()}
            avatarSrc={config.player1AvatarURL}
          />
          <PlayerStatusCard
            name={config.player2}
            marker={config.marker2}
            isActive={player2Active}
            turnText="Their turn"
            avatarContent={config.player2.charAt(0).toUpperCase()}
            avatarSrc={config.player2AvatarURL}
          />
        </div>

        <GameBoard
          board={state.board}
          size={state.size}
          boardStyle={config.boardStyle}
          customBoardImage={config.customBoardImage}
          winner={state.winner}
          aborted={true}
          isPaused={false}
          winningCells={state.winningCells}
          marker1={config.marker1}
          marker2={config.marker2}
          onCellClick={() => {}}
        />
      </div>
    </div>
  );
}

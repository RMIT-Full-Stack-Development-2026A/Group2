import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bot } from "lucide-react";
import GameChat from "@/components/GameChat";
import styles from "./GamePlayView.module.css";
import { useAuth } from "@/modules/auth/hooks/useAuth";

import useGamePlayView from "./GamePlayView.hook";
import GameHeaderBar from "./sub-components/GameHeaderBar";
import PlayerStatusCard from "./sub-components/PlayerStatusCard";
import GameBoard from "./sub-components/GameBoard";
import WinnerDialog from "./sub-components/WinnerDialog";
import LeaveGameDialog from "./sub-components/LeaveGameDialog";
import OnlineMatchResultDialog from "./sub-components/OnlineMatchResultDialog";
import OnlineRoomClosedDialog from "./sub-components/OnlineRoomClosedDialog";
import RematchRequestDialog from "./sub-components/RematchRequestDialog";
import RematchWaitingDialog from "./sub-components/RematchWaitingDialog";

export default function GamePlayView() {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state;

  if (!config) {
    return (
      <AppLayout>
        <div className={styles.emptyState}>
          <p>No game configuration found.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <GamePlayViewContent
      key={config.sessionId || config.roomCode}
      config={config}
      navigate={navigate}
    />
  );
}

function GamePlayViewContent({ config, navigate }) {
  const outletContext = useOutletContext();
  const registerNavigationGuard = outletContext?.registerNavigationGuard;
  const { logout } = useAuth();

  const {
    size,
    board,
    currentPlayer,
    winner,
    sessionResult,
    winningCells,
    aborted,
    elapsed,
    aiThinking,
    showWinnerModal,
    isPaused,
    startTime,
    apiError,
    onlineRoomClosed,
    rematchWaiting,
    incomingRematch,
    setAborted,
    setIsPaused,
    setShowWinnerModal,
    resetGame,
    handleCellClick,
    abortCurrentGame,
    requestOnlineRematch,
    respondOnlineRematch,
    leaveOnlineMatch,
  } = useGamePlayView(config);

  const isOnline = config.gameType === "online";
  const myRole = config.myRole;

  const myPlayerIndex = myRole === "player1" ? 1 : 2;
  const isMyTurn = currentPlayer === myPlayerIndex && !winner && !aborted;
  const isOpponentTurn = currentPlayer !== myPlayerIndex && !winner && !aborted;

  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [abortDialogOpen, setAbortDialogOpen] = useState(false);
  const pendingNavRef = useRef(null);

  const gameInProgress = isOnline ? !onlineRoomClosed : !winner && !aborted;

  const handleConfirmAbort = useCallback(async () => {
    setIsPaused(false);
    setPauseDialogOpen(false);
    setAbortDialogOpen(false);

    if (isOnline) {
      if (winner || showWinnerModal || rematchWaiting || incomingRematch) {
        respondOnlineRematch(false);
      } else {
        leaveOnlineMatch();
      }

      const dest = pendingNavRef.current;
      pendingNavRef.current = null;

      if (dest === "/logout") {
        await logout();
        navigate("/login", { replace: true });
        return;
      }

      navigate(dest || "/online", { replace: true });
      return;
    }

    await abortCurrentGame();

    setAborted(true);

    const dest = pendingNavRef.current;
    pendingNavRef.current = null;

    if (dest === "/logout") {
      await logout();
      navigate("/login", { replace: true });
      return;
    }

    if (dest) navigate(dest);
  }, [
    abortCurrentGame,
    incomingRematch,
    isOnline,
    leaveOnlineMatch,
    logout,
    navigate,
    rematchWaiting,
    respondOnlineRematch,
    setAborted,
    setIsPaused,
    showWinnerModal,
    winner,
  ]);

  const handleNavIntercept = useCallback(
    (to) => {
      if (gameInProgress) {
        pendingNavRef.current = to;
        setAbortDialogOpen(true);
        return true;
      }
      return false;
    },
    [gameInProgress],
  );

  const handlePauseAction = useCallback(() => {
    if (winner || aborted) return;
    if (isPaused) {
      setIsPaused(false);
      setPauseDialogOpen(false);
      return;
    }
    setIsPaused(true);
    setPauseDialogOpen(true);
  }, [winner, aborted, isPaused, setIsPaused]);

  useEffect(() => {
    if (typeof registerNavigationGuard !== "function") return undefined;

    registerNavigationGuard(handleNavIntercept);
    return () => {
      registerNavigationGuard(null);
    };
  }, [handleNavIntercept, registerNavigationGuard]);


  return (
    <AppLayout>
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
          onTogglePause={handlePauseAction}
          onAbort={() => setAbortDialogOpen(true)}
        />

        {aborted ? (
          <Alert variant="destructive">
            <AlertDescription>Game aborted. No result recorded.</AlertDescription>
          </Alert>
        ) : null}

        {apiError ? (
          <Alert variant="destructive">
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        ) : null}

        <div className={styles.mainLocal}>
          <div className={styles.centerRow}>
            {isOnline ? (
                <>
                  <div className={styles.onlinePlayerColumn}>
                    <PlayerStatusCard
                      name="You"
                      marker={myRole === "player1" ? config.marker1 : config.marker2}
                      isActive={isMyTurn}
                      turnText="Your turn"
                      avatarContent="Y"
                    />
                    <PlayerStatusCard
                      name="Opponent"
                      marker={myRole === "player1" ? config.marker2 : config.marker1}
                      isActive={isOpponentTurn}
                      turnText="Their turn"
                      avatarContent="O"
                    />
                  </div>

                  <GameBoard
                    board={board}
                    size={size}
                    boardStyle={config.boardStyle}
                    customBoardImage={config.customBoardImage}
                    winner={winner}
                    aborted={aborted}
                    isPaused={isPaused}
                    winningCells={winningCells}
                    marker1={config.marker1}
                    marker2={config.marker2}
                    onCellClick={handleCellClick}
                  />
                  
                </>
              ) : (
                <>
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
                    marker1={config.marker1}
                    marker2={config.marker2}
                    onCellClick={handleCellClick}
                  />
                  <PlayerStatusCard
                    name={config.player2}
                    marker={config.marker2}
                    isActive={(currentPlayer === 2 || aiThinking) && !winner && !aborted}
                    showTurnText={aiThinking}
                    turnText={aiThinking ? "Thinking..." : "Their turn"}
                    avatarContent={
                      config.gameType === "ai"
                        ? <Bot className="h-5 w-5" />
                        : config.player2.charAt(0).toUpperCase()
                    }
                  />
                </>
              )}
          </div>

          {isOnline ? (
            <div className={styles.chatPanel}>
              <GameChat roomCode={config.roomCode} disabled={!!onlineRoomClosed} />
            </div>
          ) : null}
        </div>

        <p className={styles.startedText}>
          Started: {new Date(startTime.current).toLocaleTimeString()}
        </p>

        {isOnline ? (
          <OnlineMatchResultDialog
            open={showWinnerModal}
            winner={winner}
            result={sessionResult}
            onPlayAgain={requestOnlineRematch}
            onLeaveRoom={() => {
              respondOnlineRematch(false);
              navigate("/online", { replace: true });
            }}
            onHistory={() => {
              respondOnlineRematch(false);
              navigate("/profile?tab=history");
            }}
          />
        ) : (
          <WinnerDialog
            open={showWinnerModal}
            winner={winner}
            onOpenChange={setShowWinnerModal}
            onHistory={() => navigate("/profile?tab=history")}
            onPlayAgain={resetGame}
          />
        )}

        <RematchWaitingDialog
          open={!!rematchWaiting}
          message={rematchWaiting}
          onLeaveRoom={() => {
            respondOnlineRematch(false);
            navigate("/online", { replace: true });
          }}
        />

        <RematchRequestDialog
          open={!!incomingRematch}
          opponentName={incomingRematch?.requestedByName}
          onAccept={() => respondOnlineRematch(true)}
          onDecline={() => {
            respondOnlineRematch(false);
            navigate("/online", { replace: true });
          }}
        />

        <OnlineRoomClosedDialog
          open={!!onlineRoomClosed}
          reason={onlineRoomClosed?.reason}
          message={onlineRoomClosed?.message}
          onReturn={() => navigate("/online", { replace: true })}
        />

        <LeaveGameDialog
          open={pauseDialogOpen}
          onClose={() => setPauseDialogOpen(false)}
          onConfirm={() => {
            setIsPaused(false);
            setPauseDialogOpen(false);
          }}
          kicker="Pause"
          title="Game Paused"
          description="Take a break. You can resume anytime."
          cancelText="Close"
          confirmText="Resume"
          confirmTone="primary"
        />

        <LeaveGameDialog
          open={abortDialogOpen}
          onClose={() => {
            setAbortDialogOpen(false);
            pendingNavRef.current = null;
          }}
          onConfirm={handleConfirmAbort}
          kicker="Confirm action"
          title={isOnline ? "Leave Online Room?" : "Abort Game?"}
          description={
            isOnline
              ? "This will close the online room for both players."
              : "This action cannot be undone. No result will be recorded."
          }
          cancelText="Cancel"
          confirmText={isOnline ? "Leave Room" : "Confirm Abort"}
        />
      </div>
    </AppLayout>
  );
}

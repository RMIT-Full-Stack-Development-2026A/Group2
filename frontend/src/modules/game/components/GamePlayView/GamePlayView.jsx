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
import OnlineRoomClosedDialog from "./sub-components/OnlineRoomClosedDialog";

import socket from "@/lib/socket";
import { getProfile } from "@/modules/profile/services/profile.service";

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

    return <GamePlayViewContent config={config} navigate={navigate} />;
}

function GamePlayViewContent({ config, navigate }) {
    const outletContext = useOutletContext();
    const registerNavigationGuard = outletContext?.registerNavigationGuard;
    const { logout, user } = useAuth();
    const [profileAvatarURL, setProfileAvatarURL] = useState("");

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
        apiError,
        setAborted,
        setIsPaused,
        setShowWinnerModal,
        showRoomClosedPopup,
        roomClosedReason,
        roomClosedMessage,
        resetGame,
        handleCellClick,
        abortCurrentGame,
    } = useGamePlayView(config);

    const isOnline = config.gameType === "online";
    const myRole = config.myRole;

    const myPlayerIndex = myRole === "player1" ? 1 : 2;
    const isMyTurn = currentPlayer === myPlayerIndex && !winner && !aborted;
    const isOpponentTurn =
        currentPlayer !== myPlayerIndex && !winner && !aborted;

    const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
    const [abortDialogOpen, setAbortDialogOpen] = useState(false);
    const pendingNavRef = useRef(null);

    const handleRoomClosedRedirect = useCallback(() => {
        try {
            socket.disconnect();
        } catch {
            // ignore
        }
        navigate("/online", { replace: true });
    }, [navigate]);

    const gameInProgress = !winner && !aborted;

    useEffect(() => {
        let active = true;

        getProfile()
            .then((profile) => {
                if (!active) return;
                setProfileAvatarURL(profile?.profile?.avatarURL || "");
            })
            .catch(() => {
                if (active) setProfileAvatarURL("");
            });

        return () => {
            active = false;
        };
    }, []);

    const onlineCurrentUserAvatarURL =
        myRole === "player1"
            ? config.player1AvatarURL || ""
            : config.player2AvatarURL || "";
    const currentUserAvatarURL =
        onlineCurrentUserAvatarURL ||
        profileAvatarURL ||
        user?.profile?.avatarURL ||
        user?.avatarURL ||
        "";
    const opponentAvatarURL =
        myRole === "player1"
            ? config.player2AvatarURL || ""
            : config.player1AvatarURL || "";

    const handleConfirmAbort = useCallback(async () => {
        setIsPaused(false);
        setPauseDialogOpen(false);
        setAbortDialogOpen(false);

        if (isOnline) {
            socket.emit("leaveOnlineMatch", {
                roomCode: config.roomCode,
                sessionId: config.sessionId,
            });
            socket.disconnect();
            navigate("/dashboard", { replace: true });
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
        config.roomCode,
        config.sessionId,
        isOnline,
        logout,
        navigate,
        setAborted,
        setIsPaused,
    ]);

    const handleRestartAction = useCallback(() => {
        if (isOnline) {
            socket.disconnect();
            navigate("/online");
            return;
        }

        resetGame();
    }, [isOnline, navigate, resetGame]);

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
                    onRestart={handleRestartAction}
                    onTogglePause={handlePauseAction}
                    onAbort={() => setAbortDialogOpen(true)}
                />

                {aborted ? (
                    <Alert variant="destructive">
                        <AlertDescription>
                            Game aborted. No result recorded.
                        </AlertDescription>
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
                                        marker={
                                            myRole === "player1"
                                                ? config.marker1
                                                : config.marker2
                                        }
                                        isActive={isMyTurn}
                                        turnText="Your turn"
                                        avatarContent="Y"
                                        avatarSrc={currentUserAvatarURL}
                                    />
                                    <PlayerStatusCard
                                        name="Opponent"
                                        marker={
                                            myRole === "player1"
                                                ? config.marker2
                                                : config.marker1
                                        }
                                        isActive={isOpponentTurn}
                                        turnText="Their turn"
                                        avatarContent="O"
                                        avatarSrc={opponentAvatarURL}
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
                                    isActive={
                                        currentPlayer === 1 &&
                                        !winner &&
                                        !aborted
                                    }
                                    turnText="Your turn"
                                    avatarContent={config.player1
                                        .charAt(0)
                                        .toUpperCase()}
                                    avatarSrc={currentUserAvatarURL}
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
                                    isActive={
                                        (currentPlayer === 2 || aiThinking) &&
                                        !winner &&
                                        !aborted
                                    }
                                    showTurnText={aiThinking}
                                    turnText={
                                        aiThinking
                                            ? "Thinking..."
                                            : "Their turn"
                                    }
                                    avatarContent={
                                        config.gameType === "ai" ? (
                                            <Bot className="h-5 w-5" />
                                        ) : (
                                            config.player2
                                                .charAt(0)
                                                .toUpperCase()
                                        )
                                    }
                                />
                            </>
                        )}
                    </div>

                    {isOnline ? (
                        <div className={styles.chatPanel}>
                            <GameChat roomCode={config.roomCode} />
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
                    onPlayAgain={
                        isOnline
                            ? () => {
                                  socket.disconnect();
                                  navigate("/online");
                              }
                            : resetGame
                    }
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
                    title="Abort Game?"
                    description="This action cannot be undone. No result will be recorded."
                    cancelText="Cancel"
                    confirmText="Confirm Abort"
                />

                <OnlineRoomClosedDialog
                    open={showRoomClosedPopup}
                    reason={roomClosedReason}
                    message={roomClosedMessage}
                    onReturn={handleRoomClosedRedirect}
                />
            </div>
        </AppLayout>
    );
}

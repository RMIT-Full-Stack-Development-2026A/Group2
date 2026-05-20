import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Copy, Check } from "lucide-react";
import socket from "@/lib/socket";
import useOnlineGameSetupForm from "./OnlineGameSetupForm.hook";
import {
    emitCreateRoom,
    emitJoinRoom,
    emitFindMatch,
    emitStartGame,
} from "./OnlineGameSetupForm.service";
import SetupBoardSizeSelector from "../shared/SetupBoardSizeSelector/SetupBoardSizeSelector";
import SetupBoardStyleSelector from "../shared/SetupBoardStyleSelector/SetupBoardStyleSelector";
import SetupMarkerSelector from "../shared/SetupMarkerSelector/SetupMarkerSelector";
import LeaveGameDialog from "../GamePlayView/sub-components/LeaveGameDialog";
import styles from "./OnlineGameSetupForm.module.css";

export default function OnlineGameSetupForm() {
    const outletContext = useOutletContext();
    const registerNavigationGuard = outletContext?.registerNavigationGuard;

    const {
        rooms,
        waiting,
        waitingRoomCode,
        showRoomClosedPopup,
        roomClosedMessage,
        waitForStart,
        preparingGame,
        setPreparingGame,
        joinCode,
        boardSize,
        boardStyle,
        customBoardImage,
        useCustomBoard,
        marker1,
        marker2,
        error,
        setJoinCode,
        setBoardSize,
        setBoardStyle,
        setCustomBoardImage,
        setUseCustomBoard,
        setMarker1,
        setMarker2,
        setShowRoomClosedPopup,
        setError,
    } = useOnlineGameSetupForm();

    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(3);
    const [setupMode, setSetupMode] = useState(false);
    const [createRoom, setCreateRoom] = useState(false);
    const [showLeaveWarning, setShowLeaveWarning] = useState(false);
    const [copied, setCopied] = useState(false);
    const pendingNavRef = useRef(null);

    const handleNavIntercept = useCallback(
        (to) => {
            if (waiting || waitForStart) {
                pendingNavRef.current = to;
                setShowLeaveWarning(true);
                return true;
            }
            return false;
        },
        [waiting, waitForStart],
    );

    useEffect(() => {
        if (typeof registerNavigationGuard !== "function") return undefined;
        registerNavigationGuard(handleNavIntercept);
        return () => { registerNavigationGuard(null); };
    }, [handleNavIntercept, registerNavigationGuard]);

    useEffect(() => {
        if (!preparingGame) return;
        setCountdown(3);
        const timer = setInterval(() => {
            setCountdown((c) => c - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [preparingGame]);

    useEffect(() => {
        if (!preparingGame || countdown > 0) return;
        navigate("/game/play", { state: preparingGame });
        setPreparingGame(null);
    }, [countdown, preparingGame, navigate, setPreparingGame]);

    function handleCreateRoom() {
        setError("");
        setCreateRoom(true);
        setSetupMode(true);
    }

    function handleFindMatch() {
        setError("");
        if (rooms.length > 0) {
            emitFindMatch({ boardStyle, marker1, customBoardImage, useCustomBoard });
        } else {
            setCreateRoom(true);
            setSetupMode(true);
        }
    }

    function handleConfirmSetup() {
        setError("");
        emitCreateRoom({ boardSize, boardStyle, marker1, customBoardImage, useCustomBoard });
        setSetupMode(false);
    }

    function handleJoinRoom() {
        if (!joinCode.trim()) { setError("Please enter a room code"); return; }
        setError("");
        emitJoinRoom(joinCode);
    }

    function handleJoinByCard(roomCode) {
        setError("");
        emitJoinRoom(roomCode);
    }

    function handleConfirmLeave() {
        socket.disconnect();
        setShowLeaveWarning(false);
        const dest = pendingNavRef.current;
        pendingNavRef.current = null;
        navigate(dest || "/dashboard");
    }

    function handleCopyCode(code) {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    // waiting room screen when player2 hasnt joined
    if (waiting) {
        return (
            <div className={styles.root}>
                <div className={styles.container}>
                    <div className={styles.waitingRoomShell}>
                        <h2 className={styles.waitingRoomTitle}>Waiting Room</h2>

                        <div className={styles.roomCodeRow}>
                            <span className={styles.roomCodeBadge}>{waitingRoomCode}</span>
                            <button
                                type="button"
                                className={styles.copyButton}
                                onClick={() => handleCopyCode(waitingRoomCode)}
                                title="Copy room code"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>

                        <div className={styles.roomInfoRow}>
                            <span>Board: {boardSize}×{boardSize}</span>
                            <span>Style: {boardStyle}</span>
                            <span>Marker: {marker1}</span>
                        </div>

                        <div className={styles.playerCardsRow}>
                            <div className={styles.playerCard}>
                                <div className={styles.playerAvatar} style={{ background: "#2563eb" }}>
                                    P
                                </div>
                                <p className={styles.playerName}>You</p>
                                <span className={styles.readyBadge}>Ready</span>
                            </div>
                            <div className={styles.playerCard}>
                                <div className={styles.playerAvatar} style={{ background: "#e2e8f0", color: "#94a3b8" }}>
                                    ?
                                </div>
                                <p className={styles.playerName}>Opponent</p>
                                <span className={styles.waitingBadge}>Waiting...</span>
                            </div>
                        </div>

                        <p className={styles.waitingText}>
                            Share your room code with a friend!
                        </p>
                    </div>
                </div>

                <LeaveGameDialog
                    open={showLeaveWarning}
                    onClose={() => {
                        setShowLeaveWarning(false);
                        pendingNavRef.current = null;
                    }}
                    onConfirm={handleConfirmLeave}
                    kicker="Leave Room"
                    title="Leave Room?"
                    description="If you leave, your room will be cancelled."
                    cancelText="Stay"
                    confirmText="Leave Room"
                />
            </div>
        );
    }

    // screen when player2 join and game is starting
    if (waitForStart) {
        const isPlayer2 = waitForStart.player2SocketId === socket.id;
        const player1Initial = waitForStart.player1Name.charAt(0).toUpperCase();
        const player2Initial = waitForStart.player2Name.charAt(0).toUpperCase();

        return (
            <div className={styles.root}>
                <div className={styles.container}>
                    <div className={styles.waitingRoomShell}>
                        <h2 className={styles.waitingRoomTitle}>Waiting Room</h2>

                        <div className={styles.roomCodeRow}>
                            <span className={styles.roomCodeBadge}>{waitForStart.roomCode}</span>
                            <button
                                type="button"
                                className={styles.copyButton}
                                onClick={() => handleCopyCode(waitForStart.roomCode)}
                                title="Copy room code"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>

                        <div className={styles.roomInfoRow}>
                            <span>Board: {waitForStart.boardSize}×{waitForStart.boardSize}</span>
                            <span>Style: {waitForStart.boardStyle}</span>
                            <span>Marker: {waitForStart.marker1}</span>
                        </div>

                        <div className={styles.playerCardsRow}>
                            <div className={styles.playerCard}>
                                <div className={styles.playerAvatar} style={{ background: "#2563eb" }}>
                                    {waitForStart.player1AvatarURL ? (
                                        <img
                                            src={waitForStart.player1AvatarURL}
                                            alt=""
                                            className={styles.playerAvatarImage}
                                        />
                                    ) : (
                                        player1Initial
                                    )}
                                </div>
                                <p className={styles.playerName}>{waitForStart.player1Name}</p>
                                <span className={styles.readyBadge}>Ready</span>
                            </div>
                            <div className={styles.playerCard}>
                                <div className={styles.playerAvatar} style={{ background: "#2563eb" }}>
                                    {waitForStart.player2AvatarURL ? (
                                        <img
                                            src={waitForStart.player2AvatarURL}
                                            alt=""
                                            className={styles.playerAvatarImage}
                                        />
                                    ) : (
                                        player2Initial
                                    )}
                                </div>
                                <p className={styles.playerName}>{waitForStart.player2Name}</p>
                                <span className={styles.readyBadge}>Joined!</span>
                            </div>
                        </div>

                        {!isPlayer2 && (
                            <p className={styles.bothReadyText}>
                                Opponent joined! Waiting for them to pick a marker...
                            </p>
                        )}

                        {isPlayer2 && (
                            <div className={styles.markerSelectionRow}>
                                <p className={styles.sectionLabel}>Choose Your Marker</p>
                                <SetupMarkerSelector
                                    label="Your Marker"
                                    selectedMarker={marker2}
                                    blockedMarker={waitForStart.marker1}
                                    onSelect={(marker) => {
                                        setMarker2(marker);
                                        emitStartGame({
                                            roomCode: waitForStart.roomCode,
                                            marker2: marker,
                                        });
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <LeaveGameDialog
                    open={showLeaveWarning}
                    onClose={() => {
                        setShowLeaveWarning(false);
                        pendingNavRef.current = null;
                    }}
                    onConfirm={handleConfirmLeave}
                    kicker="Leave Room"
                    title="Leave Room?"
                    description="If you leave, your room will be cancelled and your opponent will be notified."
                    cancelText="Stay"
                    confirmText="Leave Room"
                />
            </div>
        );
    }

    // room create screen
    if (setupMode) {
        return (
            <div className={styles.root}>
                <div className={styles.container}>
                    <div className={styles.shell}>
                        <div className={styles.header}>
                            <h2 className={styles.title}>
                                {createRoom ? "Create Room" : "Find Match"}
                            </h2>
                            <p className={styles.subtitle}>Configure your game settings</p>
                        </div>

                        <div className={styles.stack}>
                            {error && <p className={styles.errorText}>{error}</p>}

                            <SetupBoardSizeSelector
                                value={boardSize}
                                onChange={setBoardSize}
                                compact={false}
                                name="online-board-size"
                            />

                            <SetupBoardStyleSelector
                                boardStyle={boardStyle}
                                setBoardStyle={setBoardStyle}
                                customBoardImage={customBoardImage}
                                setCustomBoardImage={setCustomBoardImage}
                                useCustomBoard={useCustomBoard}
                                setUseCustomBoard={setUseCustomBoard}
                                compact={false}
                            />

                            <div className={styles.markerGrid}>
                                <SetupMarkerSelector
                                    label="Your Marker"
                                    selectedMarker={marker1}
                                    onSelect={setMarker1}
                                />
                            </div>

                            <button
                                type="button"
                                className={styles.startButtonFull}
                                onClick={handleConfirmSetup}
                            >
                                {createRoom ? "Create Room" : "Find Match"}
                            </button>

                            <button
                                type="button"
                                className={styles.backButton}
                                onClick={() => setSetupMode(false)}
                            >
                                ← Back to Arena
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // online arena main screen
    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.shell}>
                    <div className={styles.arenaHeader}>
                        <div>
                            <h2 className={styles.title}>Online Arena</h2>
                            <p className={styles.subtitle}>Create or join a game room</p>
                        </div>
                        <div className={styles.arenaHeaderButtons}>
                            <button type="button" className={styles.secondaryButton} onClick={handleFindMatch}>
                                 Find Match
                            </button>
                            <button type="button" className={styles.startButton} onClick={handleCreateRoom}>
                                + Create Room
                            </button>
                        </div>
                    </div>

                    {error && <p className={styles.errorText}>{error}</p>}

                    {showRoomClosedPopup && (
                        <>
                            <div className="modal fade show" style={{ display: "block" }} tabIndex={-1} role="dialog" aria-modal="true">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Room Closed</h5>
                                            <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowRoomClosedPopup(false)} />
                                        </div>
                                        <div className="modal-body">
                                            <p>{roomClosedMessage}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-backdrop fade show" />
                        </>
                    )}

                    <div className={styles.joinRow}>
                        <input
                            className={styles.input}
                            placeholder="Enter room code to join..."
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            maxLength={6}
                        />
                        <button type="button" className={styles.joinButton} onClick={handleJoinRoom}>
                            Join
                        </button>
                    </div>

                    <div className={styles.roomsPanel}>
                        <p className={styles.sectionLabel}>Open Rooms ({rooms.length})</p>
                        {rooms.length === 0 ? (
                            <p className={styles.emptyRooms}>No open rooms yet. Create one or find a match!</p>
                        ) : (
                            <div className={styles.roomList}>
                                {rooms.map((room) => (
                                    <div key={room.roomCode} className={styles.roomCard}>
                                        <div className={styles.roomCardLeft}>
                                            <strong className={styles.roomCardCode}>{room.roomCode}</strong>
                                            <div className={styles.roomCardMeta}>
                                                <span className={styles.waitingTag}>waiting</span>
                                                <span className={styles.roomCardSize}>{room.boardSize}×{room.boardSize}</span>
                                                <span className={styles.roomCardSize}>{room.boardStyle}</span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.roomCardJoinBtn}
                                            onClick={() => handleJoinByCard(room.roomCode)}
                                        >
                                            Join
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {preparingGame && (
                <>
                    <div className="modal fade show d-flex align-items-center justify-content-center" style={{ display: "block", zIndex: 9999 }} tabIndex={-1} role="dialog" aria-modal="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Preparing Game</h5>
                                </div>
                                <div className="modal-body text-center">
                                    <p className="mb-3">The game is being prepared.</p>
                                    <p className="display-4 fw-bold text-primary mb-0">{countdown}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" style={{ zIndex: 9998 }} />
                </>
            )}
        </div>
    );
}

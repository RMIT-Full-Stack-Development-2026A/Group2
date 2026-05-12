import useOnlineGameSetupForm from "./OnlineGameSetupForm.hook";
import {
    emitCreateRoom,
    emitJoinRoom,
    emitFindMatch,
} from "./OnlineGameSetupForm.service";
import SetupBoardSizeSelector from "../shared/SetupBoardSizeSelector/SetupBoardSizeSelector";
import SetupBoardStyleSelector from "../shared/SetupBoardStyleSelector/SetupBoardStyleSelector";
import SetupMarkerSelector from "../shared/SetupMarkerSelector/SetupMarkerSelector";
import styles from "./OnlineGameSetupForm.module.css";

export default function OnlineGameSetupForm() {
    const {
        rooms,
        waiting,
        waitingRoomCode,
        showRoomClosedPopup,
        roomClosedMessage,
        joinCode,
        boardSize,
        boardStyle,
        marker1,
        marker2,
        error,
        setJoinCode,
        setBoardSize,
        setBoardStyle,
        setMarker1,
        setMarker2,
        setShowRoomClosedPopup,
        setError,
    } = useOnlineGameSetupForm();

    function handleCreateRoom() {
        setError("");
        emitCreateRoom({ boardSize, boardStyle, marker1, marker2 });
    }

    function handleJoinRoom() {
        if (!joinCode.trim()) {
            setError("Please enter a room code");
            return;
        }
        setError("");
        emitJoinRoom(joinCode);
    }

    function handleJoinByCard(roomCode) {
        setError("");
        emitJoinRoom(roomCode);
    }

    function handleFindMatch() {
        setError("");
        emitFindMatch({ boardSize, boardStyle, marker1, marker2 });
    }

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.shell}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>Online Arena</h2>
                        <p className={styles.subtitle}>
                            Create or join a game room
                        </p>
                    </div>

                    <div className={styles.stack}>
                        {waiting && (
                            <div className={styles.waitingBanner}>
                                <p>Waiting for opponent...</p>
                                <p>
                                    Room code:{" "}
                                    <strong>{waitingRoomCode}</strong>
                                </p>
                                <small>Share this code with a friend!</small>
                            </div>
                        )}

                        {error && <p className={styles.errorText}>{error}</p>}

                        {showRoomClosedPopup && (
                            <>
                                <div
                                    className="modal fade show"
                                    style={{ display: "block" }}
                                    tabIndex={-1}
                                    role="dialog"
                                    aria-modal="true"
                                >
                                    <div
                                        className="modal-dialog modal-dialog-centered"
                                        role="document"
                                    >
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">
                                                    Room Closed
                                                </h5>
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    aria-label="Close"
                                                    onClick={() =>
                                                        setShowRoomClosedPopup(
                                                            false,
                                                        )
                                                    }
                                                />
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
                        <div className={styles.actionRow}>
                            <button
                                type="button"
                                className={styles.startButton}
                                onClick={handleFindMatch}
                            >
                                🎮 Find Match
                            </button>
                            <button
                                type="button"
                                className={styles.secondaryButton}
                                onClick={handleCreateRoom}
                            >
                                ➕ Create Room
                            </button>
                        </div>

                        <div className={styles.joinRow}>
                            <input
                                className={styles.input}
                                placeholder="Enter room code"
                                value={joinCode}
                                onChange={(e) =>
                                    setJoinCode(e.target.value.toUpperCase())
                                }
                                maxLength={6}
                            />
                            <button
                                type="button"
                                className={styles.secondaryButton}
                                onClick={handleJoinRoom}
                            >
                                Join
                            </button>
                        </div>

                        <SetupBoardSizeSelector
                            value={boardSize}
                            onChange={setBoardSize}
                            compact={false}
                            name="online-board-size"
                        />

                        <SetupBoardStyleSelector
                            boardStyle={boardStyle}
                            setBoardStyle={setBoardStyle}
                            compact={false}
                        />

                        <div className={styles.markerGrid}>
                            <SetupMarkerSelector
                                label="Your Marker"
                                selectedMarker={marker1}
                                onSelect={(marker) => {
                                    setMarker1(marker);
                                    if (marker === marker2) setMarker2("O");
                                }}
                            />
                            <SetupMarkerSelector
                                label="Opponent Marker"
                                selectedMarker={marker2}
                                blockedMarker={marker1}
                                onSelect={setMarker2}
                            />
                        </div>

                        <div>
                            <h5 className={styles.sectionLabel}>
                                Open Rooms ({rooms.length})
                            </h5>
                            {rooms.length === 0 ? (
                                <p className={styles.subtitle}>
                                    No open rooms yet. Create one!
                                </p>
                            ) : (
                                <div className={styles.roomList}>
                                    {rooms.map((room) => (
                                        <div
                                            key={room.roomCode}
                                            className={styles.roomCard}
                                        >
                                            <div>
                                                <strong>{room.roomCode}</strong>
                                                <span
                                                    className={styles.subtitle}
                                                >
                                                    {" "}
                                                    · {room.boardSize}×
                                                    {room.boardSize} ·{" "}
                                                    {room.boardStyle}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                className={
                                                    styles.secondaryButton
                                                }
                                                onClick={() =>
                                                    handleJoinByCard(
                                                        room.roomCode,
                                                    )
                                                }
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
            </div>
        </div>
    );
}

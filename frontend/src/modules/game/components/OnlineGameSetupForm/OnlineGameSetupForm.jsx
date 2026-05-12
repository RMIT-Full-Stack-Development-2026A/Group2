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
import styles from "./OnlineGameSetupForm.module.css";

export default function OnlineGameSetupForm() {
  const {
    rooms,
    waiting, 
    waitingRoomCode,
    waitForStart,
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
    setError,
  } = useOnlineGameSetupForm();

  console.log("waitForStart state:", waitForStart);

  function handleCreateRoom() {
    setError("");
    emitCreateRoom({ boardSize, boardStyle, marker1 });
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

  function handleFindMatch() {
    setError("");
    emitFindMatch({ boardSize, boardStyle, marker1 });
  }

  if (waitForStart) {
    const isPlayer2 = waitForStart.player2SocketId === socket.id;

    return (
      <div className={styles.root}>
        <div className={styles.container}>
          <div className={styles.shell}>
            <div className={styles.header}>
              <h2 className={styles.title}>
                {isPlayer2 ? "Choose Your Marker" : "Opponent Joined!"}
              </h2>
              <p className={styles.subtitle}>
                {isPlayer2
                  ? `${waitForStart.player1Name} is playing as ${waitForStart.marker1}`
                  : `${waitForStart.player2Name} has joined! Waiting for them to pick a marker...`}
              </p>
            </div>

            {isPlayer2 && (
              <div className={styles.stack}>
                <SetupMarkerSelector
                  label="Your Marker"
                  selectedMarker={marker2}
                  blockedMarker={waitForStart.marker1}
                  onSelect={(marker) => {
                    setMarker2(marker);
                    emitStartGame({ roomCode: waitForStart.roomCode, marker2: marker });
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.shell}>
          <div className={styles.header}>
            <h2 className={styles.title}>Online Arena</h2>
            <p className={styles.subtitle}>Create or join a game room</p>
          </div>

          <div className={styles.stack}>
            {waiting && (
              <div className={styles.waitingBanner}>
                <p>Waiting for opponent...</p>
                <p>Room code: <strong>{waitingRoomCode}</strong></p>
                <small>Share this code with a friend!</small>
              </div>
            )}

            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.actionRow}>
              <button type="button" className={styles.startButton} onClick={handleFindMatch}>
                🎮 Find Match
              </button>
              <button type="button" className={styles.secondaryButton} onClick={handleCreateRoom}>
                ➕ Create Room
              </button>
            </div>

            <div className={styles.joinRow}>
              <input
                className={styles.input}
                placeholder="Enter room code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
              <button type="button" className={styles.secondaryButton} onClick={handleJoinRoom}>
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
                onSelect={setMarker1}
              />
            </div>

            <div>
              <h5 className={styles.sectionLabel}>Open Rooms ({rooms.length})</h5>
              {rooms.length === 0 ? (
                <p className={styles.subtitle}>No open rooms yet. Create one!</p>
              ) : (
                <div className={styles.roomList}>
                  {rooms.map((room) => (
                    <div key={room.roomCode} className={styles.roomCard}>
                      <div>
                        <strong>{room.roomCode}</strong>
                        <span className={styles.subtitle}>
                          {" "}· {room.boardSize}×{room.boardSize} · {room.boardStyle}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={styles.secondaryButton}
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
      </div>
    </div>
  );
}
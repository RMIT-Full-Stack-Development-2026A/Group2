import useGameSetupPanel from "../../hooks/useGameSetupPanel";
import BoardSizePicker from "./sub-components/BoardSizePicker";
import BoardStylePicker from "./sub-components/BoardStylePicker";
import PlayerCard from "./sub-components/PlayerCard";
import MarkerPicker from "./sub-components/MarkerPicker";


export default function LocalGameSetupPanel({onStart}) {
  const {
    player1, player2, firstTurn,
    boardSize, boardStyle,
    player1Marker, player2Marker,
    error, isLoading,
    handlePlayer2NameChange,
    handleFirstTurn,
    handleBoardSize,
    handleBoardStyle,
    handleMarkerChange,
    handleGameStart,
  } = useGameSetupPanel(onStart);

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20}}>
      <h2>Local 2-Player Game Setup</h2>
      <p style={{ color: "gray" }}>Configure your match settings</p>

      <div style={{ display: "flex", gap: 40, marginTop: 30 }}>
        <div style={{ flex: 1 }}>
          <h5>Player 1</h5>
          <PlayerCard name={player1} marker={player1Marker} />
        </div>
        <div style={{ flex: 1 }}>
          <h5>Player 2</h5>
          <input type="text" placeholder="Enter name" value={player2}
            onChange={handlePlayer2NameChange} 
            style={{ width: "100%", padding: "10px 12px",
              border: "1px solid #ccc", borderRadius: 8,
              marginBottom: 8, fontSize: 14 }}
          />
          {player2 && <PlayerCard name={player2} marker={player2Marker} />}
          {error && <p style={{ color: "red", fontSize: 13, marginTop: 4 }}>{error}</p>}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <label style={{ fontWeight: 600 }}>Who goes first?</label>
        <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <input type="radio" name="firstTurn"
              checked={firstTurn === 1}
              onChange={() => handleFirstTurn(1)} />
            {player1}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <input type="radio" name="firstTurn"
              checked={firstTurn === 2}
              onChange={() => handleFirstTurn(2)} />
            {player2 || "Player2"}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <label style={{ fontWeight: 600 }}>Board Size</label>
        <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
          <BoardSizePicker boardSize={boardSize} onSizeChange={handleBoardSize}/>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <label style={{ fontWeight: 600 }}>Board Style</label>
        <BoardStylePicker boardStyle={boardStyle} onStyleChange={handleBoardStyle}/>
      </div>

      <div style={{ display: "flex", gap: 24, marginTop: 24 }}>
        <MarkerPicker
          label="Player 1 Marker"
          selectedMarker={player1Marker}
          otherMarker={player2Marker}
          onMarkerChange={(m) => handleMarkerChange(1, m)}
        />
        <MarkerPicker
          label="Player 2 Marker"
          selectedMarker={player2Marker}
          otherMarker={player1Marker}
          onMarkerChange={(m) => handleMarkerChange(2, m)}
        />
      </div>

      <button
        onClick={handleGameStart}
        disabled={isLoading}
        style={{
          width: "100%", padding: "14px", marginTop: 32,
          background: "#3b82f6", color: "#fff", border: "none",
          borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: "pointer",
        }}>
        Start Game
      </button>
    </div>
  );
}
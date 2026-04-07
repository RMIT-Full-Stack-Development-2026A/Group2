import useGameSetupPanel from "../../hooks/useGameSetupPanel";

const markers = ["X", "O", "△", "□", "☆", "♦"];

const boardStyles = [
  { id: "classic", name: "Classic", desc: "White background, black lines" },
  { id: "wood", name: "Wood", desc: "Warm wooden texture feel" },
  { id: "dark", name: "Dark", desc: "Dark background, light lines" },
];

export default function GameSetupPanel() {
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
  } = useGameSetupPanel();

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20}}>
      <h2>Local 2-Player Game Setup</h2>
      <p style={{ color: "gray" }}>Configure your match settings</p>

      <div style={{ display: "flex", gap: 40, marginTop: 30}}>
        <div style={{ flex: 1 }}>
          <h5>Player 1</h5>
          <div style={{ display: "flex", alignItems: "center", gap: 8,
            border: "1px solid #ccc", borderRadius: 8, padding: 12, marginTop: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%",
              background: "#3b82f6", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700 }}>
              P
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>{player1}</div>
              <div style={{ fontSize: 12, color: "#666" }}>Marker: {player1Marker}</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h5>Player 2</h5>
          <input
            type="text"
            placeholder="Enter name"
            value={player2}
            onChange={handlePlayer2NameChange}
            style={{ width: "100%", padding: "10px 12px",
              border: "1px solid #ccc", borderRadius: 8,
              marginTop: 8, fontSize: 14 }}
          />
          {player2 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8,
              border: "1px solid #ccc", borderRadius: 8, padding: 12, marginTop: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%",
                background: "#e5e7eb", color: "#333",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700 }}>
                P
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{player2}</div>
                <div style={{ fontSize: 12, color: "#666" }}>Marker: {player2Marker}</div>
              </div>
            </div>
          )}
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
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <input type="radio" name="boardSize"
              checked={boardSize === 10}
              onChange={() => handleBoardSize(10)} />
            10×10 (Standard)
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <input type="radio" name="boardSize"
              checked={boardSize === 15}
              onChange={() => handleBoardSize(15)} />
            15×15 (Advanced)
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <label style={{ fontWeight: 600 }}>Board Style</label>
        <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
          {boardStyles.map(s => (
            <div key={s.id}
              onClick={() => handleBoardStyle(s.id)}
              style={{
                padding: 12, borderRadius: 8, cursor: "pointer", width: 130,
                border: boardStyle === s.id ? "2px solid #3b82f6" : "1px solid #ccc",
                background: boardStyle === s.id ? "#eff6ff" : "#fff",
              }}>
              <div style={{ fontWeight: 600 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, marginTop: 24 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontWeight: 600 }}>Player 1 Marker</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {markers.filter(m => m !== player2Marker).map(m => (
              <button key={m}
                onClick={() => handleMarkerChange(1, m)}
                style={{
                  width: 40, height: 40, borderRadius: 8, border: "none",
                  cursor: "pointer", fontSize: 16, fontWeight: 700,
                  background: player1Marker === m ? "#3b82f6" : "#e5e7eb",
                  color: player1Marker === m ? "#fff" : "#333",
                }}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ fontWeight: 600 }}>Player 2 Marker</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {markers.filter(m => m !== player1Marker).map(m => (
              <button key={m}
                onClick={() => handleMarkerChange(2, m)}
                style={{
                  width: 40, height: 40, borderRadius: 8, border: "none",
                  cursor: "pointer", fontSize: 16, fontWeight: 700,
                  background: player2Marker === m ? "#3b82f6" : "#e5e7eb",
                  color: player2Marker === m ? "#fff" : "#333",
                }}>
                {m}
              </button>
            ))}
          </div>
        </div>
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
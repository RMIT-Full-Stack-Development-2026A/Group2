
export default function BoardHeader({ player1, player2, currentPlayer}) {

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 12 }}>
      
     
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        padding: "12px 20px", borderRadius: 12, border: "2px solid",
        borderColor: currentPlayer === 1 ? "#3b82f6" : "#e2e8f0",
        boxShadow: currentPlayer === 1 ? "0 0 0 3px rgba(59,130,246,0.2)" : "none",
        transition: "all 0.3s",
        minWidth: 100,
      }}>
        
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: currentPlayer === 1 ? "#3b82f6" : "#e2e8f0",
          color: currentPlayer === 1 ? "#fff" : "#999",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 18,
          transition: "all 0.3s",
        }}>
          {player1?.charAt(0).toUpperCase()}
        </div>
        {/* Name */}
        <div style={{ fontWeight: 600, fontSize: 14, color: currentPlayer === 1 ? "#3b82f6" : "#999" }}>
          {player1}
        </div>
        {/* Turn label */}
        {currentPlayer === 1 && (
          <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600, letterSpacing: "0.05em" }}>
            YOUR TURN
          </div>
        )}
      </div>

     
      <div style={{ fontWeight: 700, color: "#999", fontSize: 14 }}>VS</div>

      
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        padding: "12px 20px", borderRadius: 12, border: "2px solid",
        borderColor: currentPlayer === 2 ? "#3b82f6" : "#e2e8f0",
        boxShadow: currentPlayer === 2 ? "0 0 0 3px rgba(59,130,246,0.2)" : "none",
        transition: "all 0.3s",
        minWidth: 100,
      }}>
        {/* Avatar */}
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: currentPlayer === 2 ? "#3b82f6" : "#e2e8f0",
          color: currentPlayer === 2 ? "#fff" : "#999",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 18,
          transition: "all 0.3s",
        }}>
          {player2?.charAt(0).toUpperCase()}
        </div>
        {/* Name */}
        <div style={{ fontWeight: 600, fontSize: 14, color: currentPlayer === 2 ? "#3b82f6" : "#999" }}>
          {player2}
        </div>
        {/* Turn label */}
        {currentPlayer === 2 && (
          <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600, letterSpacing: "0.05em" }}>
            YOUR TURN
          </div>
        )}
      </div>

    </div>
  )
}

export default function BoardHeader({ player1, player2, currentPlayer, timer, aborted, abortGame, resetGame, gameStatus}) {

    const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

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
                
                <div style={{ fontWeight: 600, fontSize: 14, color: currentPlayer === 1 ? "#3b82f6" : "#999" }}>
                    {player1}
                </div>
                
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
            
                <div style={{ fontWeight: 600, fontSize: 14, color: currentPlayer === 2 ? "#3b82f6" : "#999" }}>
                    {player2}
                </div>
                
                {currentPlayer === 2 && (
                <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600, letterSpacing: "0.05em" }}>
                    YOUR TURN
                </div>
                )}
            </div>


            <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700 }}>
                {formatTime(timer)}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={resetGame}
                    style={{ padding: "6px 14px", background: "#3b82f6",
                        color: "#fff", border: "none", borderRadius: 6,
                        fontWeight: 600, cursor: "pointer" }}>
                        Restart
                </button>
                <button onClick={abortGame}
                    disabled={aborted || gameStatus === "won"}
                    style={{ padding: "6px 14px", background: "#ef4444",
                        color: "#fff", border: "none", borderRadius: 6,
                        fontWeight: 600, cursor: "pointer",
                        opacity: aborted || gameStatus === "won" ? 0.5 : 1 }}>
                        Abort
                </button>
            </div>
            
            {aborted && (
                <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 600 }}>
                GAME ABORTED
                </div>
            )}
            
        </div>
    )
}
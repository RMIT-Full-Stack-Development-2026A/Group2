
export default function WinnerBanner({ winner, player1, player2, resetGame }) {
  if (winner === null) return null;

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100,
    }}>
      <div style={{
        background: "#fff", borderRadius: 16,
        padding: "40px 48px", textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
        <h2 style={{ fontWeight: 700, marginBottom: 8 }}>
          {winner === 1 ? player1 : player2} wins!
        </h2>
        <p style={{ color: "#666", marginBottom: 24 }}>5 in a row!</p>
        <button
          onClick={resetGame}
          style={{
            padding: "12px 32px", background: "#3b82f6",
            color: "#fff", border: "none", borderRadius: 8,
            fontWeight: 600, fontSize: 16, cursor: "pointer",
          }}>
          Play Again
        </button>
      </div>
    </div>
  )
}
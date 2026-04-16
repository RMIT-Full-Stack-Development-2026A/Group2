export default function BoardSizePicker({ boardSize, onSizeChange }) {
  return (
    <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
      
      <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
        <input type="radio" name="boardSize"
          checked={boardSize === 10}
          onChange={() => onSizeChange(10)} />
        10×10 (Standard)
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
        <input type="radio" name="boardSize"
          checked={boardSize === 15}
          onChange={() => onSizeChange(15)} />
        15×15 (Advanced)
      </div>

    </div>
  )
}
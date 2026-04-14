
const boardStyles = [
  { id: "classic", name: "Classic", desc: "White background, black lines" },
  { id: "wood", name: "Wood", desc: "Warm wooden texture feel" },
  { id: "dark", name: "Dark", desc: "Dark background, light lines" },
];

export default function BoardStylePicker({boardStyle, onStyleChange}) {
    return(
        <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
          {boardStyles.map(s => (
            <div key={s.id}
              onClick={() => onStyleChange(s.id)}
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
    )
}
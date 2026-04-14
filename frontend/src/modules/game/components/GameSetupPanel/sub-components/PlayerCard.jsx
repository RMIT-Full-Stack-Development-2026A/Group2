export default function PlayerCard({ name, marker }) {
  return (

    <div style={{ display: "flex", alignItems: "center", gap: 8,
        border: "1px solid #ccc", borderRadius: 8, padding: 12, marginTop: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%",
            background: "#3b82f6", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700 }}>{name?.charAt(0).toUpperCase()}
        </div>

        <div>
            <div style={{ fontWeight: 600 }}>{name}</div>
            <div style={{ fontSize: 12, color: "#666" }}>Marker: {marker}</div>
        </div>
    </div>
    
   
  )
}


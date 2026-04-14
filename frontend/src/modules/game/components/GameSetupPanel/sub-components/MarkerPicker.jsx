const markers = ["X", "O", "△", "□", "☆", "♦"];

export default function MarkerPicker({label, selectedMarker, onMarkerChange, otherMarker}) {
    return(
        <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 600 }}>{label}</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                {markers.filter(m => m !== otherMarker).map(m => (
                <button key={m}
                    onClick={() => onMarkerChange(m)}
                    style={{
                    width: 40, height: 40, borderRadius: 8, border: "none",
                    cursor: "pointer", fontSize: 16, fontWeight: 700,
                    background: selectedMarker === m ? "#3b82f6" : "#e5e7eb",
                    color: selectedMarker === m ? "#fff" : "#333",
                    }}>
                    {m}
                </button>
                ))}
            </div>
        </div>
    )
}
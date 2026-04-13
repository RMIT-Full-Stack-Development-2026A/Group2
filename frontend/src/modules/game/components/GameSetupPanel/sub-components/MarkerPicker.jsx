const markers = ["X", "O", "△", "□", "☆", "♦"];

export default function MarkerPicker({ label, selectedMarker, onMarkerChange, otherMarker }) {
  return (
    <div>
      <label className="form-label fw-semibold">{label}</label>
      <div className="d-flex flex-wrap gap-2 mt-2">
        {markers
          .filter((m) => m !== otherMarker)
          .map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onMarkerChange(m)}
              className={`btn btn-sm ${selectedMarker === m ? "btn-primary" : "btn-outline-secondary"}`}
              style={{ width: "44px", height: "44px" }}
            >
              {m}
            </button>
          ))}
      </div>
    </div>
  );
}

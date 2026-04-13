const boardStyles = [
  { id: "classic", name: "Classic", desc: "White background, black lines" },
  { id: "wood", name: "Wood", desc: "Warm wooden texture feel" },
  { id: "dark", name: "Dark", desc: "Dark background, light lines" },
];

export default function BoardStylePicker({ boardStyle, onStyleChange }) {
  return (
    <div className="d-flex flex-wrap gap-3 mt-2">
      {boardStyles.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onStyleChange(s.id)}
          className={`btn text-start p-3 rounded-3 border ${
            boardStyle === s.id
              ? "border-primary border-2 bg-primary bg-opacity-10"
              : "border-secondary-subtle bg-white"
          }`}
          style={{ width: "140px", minHeight: "88px" }}
        >
          <div className="fw-semibold small">{s.name}</div>
          <div className="text-secondary" style={{ fontSize: "0.72rem", lineHeight: 1.3 }}>
            {s.desc}
          </div>
        </button>
      ))}
    </div>
  );
}

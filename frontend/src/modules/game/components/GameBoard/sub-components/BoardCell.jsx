const themeCellClasses = {
  classic: "bg-light border border-secondary-subtle text-dark",
  dark: "bg-dark border border-secondary text-info",
  wood: "bg-warning bg-opacity-10 border border-warning text-warning-emphasis",
};

export default function BoardCell({ value, onClick, theme, isWinning, cellSize = 48 }) {
  const base = themeCellClasses[theme] ?? themeCellClasses.classic;
  const fontSize = Math.max(12, Math.round(cellSize * 0.42));

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`d-flex align-items-center justify-content-center user-select-none rounded-1 flex-shrink-0 ${
        isWinning ? "bg-success text-white border border-success" : base
      }`}
      style={{
        width: cellSize,
        height: cellSize,
        minWidth: cellSize,
        minHeight: cellSize,
        cursor: "pointer",
        fontSize,
        fontWeight: 700,
      }}
    >
      {value}
    </div>
  );
}

export default function BoardSizePicker({ boardSize, onSizeChange }) {
  return (
    <div className="d-flex flex-wrap gap-4 mt-2">
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="boardSize"
          id="board-10"
          checked={boardSize === 10}
          onChange={() => onSizeChange(10)}
        />
        <label className="form-check-label" htmlFor="board-10">
          10×10 <span className="text-secondary">(Standard)</span>
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="boardSize"
          id="board-15"
          checked={boardSize === 15}
          onChange={() => onSizeChange(15)}
        />
        <label className="form-check-label" htmlFor="board-15">
          15×15 <span className="text-secondary">(Advanced)</span>
        </label>
      </div>
    </div>
  );
}

import useGameSetupPanel from "../../hooks/useGameSetupPanel";
import BoardSizePicker from "./sub-components/BoardSizePicker";
import BoardStylePicker from "./sub-components/BoardStylePicker";
import PlayerCard from "./sub-components/PlayerCard";
import MarkerPicker from "./sub-components/MarkerPicker";

export default function LocalGameSetupPanel({ onStart }) {
  const {
    player1,
    player2,
    firstTurn,
    boardSize,
    boardStyle,
    player1Marker,
    player2Marker,
    error,
    isLoading,
    handlePlayer2NameChange,
    handleFirstTurn,
    handleBoardSize,
    handleBoardStyle,
    handleMarkerChange,
    handleGameStart,
  } = useGameSetupPanel(onStart);

  return (
    <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: "720px" }}>
      <div className="card-body p-4 p-md-5">
        <h2 className="card-title fw-bold mb-1">Local 2-Player Game Setup</h2>
        <p className="text-secondary mb-4">Configure your match settings</p>

        <div className="row g-4 mt-1">
          <div className="col-md-6">
            <h5 className="small text-uppercase text-secondary fw-semibold mb-2">Player 1</h5>
            <PlayerCard name={player1} marker={player1Marker} />
          </div>
          <div className="col-md-6">
            <h5 className="small text-uppercase text-secondary fw-semibold mb-2">Player 2</h5>
            <label htmlFor="p2-name" className="visually-hidden">
              Player 2 name
            </label>
            <input
              id="p2-name"
              type="text"
              className="form-control mb-2"
              placeholder="Enter name"
              value={player2}
              onChange={handlePlayer2NameChange}
              autoComplete="off"
            />
            {player2 ? <PlayerCard name={player2} marker={player2Marker} /> : null}
            {error ? (
              <p className="text-danger small mt-2 mb-0" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-4">
          <label className="form-label fw-semibold">Who goes first?</label>
          <div className="d-flex flex-wrap gap-4 mt-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="firstTurn"
                id="ft-p1"
                checked={firstTurn === 1}
                onChange={() => handleFirstTurn(1)}
              />
              <label className="form-check-label" htmlFor="ft-p1">
                {player1}
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="firstTurn"
                id="ft-p2"
                checked={firstTurn === 2}
                onChange={() => handleFirstTurn(2)}
              />
              <label className="form-check-label" htmlFor="ft-p2">
                {player2 || "Player 2"}
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="form-label fw-semibold">Board size</label>
          <BoardSizePicker boardSize={boardSize} onSizeChange={handleBoardSize} />
        </div>

        <div className="mt-4">
          <label className="form-label fw-semibold">Board style</label>
          <BoardStylePicker boardStyle={boardStyle} onStyleChange={handleBoardStyle} />
        </div>

        <div className="row g-4 mt-2">
          <div className="col-md-6">
            <MarkerPicker
              label="Player 1 Marker"
              selectedMarker={player1Marker}
              otherMarker={player2Marker}
              onMarkerChange={(m) => handleMarkerChange(1, m)}
            />
          </div>
          <div className="col-md-6">
            <MarkerPicker
              label="Player 2 Marker"
              selectedMarker={player2Marker}
              otherMarker={player1Marker}
              onMarkerChange={(m) => handleMarkerChange(2, m)}
            />
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-lg w-100 fw-bold mt-4 py-3"
          onClick={handleGameStart}
          disabled={isLoading}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}

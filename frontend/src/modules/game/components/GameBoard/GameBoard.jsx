import { useMemo, useState } from "react";
import useGameBoard from "../../hooks/useGameBoard";
import BoardCell from "./sub-components/BoardCell";
import BoardHeader from "./sub-components/BoardHeader";
import WinnerBanner from "./sub-components/WinnerBanner";
import { boardFrameClassByStyle } from "../../utils/board.utils";

function PlayerSideColumn({ name, marker, currentPlayer, playerIndex }) {
  const active = currentPlayer === playerIndex;
  return (
    <div className="d-flex flex-column align-items-center flex-shrink-0" style={{ width: "130px" }}>
      <div
        className={`card w-100 text-center border-2 p-3 rounded-3 ${
          active ? "border-primary shadow-sm" : "border-secondary-subtle"
        }`}
      >
        <div className={`fw-semibold small ${active ? "text-primary" : "text-body"}`}>{name}</div>
        <div className="fs-2 lh-1 my-2">{marker}</div>
        {active && (
          <div className="text-primary fw-bold" style={{ fontSize: "10px", letterSpacing: "0.08em" }}>
            YOUR TURN
          </div>
        )}
      </div>
    </div>
  );
}

export default function GameBoard({
  player1Marker,
  player2Marker,
  boardStyle,
  player1,
  player2,
  boardSize,
  firstTurn,
  sessionId
}) {
  const {
    board,
    winningCells,
    timer,
    currentPlayer,
    gameStatus,
    winner,
    aborted,
    paused,
    handleCellClick,
    resetGame,
    abortGame,
    togglePause,
  } = useGameBoard(player1Marker, player2Marker, boardSize, firstTurn, sessionId);

  const resolvedSize = Number.parseInt(boardSize, 10) || 10;
  const cellSize = useMemo(() => (resolvedSize >= 15 ? 32 : 48), [resolvedSize]);

  const boardFrameClass = boardFrameClassByStyle[boardStyle] ?? boardFrameClassByStyle.classic;
  const [startedLabel] = useState(() => `Started: ${new Date().toLocaleTimeString()}`);

  return (
    <div className="d-flex flex-column align-items-stretch gap-3 w-100 px-1 px-md-2 mx-auto" style={{ maxWidth: "min(100%, 1400px)" }}>
      <BoardHeader
        boardSize={boardSize}
        gameStatus={gameStatus}
        timer={timer}
        aborted={aborted}
        paused={paused}
        togglePause={togglePause}
        abortGame={abortGame}
        resetGame={resetGame}
      />

      {/* Keep P1 | board | P2 on one row; center scrolls horizontally on small / 15×15 */}
      <div className="d-flex flex-nowrap align-items-start justify-content-center gap-2 gap-md-3 w-100 min-w-0">
        <PlayerSideColumn
          name={player1}
          marker={player1Marker}
          currentPlayer={currentPlayer}
          playerIndex={1}
        />

        <div className="flex-grow-1 flex-shrink-1 min-w-0 d-flex flex-column align-items-center gap-2">
          <div className="w-100 overflow-x-auto pb-1 d-flex justify-content-center">
            <div className={`d-inline-block p-2 p-md-3 rounded-4 shadow-sm ${boardFrameClass}`}>
              {board.map((row, rowIndex) => (
                <div key={rowIndex} className="d-flex gap-1 flex-nowrap">
                  {row.map((cell, colIndex) => (
                    <BoardCell
                      key={colIndex}
                      value={cell}
                      theme={boardStyle}
                      cellSize={cellSize}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      isWinning={winningCells.some(([r, c]) => r === rowIndex && c === colIndex)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="text-secondary small text-center text-nowrap">{startedLabel}</div>
        </div>

        <PlayerSideColumn
          name={player2}
          marker={player2Marker}
          currentPlayer={currentPlayer}
          playerIndex={2}
        />
      </div>

      <WinnerBanner winner={winner} player1={player1} player2={player2} resetGame={resetGame} />
    </div>
  );
}

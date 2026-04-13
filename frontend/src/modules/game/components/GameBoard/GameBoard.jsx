import { useState } from "react";
import useGameBoard from "../../hooks/useGameBoard";
import BoardCell from "../GameBoard/sub-components/BoardCell"
import BoardHeader from "./sub-components/BoardHeader";
import WinnerBanner from "./sub-components/WinnerBanner";
import { boardThemes } from "../../utils/board.utils";

function PlayerSideColumn({ name, marker, currentPlayer, playerIndex }) {
  const active = currentPlayer === playerIndex;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        minWidth: 120,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          padding: "14px 16px",
          borderRadius: 12,
          border: `2px solid ${active ? "#3b82f6" : "#e2e8f0"}`,
          background: "#fff",
          boxShadow: active ? "0 0 0 3px rgba(59,130,246,0.15)" : "none",
          width: "100%",
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a", textAlign: "center" }}>
          {name}
        </div>
        <div style={{ fontSize: 28, lineHeight: 1 }}>{marker}</div>
        {active && (
          <div style={{ fontSize: 10, color: "#3b82f6", fontWeight: 700, letterSpacing: "0.08em" }}>
            YOUR TURN
          </div>
        )}
      </div>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: active ? "#3b82f6" : "#e2e8f0",
          color: active ? "#fff" : "#64748b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: 22,
        }}
      >
        {(name || "?").charAt(0).toUpperCase()}
      </div>
    </div>
  );
}

export default function GameBoard({player1Marker, player2Marker, boardStyle, player1, player2, boardSize, firstTurn}) {
    const {
        board,winningCells, timer, currentPlayer, gameStatus, winner, aborted, paused, handleCellClick,  resetGame, abortGame, togglePause
    } = useGameBoard(player1Marker, player2Marker, boardSize, firstTurn);
    const themeStyle = boardThemes[boardStyle];
    const [startedLabel] = useState(
      () => `Started: ${new Date().toLocaleTimeString()}`
    );

    return(
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", maxWidth: 1100, padding: "0 16px" }}>

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

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: 20,
                width: "100%",
              }}
            >
              <PlayerSideColumn
                name={player1}
                marker={player1Marker}
                currentPlayer={currentPlayer}
                playerIndex={1}
              />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{display: "inline-block",padding: 12,
                        background: themeStyle.background,
                        border: themeStyle.border,
                        borderRadius: 14,
                    }}>
                    {board.map((row, rowIndex) => (
                        <div key = {rowIndex} style={{display:"flex", gap:3}}>
                            {row.map((cell, colIndex) =>(
                                <BoardCell  key={colIndex}
                                value = {cell}
                                theme={boardStyle}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                                isWinning={winningCells.some(([r,c]) => r === rowIndex && c === colIndex)}/>
                        ))}
                        </div>
                    ))}
                </div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{startedLabel}</div>
              </div>
              <PlayerSideColumn
                name={player2}
                marker={player2Marker}
                currentPlayer={currentPlayer}
                playerIndex={2}
              />
            </div>

            <WinnerBanner
                winner={winner}
                player1={player1}
                player2={player2}
                resetGame={resetGame}
            />
        </div>
    )
}

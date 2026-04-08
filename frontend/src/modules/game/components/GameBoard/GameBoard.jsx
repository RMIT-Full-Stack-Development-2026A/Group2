import useGameBoard from "../../hooks/useGameBoard";
import BoardCell from "../GameBoard/sub-components/BoardCell"
import BoardHeader from "./sub-components/BoardHeader";
import WinnerBanner from "./sub-components/WinnerBanner";


const boardThemes = {
  classic: {
    background: "#ffffff",
    border: "2px solid #e2e8f0",
  },
  dark: {
    background: "#1e1e2e",
    border: "2px solid rgba(255,255,255,0.1)",
  },
  wood: {
    background: "#fef9c3",
    border: "2px solid #d97706",
  },
};

export default function GameBoard({player1Marker, player2Marker, boardStyle, player1, player2}) {
    const {
        board, handleCellClick, currentPlayer, gameStatus, winner, resetGame
    } = useGameBoard(player1Marker, player2Marker);
    const themeStyle = boardThemes[boardStyle];

    return(
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            
            <BoardHeader
                currentPlayer={currentPlayer}
                player1={player1}
                player2={player2}
                gameStatus={gameStatus}
            />
            
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
                            onClick={() => handleCellClick(rowIndex, colIndex)}/>
                    ))}
                    </div>
                ))}
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
import useGameBoard from "../../hooks/useGameBoard";
import BoardCell from "../GameBoard/sub-components/BoardCell"
import BoardHeader from "./sub-components/BoardHeader";
import WinnerBanner from "./sub-components/WinnerBanner";
import { boardThemes } from "../../utils/board.utils";


export default function GameBoard({player1Marker, player2Marker, boardStyle, player1, player2, boardSize, firstTurn}) {
    const {
        board,winningCells, timer, currentPlayer, gameStatus, winner, aborted, handleCellClick,  resetGame, abortGame
    } = useGameBoard(player1Marker, player2Marker, boardSize, firstTurn);
    const themeStyle = boardThemes[boardStyle];

    return(
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            
            <BoardHeader
                currentPlayer={currentPlayer}
                player1={player1}
                player2={player2}
                gameStatus={gameStatus}
                timer={timer}
                aborted={aborted}
                abortGame={abortGame}
                resetGame={resetGame}
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
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                            isWinning={winningCells.some(([r,c]) => r === rowIndex && c === colIndex)}/>
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
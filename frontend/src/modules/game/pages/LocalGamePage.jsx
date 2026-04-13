import { useState } from "react";
import LocalGameSetupPanel from "../components/GameSetupPanel/LocalGameSetupPanel";
import GameBoard from "../components/GameBoard/GameBoard";

export default function LocalGamePage() {
  const [started, setStarted] = useState(false);
  const [gameConfig, setGameConfig] = useState(null);

  function handleStart(config) {
    setGameConfig(config);
    setStarted(true);
  }

  return (
    <div className="text-center">
      {!started ? (
        <LocalGameSetupPanel onStart={handleStart} />
      ) : (
        <GameBoard 
          player1={gameConfig.player1}
          player2={gameConfig.player2}
          player1Marker={gameConfig.player1Marker} 
          player2Marker={gameConfig.player2Marker}
          firstTurn={gameConfig.firstTurn}
          boardStyle={gameConfig.boardStyle}
          boardSize={gameConfig.boardSize}
        />
      )}
    </div>
  );

}
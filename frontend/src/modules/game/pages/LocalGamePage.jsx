import { useState } from "react";
import GameSetupPanel from "../components/GameSetupPanel/GameSetupPanel";

export default function GamePage() {
  const [started, setStarted] = useState(false);
  const [gameConfig, setGameConfig] = useState(null);

  function handleStart(config) {
    setGameConfig(config);
    setStarted(true);
  }

  return (
    <div className="text-center">
      <GameSetupPanel onStart={handleStart} />
    </div>
  );
}
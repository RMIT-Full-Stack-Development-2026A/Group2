import { useState } from "react";
import LocalGameSetupPanel from "../components/GameSetupPanel/LocalGameSetupPanel";

export default function GamePage() {
  const [started, setStarted] = useState(false);
  const [gameConfig, setGameConfig] = useState(null);

  function handleStart(config) {
    setGameConfig(config);
    setStarted(true);
  }

  return (
    <div className="text-center">
      <LocalGameSetupPanel onStart={handleStart} />
    </div>
  );
}
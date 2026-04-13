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

  return started ? (
    <GameBoard {...gameConfig} />
  ) : (
    <LocalGameSetupPanel onStart={handleStart} />
  );

}
import { useMemo, useState } from "react";

export default function useAIGameSetupForm() {
  const [difficulty, setDifficulty] = useState("medium");
  const [firstPlayer, setFirstPlayer] = useState("player");
  const [boardSize, setBoardSize] = useState(10);
  const [boardStyle, setBoardStyle] = useState("classic");
  const [playerMarker, setPlayerMarker] = useState("X");
  const [aiMarker, setAiMarker] = useState("O");
  const [customBoardImage, setCustomBoardImage] = useState(null);
  const [useCustomBoard, setUseCustomBoard] = useState(false);

  const botName = useMemo(() => {
    return `AI-${difficulty.charAt(0).toUpperCase()}${difficulty.slice(1)}`;
  }, [difficulty]);

  return {
    difficulty,
    setDifficulty,
    firstPlayer,
    setFirstPlayer,
    boardSize,
    setBoardSize,
    boardStyle,
    setBoardStyle,
    playerMarker,
    setPlayerMarker,
    aiMarker,
    setAiMarker,
    customBoardImage,
    setCustomBoardImage,
    useCustomBoard,
    setUseCustomBoard,
    botName,
  };
}
import { useMemo, useState } from "react";
import { getAiOpponent } from "../../utils/aiOpponent";

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
    return getAiOpponent(difficulty).name;
  }, [difficulty]);

  const botAvatar = useMemo(() => getAiOpponent(difficulty), [difficulty]);

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
    botAvatar,
  };
}

import { useState } from "react";

export default function useLocalGameSetupForm() {
  const [player2Name, setPlayer2Name] = useState("");
  const [firstPlayer, setFirstPlayer] = useState("player1");
  const [boardSize, setBoardSize] = useState(10);
  const [boardStyle, setBoardStyle] = useState("classic");
  const [marker1, setMarker1] = useState("X");
  const [marker2, setMarker2] = useState("O");
  const [customBoardImage, setCustomBoardImage] = useState(null);
  const [useCustomBoard, setUseCustomBoard] = useState(false);

  return {
    player2Name,
    setPlayer2Name,
    firstPlayer,
    setFirstPlayer,
    boardSize,
    setBoardSize,
    boardStyle,
    setBoardStyle,
    marker1,
    setMarker1,
    marker2,
    setMarker2,
    customBoardImage,
    setCustomBoardImage,
    useCustomBoard,
    setUseCustomBoard,
  };
}
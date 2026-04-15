import { useState } from "react"

export default function useGameSetupPanel(onStart) {
  const [player1] = useState("Player1");
  const [player2, setPlayer2] = useState("");
  const [firstTurn, setFirstTurn] = useState(1);
  const [boardSize, setBoardSize] = useState(10);
  const [boardStyle, setBoardStyle] = useState("classic");
  const [player1Marker, setPlayer1Marker] = useState("X");
  const [player2Marker, setPlayer2Marker] = useState("O");
  const [error, setError] = useState("");
  const [isLoading] = useState(false);

  function handlePlayer2NameChange(event) {
    setPlayer2(event.target.value);
    setError("");
  }

  function handleFirstTurn(player) {
    setFirstTurn(player);
  }

  function handleBoardSize(size) {
    setBoardSize(size);
  }

  function handleBoardStyle(style) {
    setBoardStyle(style);
  }

  function handleMarkerChange(player, marker) {
    if (player === 1) setPlayer1Marker(marker);
    if (player === 2) setPlayer2Marker(marker);
  }

  function handleGameStart() {
    if (!player2.trim()) {
      setError("Please enter player 2's name");
      return;
    }
    if (player2.trim().length < 2) {
      setError("Name must be at least 2 characters long");
      return;
    }
    if (player2.trim().length > 12) {
      setError("Name must be 12 characters or less");
      return;
    }
    if (!/^[a-zA-Z0-9 ]+$/.test(player2.trim())) {
      setError("Name can only contain letters, numbers, and spaces");
      return;
    }
    onStart({
      player1,
      player2,
      firstTurn,
      boardSize,
      boardStyle,      
      player1Marker,
      player2Marker,
    });
  }

  return {
    player1, 
    player2, 
    firstTurn,
    boardSize, 
    boardStyle,
    player1Marker, 
    player2Marker,
    error, 
    isLoading,
    handlePlayer2NameChange,
    handleFirstTurn,
    handleBoardSize,
    handleBoardStyle,
    handleMarkerChange,
    handleGameStart,
  }
}
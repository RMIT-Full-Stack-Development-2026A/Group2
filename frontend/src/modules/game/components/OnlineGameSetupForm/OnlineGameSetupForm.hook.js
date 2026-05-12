import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import socket from "@/lib/socket";
import { buildOnlineGameNavigationState } from "./OnlineGameSetupForm.service";

export default function useOnlineGameSetupForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [waitingRoomCode, setWaitingRoomCode] = useState(null);
  const [waitForStart, setWaitForStart] = useState(null);
  const [joinCode, setJoinCode] = useState("");
  const [boardSize, setBoardSize] = useState(10);
  const [boardStyle, setBoardStyle] = useState("classic");
  const [marker1, setMarker1] = useState("X");
  const [marker2, setMarker2] = useState("O");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit("getRooms");

    socket.on("roomListUpdated", (updatedRooms) => setRooms(updatedRooms));

    socket.on("gameStart", (config) => {
      const myRole = config.player1SocketId === socket.id ? "player1" : "player2";
      const state = buildOnlineGameNavigationState({
        username: user?.username || "Player",
        ...config,
        myRole,
      });
      navigate("/game/play", { state });
    });

    socket.on("waitingForOpponent", ({ roomCode }) => {
      setWaiting(true);
      setWaitingRoomCode(roomCode);
    });

    socket.on("waitForStart", (config) => {
      console.log("waitForStart received:", config);
      setWaitForStart(config);
      setWaiting(false);
    });

    socket.on("joinError", ({ message }) => setError(message));

    return () => {
      socket.off("roomListUpdated");
      socket.off("gameStart");
      socket.off("waitingForOpponent");
      socket.off("waitForStart");
      socket.off("joinError");
    };
  }, []);

  return {
    rooms,
    waiting,
    waitingRoomCode,
    waitForStart,
    joinCode, setJoinCode,
    boardSize, setBoardSize,
    boardStyle, setBoardStyle,
    marker1, setMarker1,
    marker2, setMarker2,
    error, setError,
  };
}
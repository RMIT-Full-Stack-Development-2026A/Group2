import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import socket from "@/lib/socket";
import { buildOnlineGameNavigationState } from "./OnlineGameSetupForm.service";

export default function useOnlineGameSetupForm() {
    const { user } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [waiting, setWaiting] = useState(false);
    const [waitingRoomCode, setWaitingRoomCode] = useState(null);
    const [waitForStart, setWaitForStart] = useState(null);
    const [joinCode, setJoinCode] = useState("");
    const [boardSize, setBoardSize] = useState(10);
    const [boardStyle, setBoardStyle] = useState("classic");
    const [customBoardImage, setCustomBoardImage] = useState(null);
    const [useCustomBoard, setUseCustomBoard] = useState(false);
    const [marker1, setMarker1] = useState("X");
    const [marker2, setMarker2] = useState("O");
    const [error, setError] = useState("");
    const [showRoomClosedPopup, setShowRoomClosedPopup] = useState(false);
    const [roomClosedMessage, setRoomClosedMessage] = useState("");
    const [preparingGame, setPreparingGame] = useState(null);

    useEffect(() => {
        if (!socket.connected) socket.connect();
        socket.emit("getRooms");

        socket.on("roomListUpdated", (updatedRooms) => setRooms(updatedRooms));

        socket.on("gameStart", (config) => {
            const myRole =
                config.player1SocketId === socket.id ? "player1" : "player2";
            const state = buildOnlineGameNavigationState({
                username: user?.username || "Player",
                ...config,
                myRole,
            });

            // Clear waitForStart so component doesn't return early
            setWaitForStart(null);
            // Instead of navigating immediately, expose the prepared state
            // to the component so it can show a Bootstrap modal/countdown.
            setPreparingGame(state);
        });

        socket.on("waitingForOpponent", ({ roomCode }) => {
            setWaiting(true);
            setWaitingRoomCode(roomCode);
        });

        socket.on("waitForStart", (config) => {
            setWaitForStart(config);
            setWaiting(false);
        });

        socket.on("joinError", ({ message }) => setError(message));

        socket.on("roomClosed", ({ roomCode, reason }) => {
            const closedRoomCode = String(roomCode || "").toUpperCase();

            const message =
                reason === "closed_by_admin"
                    ? `Room ${closedRoomCode} was closed by an admin.`
                    : `Room ${closedRoomCode} was closed.`;

            setWaiting(false);
            setWaitingRoomCode(null);
            setRoomClosedMessage(message);
            setShowRoomClosedPopup(true);
        });

        return () => {
            socket.off("roomListUpdated");
            socket.off("gameStart");
            socket.off("waitingForOpponent");
            socket.off("waitForStart");
            socket.off("joinError");
            socket.off("roomClosed");
        };
    }, [user?.username]);

    return {
        rooms,
        waiting,
        waitingRoomCode,
        waitForStart,
        showRoomClosedPopup,
        roomClosedMessage,
        setShowRoomClosedPopup,
        joinCode,
        setJoinCode,
        boardSize,
        setBoardSize,
        boardStyle,
        setBoardStyle,
        customBoardImage,
        setCustomBoardImage,
        useCustomBoard,
        setUseCustomBoard,
        marker1,
        setMarker1,
        marker2,
        setMarker2,
        error,
        setError,
        preparingGame,
        setPreparingGame,
    };
}

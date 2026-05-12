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
    const [joinCode, setJoinCode] = useState("");
    const [boardSize, setBoardSize] = useState(10);
    const [boardStyle, setBoardStyle] = useState("classic");
    const [marker1, setMarker1] = useState("X");
    const [marker2, setMarker2] = useState("O");
    const [error, setError] = useState("");
    const [showRoomClosedPopup, setShowRoomClosedPopup] = useState(false);
    const [roomClosedMessage, setRoomClosedMessage] = useState("");

    useEffect(() => {
        if (!socket.connected) socket.connect();

        socket.emit("getRooms");

        socket.on("roomListUpdated", (updatedRooms) => {
            setRooms(updatedRooms);
        });

        socket.on("gameStart", (config) => {
            const myRole =
                config.player1SocketId === socket.id ? "player1" : "player2";
            const state = buildOnlineGameNavigationState({
                username: user?.username || "Player",
                roomCode: config.roomCode,
                boardSize: config.boardSize,
                boardStyle: config.boardStyle,
                marker1: config.marker1,
                marker2: config.marker2,
                player1SocketId: config.player1SocketId,
                player2SocketId: config.player2SocketId,
                player1Name: config.player1Name,
                player2Name: config.player2Name,
                sessionId: config.sessionId,
                backendSession: config.backendSession,
                myRole,
            });
            navigate("/game/play", { state });
        });

        socket.on("waitingForOpponent", ({ roomCode }) => {
            setWaiting(true);
            setWaitingRoomCode(roomCode);
        });

        socket.on("joinError", ({ message }) => {
            setError(message);
        });

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
            socket.off("joinError");
            socket.off("roomClosed");
        };
    }, [navigate, user?.username]);

    return {
        rooms,
        waiting,
        waitingRoomCode,
        showRoomClosedPopup,
        roomClosedMessage,
        setShowRoomClosedPopup,
        joinCode,
        setJoinCode,
        boardSize,
        setBoardSize,
        boardStyle,
        setBoardStyle,
        marker1,
        setMarker1,
        marker2,
        setMarker2,
        error,
        setError,
    };
}

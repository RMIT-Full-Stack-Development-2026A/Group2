const { v4: uuidv4 } = require("uuid");
const multiplayerService = require("../application/services/multiplayer.service");

const rooms = new Map();

function broadcastRoomList(io) {
    const openRooms = [...rooms.values()].filter((r) => r.status === "waiting");
    io.emit("roomListUpdated", openRooms);
}

function emitRoomClosed(io, roomCode, reason = "closed_by_admin") {
    const normalizedCode = String(roomCode || "").toUpperCase();
    if (!normalizedCode) return;

    // Notify sockets currently joined in the room first
    io.to(normalizedCode).emit("roomClosed", {
        roomCode: normalizedCode,
        reason,
    });

    // Update in-memory room state to closed so future lookups reflect DB
    const room = rooms.get(normalizedCode);
    if (room) {
        room.status = "closed";
    }

    // Broadcast updated room list to all connected clients
    broadcastRoomList(io);
}

function roomSocketHandler(io, socket) {
    socket.on("getRooms", () => {
        const openRooms = [...rooms.values()].filter(
            (r) => r.status === "waiting",
        );
        socket.emit("roomListUpdated", openRooms);
    });

    socket.on(
        "createRoom",
        async ({ boardSize, boardStyle, marker1, marker2 }) => {
            const roomCode = uuidv4().slice(0, 6).toUpperCase();

            await multiplayerService.createRoom(socket.user, {
                roomCode,
                boardSize,
                boardStyle,
                marker1,
                marker2,
            });

            rooms.set(roomCode, {
                roomCode,
                boardSize,
                boardStyle,
                marker1,
                marker2,
                player1: socket.id,
                player1User: socket.user,
                player2: null,
                status: "waiting",
            });
            socket.join(roomCode);
            socket.emit("roomCreated", { roomCode });
            broadcastRoomList(io);
        },
    );

    socket.on("joinRoom", async ({ roomCode }) => {
        const room = rooms.get(roomCode.toUpperCase());

        if (!room) {
            socket.emit("joinError", { message: "Room not found." });
            return;
        }
        if (room.player1 === socket.id) {
            socket.emit("joinError", {
                message: "You cannot join your own room.",
            });
            return;
        }
        if (room.status !== "waiting") {
            socket.emit("joinError", { message: "Room is not available." });
            return;
        }
        if (room.player2) {
            socket.emit("joinError", { message: "Room is full." });
            return;
        }

        room.player2 = socket.id;
        room.player2User = socket.user;
        room.status = "active";
        socket.join(roomCode);

        try {
            const dto = await multiplayerService.joinRoom(
                socket.user,
                roomCode.toUpperCase(),
                room.player1User,
                {
                    boardSize: room.boardSize,
                    marker1: room.marker1,
                    marker2: room.marker2,
                },
            );

            room.sessionId = dto.session.id;

            io.to(roomCode).emit("gameStart", {
                roomCode,
                boardSize: room.boardSize,
                boardStyle: room.boardStyle,
                marker1: room.marker1,
                marker2: room.marker2,
                player1SocketId: room.player1,
                player2SocketId: room.player2,
                player1Name: room.player1User.username,
                player2Name: room.player2User.username,
                sessionId: dto.session.id,
                backendSession: dto,
            });

            broadcastRoomList(io);
        } catch (error) {
            console.error(
                "Failed to create online game session:",
                error.message,
            );
            socket.emit("joinError", {
                message: "Failed to create game session.",
            });
        }
    });

    socket.on(
        "findMatch",
        async ({ boardSize, boardStyle, marker1, marker2 }) => {
            const availableRoom = [...rooms.values()].find(
                (r) => r.status === "waiting" && r.boardSize === boardSize,
            );

            if (availableRoom) {
                availableRoom.player2 = socket.id;
                availableRoom.player2User = socket.user;
                availableRoom.status = "active";
                socket.join(availableRoom.roomCode);

                try {
                    const dto = await multiplayerService.joinRoom(
                        socket.user,
                        availableRoom.roomCode,
                        availableRoom.player1User,
                        {
                            boardSize: availableRoom.boardSize,
                            marker1: availableRoom.marker1,
                            marker2: availableRoom.marker2,
                        },
                    );

                    availableRoom.sessionId = dto.session.id;

                    io.to(availableRoom.roomCode).emit("gameStart", {
                        roomCode: availableRoom.roomCode,
                        boardSize: availableRoom.boardSize,
                        boardStyle: availableRoom.boardStyle,
                        marker1: availableRoom.marker1,
                        marker2: availableRoom.marker2,
                        player1SocketId: availableRoom.player1,
                        player2SocketId: availableRoom.player2,
                        player1Name: availableRoom.player1User.username,
                        player2Name: availableRoom.player2User.username,
                        sessionId: dto.session.id,
                        backendSession: dto,
                    });

                    broadcastRoomList(io);
                } catch (error) {
                    console.error(
                        "Failed to create online game session:",
                        error.message,
                    );
                    socket.emit("joinError", {
                        message: "Failed to create game session.",
                    });
                }
            } else {
                const roomCode = uuidv4().slice(0, 6).toUpperCase();

                await multiplayerService.createRoom(socket.user, {
                    roomCode,
                    boardSize,
                    boardStyle,
                    marker1,
                    marker2,
                });

                rooms.set(roomCode, {
                    roomCode,
                    boardSize,
                    boardStyle,
                    marker1,
                    marker2,
                    player1: socket.id,
                    player1User: socket.user,
                    player2: null,
                    status: "waiting",
                });
                socket.join(roomCode);
                socket.emit("waitingForOpponent", { roomCode });
                broadcastRoomList(io);
            }
        },
    );

    socket.on("disconnect", async () => {
        for (const [code, room] of rooms) {
            if (room.player1 === socket.id || room.player2 === socket.id) {
                io.to(code).emit("playerDisconnected");

                if (room.sessionId) {
                    try {
                        await gameService.abortGame(
                            socket.user,
                            room.sessionId,
                        );
                    } catch (error) {
                        console.error(
                            "Failed to abort game on disconnect:",
                            error.message,
                        );
                    }
                }

                await multiplayerService.closeRoom(code);
                rooms.delete(code);
                broadcastRoomList(io);
            }
        }
    });
}

roomSocketHandler.rooms = rooms;
roomSocketHandler.emitRoomClosed = emitRoomClosed;
module.exports = roomSocketHandler;

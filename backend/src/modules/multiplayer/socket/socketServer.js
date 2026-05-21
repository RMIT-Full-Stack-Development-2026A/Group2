const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const roomSocketHandler = require("./roomSocketHandler");
const moveSocketHandler = require("./moveSocketHandler");
const User = require("../../auth/model/user.model");
const Profile = require("../../profile/profile.model");
const authRepository = require("../../auth/auth.repository");
const chatSocketHandler = require("./chatSocketHandler");
const spectatorSocketHandler = require("./spectatorSocketHandler");
let io;

function initSocketServer(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const revoked = await authRepository.isTokenBlacklisted(token);
        if (revoked) return next(new Error("Unauthorized"));
        const user = await User.findById(decoded.id).select("username role");
        if (!user) return next(new Error("Unauthorized"));
        const profile = await Profile.findOne({ userID: user._id })
          .select("avatarURL displayName")
          .lean();
        socket.user = { 
            id: String(user._id), 
            username: user.username,
            displayName: profile?.displayName || user.username,
            avatarURL: profile?.avatarURL || null,
            role: user.role
        };
      next();
    } catch (err) {
      console.error("Socket auth error:", err.message);
        next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} user: ${socket.user?.id}`);
    roomSocketHandler(io, socket);
    moveSocketHandler(io, socket);
    chatSocketHandler(io, socket);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  const spectatorNamespace = io.of("/spectator");
  spectatorNamespace.on("connection", (socket) => {
    spectatorSocketHandler(io, spectatorNamespace, socket);
  });

  return io;
}

function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

module.exports = { initSocketServer, getIO };

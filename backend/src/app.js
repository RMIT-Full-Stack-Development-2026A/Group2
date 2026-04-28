const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");

const app = express();

// CORS + cookies: frontend origin (default Vite port).
const clientOrigin = process.env.CLIENT_URL || "http://localhost:5173";
const localhostOriginPattern = /^http:\/\/localhost:\d+$/;
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (origin === clientOrigin || localhostOriginPattern.test(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Backend is running");
});

app.use("/api/auth", routes.authRouter);
app.use("/api/game", routes.gameRouter);
app.use("/api/multiplayer", routes.multiplayerRouter);
module.exports = app;

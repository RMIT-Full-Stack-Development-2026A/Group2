const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");

const app = express();

// CORS + cookies: allow configured origins + localhost on any port (dev).
const configuredOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const localhostOriginRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (curl/postman) and same-origin.
      if (!origin) {
        return callback(null, true);
      }

      if (
        localhostOriginRegex.test(origin) ||
        configuredOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
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
module.exports = app;

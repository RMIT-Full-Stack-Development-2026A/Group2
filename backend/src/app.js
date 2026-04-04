const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");

const app = express();

const clientOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Backend is running");
});

app.use("/api", routes);

module.exports = app;
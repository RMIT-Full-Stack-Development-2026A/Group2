const express = require("express");

const { errorMiddleware } = require("./middlewares/errorMiddleware");

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Backend is running");
});

app.use(errorMiddleware);

module.exports = app;

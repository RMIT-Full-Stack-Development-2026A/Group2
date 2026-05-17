const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const premiumController = require("./modules/premium/premium.controller");

const app = express();

// CORS + cookies: frontend origin (default Vite port).
const clientOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
);
app.use(cookieParser());
app.post(
  "/api/premium/stripe-webhook",
  express.raw({ type: "application/json" }),
  premiumController.stripeWebhook,
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Backend is running");
});

app.use("/api/auth", routes.authRouter);
app.use("/api/admin", routes.adminRouter);
app.use("/api/profile", routes.profileRouter);
app.use("/api/game", routes.gameRouter);
app.use("/api/premium", routes.premiumRouter);
app.use("/api/multiplayer", routes.multiplayerRouter);
module.exports = app;

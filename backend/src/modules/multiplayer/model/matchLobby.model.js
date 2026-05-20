// Online multiplayer: matchmaking + connection
const mongoose = require("mongoose");

const { Schema, model, Types } = mongoose;

const LOBBY_STATUSES = ["waiting", "active", "closed", "finished"];

const matchLobbySchema = new Schema(
  {
    sessionId: {
      type: Types.ObjectId,
      ref: "GameSession",
      unique: true,
      sparse: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lobbyCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: LOBBY_STATUSES,
      default: LOBBY_STATUSES[0],
      required: true,
    },
    spectatorShareToken: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
      default: undefined,
    },
    spectatorShareEnabled: {
      type: Boolean,
      default: false,
    },
    spectatorShareCreatedAt: {
      type: Date,
      default: null,
    },
    startedAt: Date,
    endedAt: Date,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

module.exports = model("MatchLobby", matchLobbySchema);

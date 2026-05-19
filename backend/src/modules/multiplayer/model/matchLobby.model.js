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
      trim: true,
      default: null,
    },
    spectatorShareEnabled: {
      type: Boolean,
      default: false,
    },
    spectatorShareCreatedAt: {
      type: Date,
      default: null,
    },
    boardSize: {
      type: Number,
      enum: [10, 15],
      default: null,
    },
    boardStyle: {
      type: String,
      trim: true,
      default: "classic",
    },
    customBoardImage: {
      type: String,
      default: null,
    },
    marker1: {
      type: String,
      trim: true,
      default: "X",
    },
    marker2: {
      type: String,
      trim: true,
      default: "O",
    },
    startedAt: Date,
    endedAt: Date,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

matchLobbySchema.index(
  { spectatorShareToken: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { spectatorShareToken: { $type: "string" } },
  },
);

module.exports = model("MatchLobby", matchLobbySchema);

import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const GAME_MODES = ["single_player", "two_player", "online_match"];
const GAME_STATUSES = ["waiting", "ongoing", "finished", "aborted"];
const GAME_RESULTS = [
  "player1_win",
  "player2_win",
  "draw",
  "aborted",
  "pending",
];

const gameSessionSchema = new Schema(
  {
    boardStyleID: {
      type: Types.ObjectId,
      ref: "BoardStyle",
      default: null,
    },
    gameMode: {
      type: String,
      enum: GAME_MODES,
      required: true,
    },
    status: {
      type: String,
      enum: GAME_STATUSES,
      default: "waiting",
      required: true,
    },
    aiDifficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: null,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: null,
    },
    result: {
      type: String,
      enum: GAME_RESULTS,
      default: "pending",
      required: true,
    },
    currentTurn: {
      type: Types.ObjectId,
      ref: "GameParticipant",
      default: null,
    },
  },
  {
    versionKey: false,
  },
);

export default model("GameSession", gameSessionSchema);

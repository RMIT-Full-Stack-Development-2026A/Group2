import mongoose from "mongoose";

const PARTICIPANT_TYPES = ["player", "ai", "guest"];

const gameParticipantSchema = new mongoose.Schema(
  {
    sessionID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameSession",
      required: true,
      index: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    markerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Marker",
      default: null,
    },
    participantType: {
      type: String,
      enum: PARTICIPANT_TYPES,
      required: true,
    },
    isWinner: {
      type: Boolean,
      default: false,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    versionKey: false,
  }
);

const GameParticipant = mongoose.model("GameParticipant", gameParticipantSchema);

export default GameParticipant;
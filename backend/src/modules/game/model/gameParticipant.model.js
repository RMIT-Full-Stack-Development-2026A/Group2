import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const PARTICIPANT_TYPES = ["player", "ai", "guest"];

const gameParticipantSchema = new Schema(
  {
    sessionID: {
      type: Types.ObjectId,
      ref: "GameSession",
      required: true,
      index: true,
    },
    userID: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
    },
    markerID: {
      type: Types.ObjectId,
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

export default model("GameParticipant", gameParticipantSchema);
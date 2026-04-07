const mongoose = require("mongoose");

const { Schema, model, Types } = mongoose;

const moveSchema = new Schema(
  {
    sessionID: {
      type: Types.ObjectId,
      ref: "GameSession",
      required: true,
      index: true,
    },
    participantID: {
      type: Types.ObjectId,
      ref: "GameParticipant",
      required: true,
      index: true,
    },
    moveNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    rowIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    playedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = model("Move", moveSchema);

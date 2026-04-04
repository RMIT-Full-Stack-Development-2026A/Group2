import mongoose from "mongoose";

const moveSchema = new mongoose.Schema(
  {
    sessionID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameSession",
      required: true,
      index: true,
    },
    participantID: {
      type: mongoose.Schema.Types.ObjectId,
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

const Move = mongoose.model("Move", moveSchema);
export default Move;

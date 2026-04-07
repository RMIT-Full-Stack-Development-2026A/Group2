const mongoose = require("mongoose");

const { Schema, model, Types } = mongoose;

const ROOM_STATUSES = ["waiting", "active", "closed", "finished"];

const onlineGameRoomSchema = new Schema(
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
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ROOM_STATUSES,
      default: ROOM_STATUSES[0],
      required: true,
    },
    startedAt: Date,
    endedAt: Date,
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, 
    versionKey: false,
  }
);

module.exports = model("OnlineGameRoom", onlineGameRoomSchema);
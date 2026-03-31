import mongoose from "mongoose";
import { MARK_KEYS } from "configs/config/gameCatalog.js";

const { Schema, model } = mongoose;

const onlineRoomSchema = new Schema(
  {
    roomNumber: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["waiting", "active", "finished", "closed"],
      default: "waiting",
      required: true,
    },

    player1UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    player1Name: {
      type: String,
      required: true,
      trim: true,
    },

    player2UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    player2Name: {
      type: String,
      default: null,
      trim: true,
    },

    selectedMarks: {
      player1: {
        type: String,
        enum: [...MARK_KEYS, null],
        default: null,
      },
      player2: {
        type: String,
        enum: [...MARK_KEYS, null],
        default: null,
      },
    },

    gameSessionId: {
      type: Schema.Types.ObjectId,
      ref: "GameSession",
      default: null,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    closeReason: {
      type: String,
      enum: ["admin_closed", "player_left", "finished", null],
      default: null,
    },

    closedByAdminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

onlineRoomSchema.index({ roomNumber: 1 }, { unique: true });
onlineRoomSchema.index({ status: 1 });
onlineRoomSchema.index({ player1UserId: 1 });
onlineRoomSchema.index({ player2UserId: 1 });

export default model("OnlineRoom", onlineRoomSchema);
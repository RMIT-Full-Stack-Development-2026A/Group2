import mongoose from "mongoose";
import { AI_LEVELS, BOARD_SIZES, BOARD_STYLES, MARK_KEYS } from "configs/config/gameCatalog.js";

const { Schema, model } = mongoose;

const participantSchema = new Schema(
  {
    seat: {
      type: Number,
      enum: [1, 2],
      required: true,
    },

    type: {
      type: String,
      enum: ["registered_user", "guest", "ai"],
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    displayNameNorm: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    aiLevel: {
      type: String,
      enum: [...AI_LEVELS, null],
      default: null,
    },

    selectedMarkKey: {
      type: String,
      enum: MARK_KEYS,
      required: true,
    },

    avatarAssetId: {
      type: Schema.Types.ObjectId,
      ref: "MediaAsset",
      default: null,
    },

    avatarUrl: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { _id: false }
);

const moveSchema = new Schema(
  {
    moveNo: {
      type: Number,
      required: true,
      min: 1,
    },

    seat: {
      type: Number,
      enum: [1, 2],
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    markKey: {
      type: String,
      enum: MARK_KEYS,
      required: true,
    },

    row: {
      type: Number,
      required: true,
      min: 0,
    },

    col: {
      type: Number,
      required: true,
      min: 0,
    },

    notation: {
      type: String,
      default: null,
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { _id: false }
);

const winningCellSchema = new Schema(
  {
    row: { type: Number, required: true, min: 0 },
    col: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const gameSessionSchema = new Schema(
  {
    sessionNumber: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    mode: {
      type: String,
      enum: ["single_player", "local_two_player", "online_multiplayer"],
      required: true,
    },

    status: {
      type: String,
      enum: ["in_progress", "finished", "aborted", "closed"],
      default: "in_progress",
      required: true,
    },

    boardSize: {
      type: Number,
      enum: BOARD_SIZES,
      default: 10,
      required: true,
    },

    boardStyleKey: {
      type: String,
      enum: BOARD_STYLES,
      default: "classic",
      required: true,
    },

    initiatedByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    firstTurnSeat: {
      type: Number,
      enum: [1, 2],
      required: true,
    },

    participants: {
      type: [participantSchema],
      validate: {
        validator: (value) => Array.isArray(value) && value.length === 2,
        message: "Game session must have exactly 2 participants.",
      },
      required: true,
    },

    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    outcome: {
      resultType: {
        type: String,
        enum: ["win", "aborted", "unfinished"],
        default: "unfinished",
        required: true,
      },

      winnerSeat: {
        type: Number,
        enum: [1, 2, null],
        default: null,
      },

      winningCells: {
        type: [winningCellSchema],
        default: [],
      },

      abortedBySeat: {
        type: Number,
        enum: [1, 2, null],
        default: null,
      },
    },

    moves: {
      type: [moveSchema],
      default: [],
    },

    search: {
      player2NameNorm: {
        type: String,
        default: null,
        trim: true,
        lowercase: true,
      },
    },

    onlineRoomId: {
      type: Schema.Types.ObjectId,
      ref: "OnlineRoom",
      default: null,
    },

    recordingAssetId: {
      type: Schema.Types.ObjectId,
      ref: "MediaAsset",
      default: null,
    },
  },
  { timestamps: true }
);

gameSessionSchema.index({ sessionNumber: 1 }, { unique: true });
gameSessionSchema.index({ "participants.userId": 1, startedAt: -1 });
gameSessionSchema.index({ "search.player2NameNorm": 1 });
gameSessionSchema.index({ mode: 1, status: 1 });
gameSessionSchema.index({ startedAt: -1 });

gameSessionSchema.pre("validate", function (next) {
  if (Array.isArray(this.participants)) {
    this.participants = this.participants.map((p) => ({
      ...p.toObject?.() ?? p,
      displayNameNorm: p.displayName?.trim().toLowerCase() || "",
    }));

    const seat2 = this.participants.find((p) => p.seat === 2);
    this.search.player2NameNorm = seat2?.displayName?.trim().toLowerCase() || null;
  }

  next();
});

export default model("GameSession", gameSessionSchema);
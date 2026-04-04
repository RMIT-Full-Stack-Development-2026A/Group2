import mongoose from "mongoose";

const boardStyleSchema = new mongoose.Schema(
  {
    uploadedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    boardSize: {
      type: Number,
      enum: [10, 15],
      default: 10,
      required: true,
    },
    style: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    styleType: {
      type: String,
      enum: ["preset", "custom"],
      default: "preset",
      required: true,
    },
    backgroundColor: {
      type: String,
      default: null,
      trim: true,
    },
    backgroundURL: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    versionKey: false,
  }
);

const BoardStyle = mongoose.model("BoardStyle", boardStyleSchema);

export default BoardStyle;
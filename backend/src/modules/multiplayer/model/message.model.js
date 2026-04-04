import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const messageSchema = new Schema(
  {
    roomId: {
      type: Types.ObjectId,
      ref: "OnlineGameRoom",
      required: true,
      index: true,
    },
    senderId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

export default model("Message", messageSchema);
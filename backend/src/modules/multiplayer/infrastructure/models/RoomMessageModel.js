import mongoose from "mongoose";

const { Schema, model } = mongoose;

const roomMessageSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "OnlineRoom",
      required: true,
      index: true,
    },

    senderUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    senderName: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    messageType: {
      type: String,
      enum: ["user", "system"],
      default: "user",
      required: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

roomMessageSchema.index({ roomId: 1, createdAt: 1 });
roomMessageSchema.index({ senderUserId: 1 });

export default model("RoomMessage", roomMessageSchema);
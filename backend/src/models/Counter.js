import mongoose from "mongoose";

const { Schema, model } = mongoose;

const counterSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    nextValue: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  { timestamps: true, _id: false }
);

export default model("Counter", counterSchema);
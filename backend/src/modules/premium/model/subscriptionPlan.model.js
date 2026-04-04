import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const subscriptionPlanSchema = new Schema(
  {
    planName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    durationMonths: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

export default model("SubscriptionPlan", subscriptionPlanSchema);


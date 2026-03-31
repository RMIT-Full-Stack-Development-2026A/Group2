import mongoose from "mongoose";

const { Schema, model } = mongoose;

const subscriptionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    provider: {
      type: String,
      enum: ["stripe", "paypal"],
      required: true,
    },

    providerCustomerId: {
      type: String,
      default: null,
      trim: true,
    },

    providerSubscriptionId: {
      type: String,
      default: null,
      trim: true,
    },

    planCode: {
      type: String,
      default: "premium_monthly",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
      default: 10,
    },

    currency: {
      type: String,
      required: true,
      default: "USD",
      uppercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "active", "expired", "cancelled", "failed"],
      required: true,
      default: "pending",
    },

    startsAt: {
      type: Date,
      default: null,
    },

    endsAt: {
      type: Date,
      default: null,
    },

    latestPaymentId: {
      type: Schema.Types.ObjectId,
      ref: "PaymentTransaction",
      default: null,
    },
  },
  { timestamps: true }
);

subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index(
  { providerSubscriptionId: 1 },
  { unique: true, sparse: true }
);

export default model("Subscription", subscriptionSchema);
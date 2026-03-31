import mongoose from "mongoose";

const { Schema, model } = mongoose;

const paymentTransactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },

    provider: {
      type: String,
      enum: ["stripe", "paypal"],
      required: true,
    },

    providerPaymentId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    providerSessionId: {
      type: String,
      default: null,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded"],
      required: true,
      default: "pending",
    },

    receiptUrl: {
      type: String,
      default: null,
      trim: true,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    rawStatus: {
      type: String,
      default: null,
      trim: true,
    },

    webhookEventId: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true }
);

paymentTransactionSchema.index({ providerPaymentId: 1 }, { unique: true });
paymentTransactionSchema.index({ providerSessionId: 1 });
paymentTransactionSchema.index({ userId: 1, createdAt: -1 });

export default model("PaymentTransaction", paymentTransactionSchema);
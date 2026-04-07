const mongoose = require("mongoose");

const TRANSACTION_STATUSES = ["pending", "success", "failed", "cancelled", "refunded"];

const transactionSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    walletID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      default: null,
    },
    userSubscriptionID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSubscription",
      default: null,
    },
    currency: {
      type: String,
      required: true,
      default: "USD",
      uppercase: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: TRANSACTION_STATUSES,
      default: "pending",
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
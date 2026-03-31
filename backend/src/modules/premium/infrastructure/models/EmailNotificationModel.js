import mongoose from "mongoose";

const { Schema, model } = mongoose;

const emailNotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    paymentTransactionId: {
      type: Schema.Types.ObjectId,
      ref: "PaymentTransaction",
      default: null,
    },

    type: {
      type: String,
      enum: ["premium_payment_success"],
      required: true,
    },

    toEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    providerMessageId: {
      type: String,
      default: null,
      trim: true,
    },

    status: {
      type: String,
      enum: ["queued", "sent", "failed"],
      default: "queued",
      required: true,
    },

    errorMessage: {
      type: String,
      default: null,
      trim: true,
    },

    sentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

emailNotificationSchema.index({ userId: 1, type: 1, createdAt: -1 });
emailNotificationSchema.index({ paymentTransactionId: 1 });
emailNotificationSchema.index({ status: 1 });

export default model("EmailNotification", emailNotificationSchema);
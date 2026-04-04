import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: { type: Number, default: 0 },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;

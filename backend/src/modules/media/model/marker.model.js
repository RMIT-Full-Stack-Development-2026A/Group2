const mongoose = require("mongoose");

const markerSchema = new mongoose.Schema(
  {
    uploadedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    markerType: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const Marker = mongoose.model("Marker", markerSchema);

module.exports = Marker;
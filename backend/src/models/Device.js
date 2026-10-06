const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    deviceName: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["ONLINE", "OFFLINE"],
      default: "OFFLINE",
    },

    registeredAt: {
      type: Date,
      default: Date.now,
    },

    lastSeen: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;

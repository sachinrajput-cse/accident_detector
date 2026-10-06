const mongoose = require("mongoose");

const telemetrySchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      trim: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },

    accelerometer: {
      x: {
        type: Number,
        default: null,
      },
      y: {
        type: Number,
        default: null,
      },
      z: {
        type: Number,
        default: null,
      },
    },

    gyroscope: {
      x: {
        type: Number,
        default: null,
      },
      y: {
        type: Number,
        default: null,
      },
      z: {
        type: Number,
        default: null,
      },
    },

    vibration: {
      type: Boolean,
      default: false,
    },

    gps: {
      latitude: {
        type: Number,
        default: null,
      },

      longitude: {
        type: Number,
        default: null,
      },

      speed: {
        type: Number,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Telemetry", telemetrySchema);
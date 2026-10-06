const mongoose = require("mongoose");

const telemetrySchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      index: true,
    },

    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
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

const Telemetry = mongoose.model("Telemetry", telemetrySchema);

module.exports = Telemetry;
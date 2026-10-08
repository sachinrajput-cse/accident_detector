const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
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

    type: {
      type: String,
      enum: [
        "ACCIDENT",
        "HARD_IMPACT",
        "ROLLOVER",
        "VIBRATION_ANOMALY",
        "OTHER",
      ],
      required: true,
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "DETECTED",
        "INVESTIGATING",
        "CONFIRMED",
        "DISMISSED",
        "RESOLVED",
        "CANCELLED",
      ],
      default: "DETECTED",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
    },

    sensorData: {
      accelerometer: {
        x: Number,
        y: Number,
        z: Number,
      },

      gyroscope: {
        x: Number,
        y: Number,
        z: Number,
      },

      vibration: {
        type: Boolean,
        default: false,
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

const Incident = mongoose.model("Incident", incidentSchema);

module.exports = Incident;
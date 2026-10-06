const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
    },

    timestamp: {
      type: Date,
      required: true,
    },

    event: {
      type: {
        type: String,
      },
      confidence: {
        type: Number,
      },
    },

    gps: {
      latitude: Number,
      longitude: Number,
      speedKmph: Number,
      fix: Boolean,
    },

    imu: {
      accelX: Number,
      accelY: Number,
      accelZ: Number,

      gyroX: Number,
      gyroY: Number,
      gyroZ: Number,

      temperature: Number,
    },

    vibration: {
      events: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SensorData", sensorDataSchema);
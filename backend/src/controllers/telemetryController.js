const Telemetry = require("../models/Telemetry");
const Device = require("../models/Device");
const Incident = require("../models/Incident");

const { detectAnomaly } = require("../services/anomalyService");

const createTelemetry = async (req, res) => {
  try {
    const {
      deviceId,
      timestamp,
      accelerometer,
      gyroscope,
      vibration,
      gps,
    } = req.body;

    // Check deviceId
    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: "deviceId is required",
      });
    }

    // Check whether device exists
    const device = await Device.findOne({ deviceId });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    // Save telemetry
    const telemetry = await Telemetry.create({
      deviceId,
      timestamp: timestamp || new Date(),
      accelerometer,
      gyroscope,
      vibration,
      gps,
    });

    // Update device status
    await Device.findOneAndUpdate(
      { deviceId },
      {
        status: "ONLINE",
        lastSeen: new Date(),
      }
    );

    // Run anomaly detection
    const anomalyResult = detectAnomaly({
      accelerometer,
      vibration,
      speed: gps?.speed,
    });

    let incident = null;

    // If anomaly detected, create an incident
    if (anomalyResult.anomaly) {
      incident = await Incident.create({
        deviceId,
        timestamp: timestamp || new Date(),

        type: anomalyResult.type,

        severity: anomalyResult.severity,

        status: "DETECTED",

        description: anomalyResult.description,

        location: {
          latitude: gps?.latitude || null,
          longitude: gps?.longitude || null,
        },

        sensorData: {
          accelerometer: accelerometer || {},
          gyroscope: gyroscope || {},
          vibration: vibration || false,
          speed: gps?.speed || null,
        },
      });
    }

    // Send response
    res.status(201).json({
      success: true,

      message: "Telemetry received successfully",

      telemetry,

      anomaly: {
        detected: anomalyResult.anomaly,
        type: anomalyResult.type,
        severity: anomalyResult.severity,
        description: anomalyResult.description,
        accelerationMagnitude:
          anomalyResult.accelerationMagnitude,
      },

      incident,
    });
  } catch (error) {
    console.error("========== TELEMETRY ERROR ==========");
    console.error(error);
    console.error("=====================================");

    res.status(500).json({
      success: false,
      message: "Failed to process telemetry",
      error: error.message,
    });
  }
};

module.exports = {
  createTelemetry,
};
const Incident = require("../models/Incident");
const Device = require("../models/Device");

const createIncident = async (req, res) => {
  try {
    const {
      deviceId,
      timestamp,
      type,
      severity,
      description,
      location,
      sensorData,
    } = req.body;

    // Check required fields
    if (!deviceId || !type || !severity) {
      return res.status(400).json({
        success: false,
        message: "deviceId, type and severity are required",
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

    // Create incident
    const incident = await Incident.create({
      deviceId,
      timestamp: timestamp || new Date(),
      type,
      severity,
      status: "DETECTED",
      description: description || "",
      location,
      sensorData,
    });

    // Update device status
    await Device.findOneAndUpdate(
      { deviceId },
      {
        status: "ONLINE",
        lastSeen: new Date(),
      }
    );

    res.status(201).json({
      success: true,
      message: "Incident created successfully",
      incident,
    });
  } catch (error) {
    console.error("========== INCIDENT ERROR ==========");
    console.error(error);
    console.error("====================================");

    res.status(500).json({
      success: false,
      message: "Failed to create incident",
      error: error.message,
    });
  }
};

module.exports = {
  createIncident,
};
const Device = require("../models/Device");

const registerDevice = async (req, res) => {
  try {
    const { deviceId, deviceName } = req.body;

    if (!deviceId || !deviceName) {
      return res.status(400).json({
        success: false,
        message: "deviceId and deviceName are required",
      });
    }

    const existingDevice = await Device.findOne({ deviceId });

    if (existingDevice) {
      return res.status(409).json({
        success: false,
        message: "Device already registered",
      });
    }

    const device = await Device.create({
      deviceId,
      deviceName,
      status: "ONLINE",
      lastSeen: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Device registered successfully",
      device,
    });
  } catch (error) {
    console.error("========== DEVICE ERROR ==========");
    console.error(error);
    console.error("==================================");

    res.status(500).json({
      success: false,
      message: "Failed to register device",
      error: error.message,
    });
  }
};


// ===============================
// DEVICE HEARTBEAT
// ===============================

const heartbeat = async (req, res) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: "deviceId is required",
      });
    }

    const device = await Device.findOneAndUpdate(
      { deviceId },
      {
        status: "ONLINE",
        lastSeen: new Date(),
      },
      {
        new: true,
      }
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Heartbeat received",
      device: {
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        status: device.status,
        lastSeen: device.lastSeen,
      },
    });
  } catch (error) {
    console.error("========== HEARTBEAT ERROR ==========");
    console.error(error);
    console.error("=====================================");

    res.status(500).json({
      success: false,
      message: "Failed to process heartbeat",
      error: error.message,
    });
  }
};


module.exports = {
  registerDevice,
  heartbeat,
};
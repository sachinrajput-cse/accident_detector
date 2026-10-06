const Device = require("../models/Device");
const Telemetry = require("../models/Telemetry");
const Incident = require("../models/Incident");

const getDashboardData = async (req, res) => {
  try {
    // Get all registered devices
    const devices = await Device.find()
      .sort({ updatedAt: -1 })
      .lean();

    // Get latest telemetry for each device
    const devicesWithTelemetry = await Promise.all(
      devices.map(async (device) => {
        const latestTelemetry = await Telemetry.findOne({
          deviceId: device.deviceId,
        })
          .sort({ timestamp: -1 })
          .lean();

        return {
          ...device,
          latestTelemetry,
        };
      })
    );

    // Get active incidents
    const activeIncidents = await Incident.find({
      status: {
        $in: ["DETECTED", "INVESTIGATING"],
      },
    })
      .sort({ timestamp: -1 })
      .lean();

    // Get recent incidents
    const recentIncidents = await Incident.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    // Count devices
    const totalDevices = devices.length;

    const onlineDevices = devices.filter(
      (device) => device.status === "ONLINE"
    ).length;

    const offlineDevices = devices.filter(
      (device) => device.status === "OFFLINE"
    ).length;

    // Count active incidents
    const activeIncidentCount = activeIncidents.length;

    res.status(200).json({
      success: true,

      dashboard: {
        statistics: {
          totalDevices,
          onlineDevices,
          offlineDevices,
          activeIncidents: activeIncidentCount,
        },

        devices: devicesWithTelemetry,

        activeIncidents,

        recentIncidents,
      },
    });
  } catch (error) {
    console.error("========== DASHBOARD ERROR ==========");
    console.error(error);
    console.error("=====================================");

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardData,
};
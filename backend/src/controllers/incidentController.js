const Incident = require("../models/Incident");
const Device = require("../models/Device");

// =====================================================
// CREATE INCIDENT
// POST /api/v1/incidents/
// =====================================================

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

    // Check device
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
      location: location || {},
      sensorData: sensorData || {},
    });

    // Update device
    await Device.findOneAndUpdate(
      { deviceId },
      {
        status: "ONLINE",
        lastSeen: new Date(),
      }
    );

    return res.status(201).json({
      success: true,
      message: "Incident created successfully",
      incident,
    });

  } catch (error) {
    console.error("========== CREATE INCIDENT ERROR ==========");
    console.error(error);
    console.error("===========================================");

    return res.status(500).json({
      success: false,
      message: "Failed to create incident",
      error: error.message,
    });
  }
};


// =====================================================
// CANCEL INCIDENT
// DETECTED / ACKNOWLEDGED -> CANCELLED
// =====================================================
//
// PATCH /api/v1/incidents/:id/cancel
//
// =====================================================
// CANCEL INCIDENT FROM DEVICE
// POST /api/v1/incidents/cancel
// Body: { vehicleId: "PI002" }
// =====================================================

const cancelIncident = async (req, res) => {
  try {
    const { vehicleId } = req.body;

    // Check vehicle/device ID
    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: "vehicleId is required",
      });
    }

    // Find the latest active incident for this device
    const incident = await Incident.findOne({
      deviceId: vehicleId,
      status: { $in: ["DETECTED", "ACKNOWLEDGED", "CANCELLED"] },
    }).sort({ createdAt: -1 });

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "No active incident found for this vehicle",
      });
    }

    // Cancel incident
    incident.status = "CANCELLED";
    incident.cancelledAt = new Date();
    incident.cancellationReason = "Cancelled by device";

    await incident.save();

    return res.status(200).json({
      success: true,
      message: "Incident cancelled successfully",
      incident,
    });

  } catch (error) {
    console.error("========== CANCEL INCIDENT ERROR ==========");
    console.error(error);
    console.error("===========================================");

    return res.status(500).json({
      success: false,
      message: "Failed to cancel incident",
      error: error.message,
    });
  }
};
// =====================================================
// GET ALL INCIDENTS
// GET /api/v1/incidents/
// =====================================================

const getIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: incidents.length,
      incidents,
    });

  } catch (error) {
    console.error("========== GET INCIDENTS ERROR ==========");
    console.error(error);
    console.error("=========================================");

    return res.status(500).json({
      success: false,
      message: "Failed to fetch incidents",
      error: error.message,
    });
  }
};


// =====================================================
// GET SINGLE INCIDENT
// GET /api/v1/incidents/:id
// =====================================================

const getIncidentById = async (req, res) => {
  try {
    const { id } = req.params;

    const incident = await Incident.findById(id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    return res.status(200).json({
      success: true,
      incident,
    });

  } catch (error) {
    console.error("========== GET INCIDENT ERROR ==========");
    console.error(error);
    console.error("========================================");

    return res.status(500).json({
      success: false,
      message: "Failed to fetch incident",
      error: error.message,
    });
  }
};


// =====================================================
// ACKNOWLEDGE INCIDENT
// DETECTED -> ACKNOWLEDGED
// PATCH /api/v1/incidents/:id/acknowledge
// =====================================================

const acknowledgeIncident = async (req, res) => {
  try {
    const { id } = req.params;

    const incident = await Incident.findById(id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    if (incident.status === "RESOLVED") {
      return res.status(400).json({
        success: false,
        message: "Resolved incident cannot be acknowledged",
      });
    }

    if (incident.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Cancelled incident cannot be acknowledged",
      });
    }

    if (incident.status === "ACKNOWLEDGED") {
      return res.status(400).json({
        success: false,
        message: "Incident is already acknowledged",
      });
    }

    incident.status = "ACKNOWLEDGED";

    await incident.save();

    return res.status(200).json({
      success: true,
      message: "Incident acknowledged successfully",
      incident,
    });

  } catch (error) {
    console.error("========== ACKNOWLEDGE INCIDENT ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to acknowledge incident",
      error: error.message,
    });
  }
};


// =====================================================
// RESOLVE INCIDENT
// DETECTED / ACKNOWLEDGED -> RESOLVED
// PATCH /api/v1/incidents/:id/resolve
// =====================================================

const resolveIncident = async (req, res) => {
  try {
    const { id } = req.params;

    const incident = await Incident.findById(id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    if (incident.status === "RESOLVED") {
      return res.status(400).json({
        success: false,
        message: "Incident is already resolved",
      });
    }

    if (incident.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Cancelled incident cannot be resolved",
      });
    }

    incident.status = "RESOLVED";

    await incident.save();

    return res.status(200).json({
      success: true,
      message: "Incident resolved successfully",
      incident,
    });

  } catch (error) {
    console.error("========== RESOLVE INCIDENT ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to resolve incident",
      error: error.message,
    });
  }
};


// =====================================================
// EXPORT
// =====================================================



module.exports = {
  createIncident,
  cancelIncident,
  getIncidents,
  getIncidentById,
  acknowledgeIncident,
  resolveIncident,
};
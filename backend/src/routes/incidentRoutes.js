const express = require("express");

const {
  createIncident,
  getIncidents,
  getIncidentById,
  acknowledgeIncident,
  resolveIncident,
  cancelIncident
} = require("../controllers/incidentController");

const router = express.Router();

// Create incident
router.post("/", createIncident);

// Get all incidents
router.get("/", getIncidents);

// Get one incident
router.get("/:id", getIncidentById);

// Acknowledge incident
router.patch("/:id/acknowledge", acknowledgeIncident);

// Resolve incident
router.patch("/:id/resolve", resolveIncident);

router.post("/cancel", cancelIncident);
module.exports = router;
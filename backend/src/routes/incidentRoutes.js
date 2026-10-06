const express = require("express");

const {
  createIncident,
} = require("../controllers/incidentController");

const router = express.Router();

router.post("/", createIncident);

module.exports = router;
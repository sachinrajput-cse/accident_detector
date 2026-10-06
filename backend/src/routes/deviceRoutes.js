const express = require("express");

const {
  registerDevice,
  heartbeat,
} = require("../controllers/deviceController");

const router = express.Router();

router.post("/register", registerDevice);

router.post("/heartbeat", heartbeat);

module.exports = router;
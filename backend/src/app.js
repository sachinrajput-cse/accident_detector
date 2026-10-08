const express = require("express");
const cors = require("cors");

const deviceRoutes = require("./routes/deviceRoutes");
const telemetryRoutes = require("./routes/telemetryRoutes");
const incidentRoutes = require("./routes/incidentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// ================================
// CORS
// ================================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://accident-detector-indol.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ================================
// JSON BODY PARSER
// ================================
app.use(express.json());

// ================================
// HEALTH CHECK
// ================================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Accident Alert Backend is running",
  });
});

// ================================
// API ROUTES
// ================================

app.use("/api/v1/devices", deviceRoutes);

app.use("/api/v1/telemetry", telemetryRoutes);

app.use("/api/v1/incidents", incidentRoutes);

app.use("/api/v1/dashboard", dashboardRoutes);

// ================================
// 404 HANDLER
// ================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ================================
// ERROR HANDLER
// ================================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;

import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import SensorChart from "./SensorChart";

const API_URL = "http://localhost:5000";

function App() {
  // =====================================================
  // STATE
  // =====================================================

  const [dashboard, setDashboard] = useState(null);
  const [latestSensor, setLatestSensor] = useState(null);
  const [sensorHistory, setSensorHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH DASHBOARD
  // =====================================================

  const fetchDashboard = async () => {
    try {
      console.log("Fetching dashboard...");

      const response = await axios.get(
        `${API_URL}/api/v1/dashboard`,
        {
          timeout: 5000,
        }
      );

      console.log("Dashboard response:", response.data);

      // Check response
      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Backend returned an unsuccessful response"
        );
      }

      const dashboardData = response.data.dashboard;

      if (!dashboardData) {
        throw new Error("Dashboard data is missing");
      }

      // =================================================
      // SAVE DASHBOARD
      // =================================================

      setDashboard(dashboardData);

      // =================================================
      // GET LATEST TELEMETRY
      //
      // Backend response:
      //
      // dashboard
      //   └── devices
      //       └── latestTelemetry
      //
      // =================================================

      const latestTelemetry =
        dashboardData?.devices?.[0]?.latestTelemetry || null;

      console.log(
        "Latest telemetry:",
        latestTelemetry
      );

      // =================================================
      // SAVE SENSOR DATA
      // =================================================

      if (latestTelemetry) {
        setLatestSensor(latestTelemetry);

        // Add only new telemetry records
        setSensorHistory((previousHistory) => {
          const alreadyExists = previousHistory.some(
            (item) => item._id === latestTelemetry._id
          );

          if (alreadyExists) {
            return previousHistory;
          }

          const updatedHistory = [
            ...previousHistory,
            latestTelemetry,
          ];

          // Keep last 20 readings
          return updatedHistory.slice(-20);
        });
      }

      setError("");
    } catch (err) {
      console.error(
        "Dashboard fetch error:",
        err
      );

      // Server responded with an error
      if (err.response) {
        console.error(
          "Status:",
          err.response.status
        );

        console.error(
          "Backend response:",
          err.response.data
        );

        setError(
          err.response.data?.message ||
            `Backend returned status ${err.response.status}`
        );
      }

      // Request was sent but no response
      else if (err.request) {
        setError(
          "Unable to connect to backend. Make sure the backend is running on port 5000."
        );
      }

      // Something else went wrong
      else {
        setError(
          err.message ||
            "Unable to load dashboard"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD + AUTO REFRESH
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      if (!mounted) return;

      await fetchDashboard();
    };

    loadDashboard();

    // Refresh every 5 seconds
    const interval = setInterval(() => {
      loadDashboard();
    }, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="loading">
        <h2>
          Loading Accident Detection Dashboard...
        </h2>

        <p>
          Connecting to backend...
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR SCREEN
  // =====================================================

  if (error) {
    return (
      <div className="error">
        <h2>
          Unable to load dashboard
        </h2>

        <p>{error}</p>

        <button onClick={fetchDashboard}>
          Try Again
        </button>
      </div>
    );
  }

  // =====================================================
  // NO DASHBOARD
  // =====================================================

  if (!dashboard) {
    return (
      <div className="error">
        <h2>
          No dashboard data available
        </h2>

        <button onClick={fetchDashboard}>
          Reload
        </button>
      </div>
    );
  }

  // =====================================================
  // DASHBOARD DATA
  // =====================================================

  const stats =
    dashboard.statistics || {};

  const devices =
    dashboard.devices || [];

  const activeIncidents =
    dashboard.activeIncidents || [];

  const recentIncidents =
    dashboard.recentIncidents || [];

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="dashboard">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="header">
        <div>
          <h1>
            Accident Detection System
          </h1>

          <p>
            Real-time vehicle monitoring dashboard
          </p>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          System Online
        </div>
      </header>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <section className="stats-grid">

        <div className="stat-card">
          <h3>
            Total Vehicles
          </h3>

          <p>
            {stats.totalDevices ?? 0}
          </p>
        </div>

        <div className="stat-card online">
          <h3>
            Online Vehicles
          </h3>

          <p>
            {stats.onlineDevices ?? 0}
          </p>
        </div>

        <div className="stat-card offline">
          <h3>
            Offline Vehicles
          </h3>

          <p>
            {stats.offlineDevices ?? 0}
          </p>
        </div>

        <div className="stat-card danger">
          <h3>
            Active Incidents
          </h3>

          <p>
            {stats.activeIncidents ?? 0}
          </p>
        </div>

      </section>

      {/* =================================================
          LATEST SENSOR DATA
      ================================================= */}

      <section className="panel">

        <h2>
          Latest Sensor Data
        </h2>

        {!latestSensor ? (
          <div className="safe">
            No sensor data available.
          </div>
        ) : (
          <div className="sensor-data">

            {/* DEVICE */}

            <div className="sensor-item">
              <h3>
                Device
              </h3>

              <p>
                {latestSensor.deviceId || "N/A"}
              </p>
            </div>

            {/* TIMESTAMP */}

            <div className="sensor-item">
              <h3>
                Timestamp
              </h3>

              <p>
                {latestSensor.timestamp
                  ? new Date(
                      latestSensor.timestamp
                    ).toLocaleString()
                  : "N/A"}
              </p>
            </div>

            {/* ACCELEROMETER X */}

            <div className="sensor-item">
              <h3>
                Accel X
              </h3>

              <p>
                {latestSensor.accelerometer?.x ?? 0}
              </p>
            </div>

            {/* ACCELEROMETER Y */}

            <div className="sensor-item">
              <h3>
                Accel Y
              </h3>

              <p>
                {latestSensor.accelerometer?.y ?? 0}
              </p>
            </div>

            {/* ACCELEROMETER Z */}

            <div className="sensor-item">
              <h3>
                Accel Z
              </h3>

              <p>
                {latestSensor.accelerometer?.z ?? 0}
              </p>
            </div>

            {/* GYROSCOPE X */}

            <div className="sensor-item">
              <h3>
                Gyro X
              </h3>

              <p>
                {latestSensor.gyroscope?.x ?? 0}
              </p>
            </div>

            {/* GYROSCOPE Y */}

            <div className="sensor-item">
              <h3>
                Gyro Y
              </h3>

              <p>
                {latestSensor.gyroscope?.y ?? 0}
              </p>
            </div>

            {/* GYROSCOPE Z */}

            <div className="sensor-item">
              <h3>
                Gyro Z
              </h3>

              <p>
                {latestSensor.gyroscope?.z ?? 0}
              </p>
            </div>

            {/* SPEED */}

            <div className="sensor-item">
              <h3>
                Speed
              </h3>

              <p>
                {latestSensor.gps?.speed ?? 0} km/h
              </p>
            </div>

            {/* LATITUDE */}

            <div className="sensor-item">
              <h3>
                Latitude
              </h3>

              <p>
                {latestSensor.gps?.latitude ?? "N/A"}
              </p>
            </div>

            {/* LONGITUDE */}

            <div className="sensor-item">
              <h3>
                Longitude
              </h3>

              <p>
                {latestSensor.gps?.longitude ?? "N/A"}
              </p>
            </div>

            {/* VIBRATION */}

            <div className="sensor-item">
              <h3>
                Vibration
              </h3>

              <p>
                {latestSensor.vibration
                  ? "DETECTED"
                  : "NORMAL"}
              </p>
            </div>

          </div>
        )}

      </section>

      {/* =================================================
          LIVE SENSOR HISTORY
      ================================================= */}

      <section className="panel">

        <h2>
          Live Sensor History
        </h2>

        {sensorHistory.length === 0 ? (
          <p>
            Waiting for sensor data...
          </p>
        ) : (
          <SensorChart
            data={sensorHistory}
          />
        )}

      </section>

      {/* =================================================
          VEHICLE STATUS
      ================================================= */}

      <section className="panel">

        <h2>
          Vehicle Status
        </h2>

        {devices.length === 0 ? (
          <p>
            No vehicles registered.
          </p>
        ) : (
          devices.map((device) => (
            <div
              className="vehicle"
              key={device.deviceId}
            >

              <div>
                <h3>
                  {device.deviceName ||
                    "Unknown Vehicle"}
                </h3>

                <p>
                  {device.deviceId}
                </p>

                {device.lastSeen && (
                  <small>
                    Last seen:{" "}
                    {new Date(
                      device.lastSeen
                    ).toLocaleString()}
                  </small>
                )}
              </div>

              <span
                className={
                  device.status === "ONLINE"
                    ? "badge online-badge"
                    : "badge offline-badge"
                }
              >
                {device.status}
              </span>

            </div>
          ))
        )}

      </section>

      {/* =================================================
          ACTIVE INCIDENTS
      ================================================= */}

      <section className="panel incident-panel">

        <h2>
          Active Incidents
        </h2>

        {activeIncidents.length === 0 ? (
          <div className="safe">
            ✓ No active incidents
          </div>
        ) : (
          activeIncidents.map((incident) => (
            <div
              className="incident"
              key={incident._id}
            >

              <div>

                <h3>
                  ⚠ {incident.type}
                </h3>

                <p>
                  Vehicle:{" "}
                  {incident.deviceId}
                </p>

                <p>
                  Severity:{" "}
                  {incident.severity}
                </p>

                <p>
                  {incident.description}
                </p>

                <p>
                  Speed:{" "}
                  {incident.sensorData?.speed ??
                    0} km/h
                </p>

                <p>
                  Location:{" "}
                  {incident.location?.latitude ??
                    "N/A"}
                  ,{" "}
                  {incident.location?.longitude ??
                    "N/A"}
                </p>

                <p>
                  Time:{" "}
                  {incident.timestamp
                    ? new Date(
                        incident.timestamp
                      ).toLocaleString()
                    : "N/A"}
                </p>

              </div>

              <span className="severity">
                {incident.severity}
              </span>

            </div>
          ))
        )}

      </section>

      {/* =================================================
          RECENT INCIDENTS
      ================================================= */}

      <section className="panel">

        <h2>
          Recent Incidents
        </h2>

        {recentIncidents.length === 0 ? (
          <p>
            No incidents recorded.
          </p>
        ) : (
          <div className="incident-list">

            {recentIncidents.map(
              (incident) => (
                <div
                  className="incident-row"
                  key={incident._id}
                >

                  <span>
                    {incident.deviceId}
                  </span>

                  <span>
                    {incident.type}
                  </span>

                  <span>
                    {incident.severity}
                  </span>

                  <span>
                    {incident.status}
                  </span>

                  <span>
                    {incident.timestamp
                      ? new Date(
                          incident.timestamp
                        ).toLocaleString()
                      : "N/A"}
                  </span>

                </div>
              )
            )}

          </div>
        )}

      </section>

    </div>
  );
}

export default App;
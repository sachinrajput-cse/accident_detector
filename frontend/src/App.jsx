import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import SensorChart from "./SensorChart";

function App() {
  const [dashboard, setDashboard] = useState(null);
  const [latestSensor, setLatestSensor] = useState(null);
  const [sensorHistory, setSensorHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH DASHBOARD
  // ==========================================

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/dashboard"
      );

      const dashboardData = response.data.dashboard;

      // Save dashboard
      setDashboard(dashboardData);

      // ========================================
      // GET LATEST TELEMETRY FROM DASHBOARD
      // ========================================

      const telemetry =
        dashboardData.devices?.[0]?.latestTelemetry;

      if (telemetry) {
        // Save latest sensor
        setLatestSensor(telemetry);

        // Add telemetry to history
        setSensorHistory((previousData) => {
          const newHistory = [
            ...previousData,
            telemetry,
          ];

          // Keep only last 20 readings
          return newHistory.slice(-20);
        });
      }

      setError("");
    } catch (err) {
      console.error("Dashboard error:", err);

      if (err.response) {
        console.error(
          "Backend response:",
          err.response.data
        );

        setError(
          `Backend error: ${err.response.status}`
        );
      } else if (err.request) {
        console.error(
          "Backend did not respond:",
          err.request
        );

        setError(
          "Backend did not respond"
        );
      } else {
        console.error(
          "Request error:",
          err.message
        );

        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD + REFRESH EVERY 5 SECONDS
  // ==========================================

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(() => {
      fetchDashboard();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="loading">
        Loading Accident Detection Dashboard...
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="error">
        <h2>{error}</h2>

        <p>
          Make sure your backend is running on
          port 5000.
        </p>

        <button onClick={fetchDashboard}>
          Try Again
        </button>
      </div>
    );
  }

  // ==========================================
  // NO DASHBOARD
  // ==========================================

  if (!dashboard) {
    return (
      <div className="error">
        <h2>No dashboard data received</h2>
      </div>
    );
  }

  const stats = dashboard.statistics;

  // ==========================================
  // MAIN DASHBOARD
  // ==========================================

  return (
    <div className="dashboard">

      {/* ======================================
          HEADER
      ====================================== */}

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


      {/* ======================================
          STATISTICS
      ====================================== */}

      <section className="stats-grid">

        <div className="stat-card">
          <h3>Total Vehicles</h3>
          <p>{stats.totalDevices}</p>
        </div>

        <div className="stat-card online">
          <h3>Online Vehicles</h3>
          <p>{stats.onlineDevices}</p>
        </div>

        <div className="stat-card offline">
          <h3>Offline Vehicles</h3>
          <p>{stats.offlineDevices}</p>
        </div>

        <div className="stat-card danger">
          <h3>Active Incidents</h3>
          <p>{stats.activeIncidents}</p>
        </div>

      </section>


      {/* ======================================
          LATEST SENSOR DATA
      ====================================== */}

      <section className="panel">

        <h2>Latest Sensor Data</h2>

        {!latestSensor ? (

          <p>
            No sensor data available.
          </p>

        ) : (

          <div className="sensor-data">

            {/* Device */}

            <div className="sensor-item">
              <h3>Device</h3>

              <p>
                {latestSensor.deviceId}
              </p>
            </div>


            {/* Timestamp */}

            <div className="sensor-item">
              <h3>Timestamp</h3>

              <p>
                {latestSensor.timestamp
                  ? new Date(
                      latestSensor.timestamp
                    ).toLocaleString()
                  : "N/A"}
              </p>
            </div>


            {/* Accelerometer */}

            <div className="sensor-item">
              <h3>Accel X</h3>

              <p>
                {latestSensor.accelerometer?.x ?? 0}
              </p>
            </div>

            <div className="sensor-item">
              <h3>Accel Y</h3>

              <p>
                {latestSensor.accelerometer?.y ?? 0}
              </p>
            </div>

            <div className="sensor-item">
              <h3>Accel Z</h3>

              <p>
                {latestSensor.accelerometer?.z ?? 0}
              </p>
            </div>


            {/* Gyroscope */}

            <div className="sensor-item">
              <h3>Gyro X</h3>

              <p>
                {latestSensor.gyroscope?.x ?? 0}
              </p>
            </div>

            <div className="sensor-item">
              <h3>Gyro Y</h3>

              <p>
                {latestSensor.gyroscope?.y ?? 0}
              </p>
            </div>

            <div className="sensor-item">
              <h3>Gyro Z</h3>

              <p>
                {latestSensor.gyroscope?.z ?? 0}
              </p>
            </div>


            {/* Speed */}

            <div className="sensor-item">
              <h3>Speed</h3>

              <p>
                {latestSensor.gps?.speed ?? 0} km/h
              </p>
            </div>


            {/* Latitude */}

            <div className="sensor-item">
              <h3>Latitude</h3>

              <p>
                {latestSensor.gps?.latitude ?? 0}
              </p>
            </div>


            {/* Longitude */}

            <div className="sensor-item">
              <h3>Longitude</h3>

              <p>
                {latestSensor.gps?.longitude ?? 0}
              </p>
            </div>


            {/* Vibration */}

            <div className="sensor-item">
              <h3>Vibration</h3>

              <p>
                {latestSensor.vibration
                  ? "DETECTED"
                  : "NORMAL"}
              </p>
            </div>

          </div>

        )}

      </section>


      {/* ======================================
          LIVE SENSOR HISTORY
      ====================================== */}

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


      {/* ======================================
          VEHICLES + ACTIVE INCIDENTS
      ====================================== */}

      <section className="content-grid">

        {/* ====================================
            VEHICLE STATUS
        ==================================== */}

        <div className="panel">

          <h2>
            Vehicle Status
          </h2>

          {dashboard.devices.length === 0 ? (

            <p>
              No vehicles registered.
            </p>

          ) : (

            dashboard.devices.map(
              (device) => (

                <div
                  className="vehicle"
                  key={device.deviceId}
                >

                  <div>

                    <h3>
                      {device.deviceName}
                    </h3>

                    <p>
                      {device.deviceId}
                    </p>

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

              )
            )

          )}

        </div>


        {/* ====================================
            ACTIVE INCIDENTS
        ==================================== */}

        <div className="panel incident-panel">

          <h2>
            Active Incidents
          </h2>

          {dashboard.activeIncidents.length === 0 ? (

            <div className="safe">
              ✓ No active incidents
            </div>

          ) : (

            dashboard.activeIncidents.map(
              (incident) => (

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
                      {incident.description}
                    </p>

                  </div>

                  <span className="severity">
                    {incident.severity}
                  </span>

                </div>

              )
            )

          )}

        </div>

      </section>


      {/* ======================================
          RECENT INCIDENTS
      ====================================== */}

      <section className="panel">

        <h2>
          Recent Incidents
        </h2>

        {dashboard.recentIncidents.length === 0 ? (

          <p>
            No incidents recorded.
          </p>

        ) : (

          <div className="incident-list">

            {dashboard.recentIncidents.map(
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
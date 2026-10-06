import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import SensorChart from "./SensorChart";

function App() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Sensor history for chart
  const [sensorHistory, setSensorHistory] = useState([]);

  // Latest sensor reading
  const [latestSensor, setLatestSensor] = useState(null);

  const fetchDashboard = async () => {
    try {
      // ==========================================
      // 1. GET DASHBOARD DATA
      // ==========================================
      const dashboardResponse = await axios.get(
        "http://localhost:5000/api/v1/dashboard"
      );

      setDashboard(dashboardResponse.data.dashboard);

      // ==========================================
      // 2. GET LATEST SENSOR DATA
      // ==========================================
      //const sensorResponse = await axios.get(
        //"http://localhost:5000/api/v1/sensors/latest"
      //);

      //const sensorData = sensorResponse.data;

      // Save latest sensor data
      //setLatestSensor(sensorData);

      // Add new sensor reading to history
      //setSensorHistory((previousData) => {
      //   const newHistory = [
      //     ...previousData,
      //     sensorData
      //   ];

      //   // Keep only latest 20 readings
      //   return newHistory.slice(-20);
      // });

      setError("");
    } catch (err) {
      console.error("Dashboard/Sensor error:", err);

      setError("Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH DATA WHEN PAGE LOADS
  // AND EVERY 5 SECONDS
  // ==========================================
  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(() => {
      fetchDashboard();
    }, 5000);

    return () => clearInterval(interval);
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
          Make sure your backend is running on port 5000.
        </p>

        <button onClick={fetchDashboard}>
          Try Again
        </button>
      </div>
    );
  }

  // Prevent crash if dashboard is empty
  if (!dashboard) {
    return (
      <div className="error">
        <h2>No dashboard data received</h2>
      </div>
    );
  }

  const stats = dashboard.statistics;

  return (
    <div className="dashboard">

      {/* ==========================================
          HEADER
      ========================================== */}

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


      {/* ==========================================
          STATISTICS
      ========================================== */}

      <section className="stats-grid">

        <div className="stat-card">
          <h3>Total Vehicles</h3>

          <p>
            {stats.totalDevices}
          </p>
        </div>


        <div className="stat-card online">
          <h3>Online Vehicles</h3>

          <p>
            {stats.onlineDevices}
          </p>
        </div>


        <div className="stat-card offline">
          <h3>Offline Vehicles</h3>

          <p>
            {stats.offlineDevices}
          </p>
        </div>


        <div className="stat-card danger">
          <h3>Active Incidents</h3>

          <p>
            {stats.activeIncidents}
          </p>
        </div>

      </section>


      {/* ==========================================
          LATEST SENSOR DATA
      ========================================== */}

      <section className="panel">

        <h2>
          Latest Sensor Data
        </h2>

        {latestSensor ? (

          <div className="sensor-data">

            {/* Device */}

            <div className="sensor-item">

              <h3>
                Device
              </h3>

              <p>
                {latestSensor.deviceId}
              </p>

            </div>


            {/* Timestamp */}

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


            {/* Accident Event */}

            <div className="sensor-item">

              <h3>
                Event
              </h3>

              <p>
                {latestSensor.event?.type || "N/A"}
              </p>

            </div>


            {/* Confidence */}

            <div className="sensor-item">

              <h3>
                Confidence
              </h3>

              <p>
                {latestSensor.event?.confidence !== undefined
                  ? `${(
                      latestSensor.event.confidence * 100
                    ).toFixed(1)}%`
                  : "N/A"}
              </p>

            </div>


            {/* Acceleration X */}

            <div className="sensor-item">

              <h3>
                Accel X
              </h3>

              <p>
                {latestSensor.imu?.accelX ?? 0}
              </p>

            </div>


            {/* Acceleration Y */}

            <div className="sensor-item">

              <h3>
                Accel Y
              </h3>

              <p>
                {latestSensor.imu?.accelY ?? 0}
              </p>

            </div>


            {/* Acceleration Z */}

            <div className="sensor-item">

              <h3>
                Accel Z
              </h3>

              <p>
                {latestSensor.imu?.accelZ ?? 0}
              </p>

            </div>


            {/* Gyroscope X */}

            <div className="sensor-item">

              <h3>
                Gyro X
              </h3>

              <p>
                {latestSensor.imu?.gyroX ?? 0}
              </p>

            </div>


            {/* Gyroscope Y */}

            <div className="sensor-item">

              <h3>
                Gyro Y
              </h3>

              <p>
                {latestSensor.imu?.gyroY ?? 0}
              </p>

            </div>


            {/* Gyroscope Z */}

            <div className="sensor-item">

              <h3>
                Gyro Z
              </h3>

              <p>
                {latestSensor.imu?.gyroZ ?? 0}
              </p>

            </div>


            {/* Temperature */}

            <div className="sensor-item">

              <h3>
                Temperature
              </h3>

              <p>
                {latestSensor.imu?.temperature ?? 0}
                {" °C"}
              </p>

            </div>


            {/* Speed */}

            <div className="sensor-item">

              <h3>
                Speed
              </h3>

              <p>
                {latestSensor.gps?.speedKmph ?? 0}
                {" km/h"}
              </p>

            </div>


            {/* Vibration */}

            <div className="sensor-item">

              <h3>
                Vibration Events
              </h3>

              <p>
                {latestSensor.vibration?.events ?? 0}
              </p>

            </div>

          </div>

        ) : (

          <p>
            No sensor data available.
          </p>

        )}

      </section>


      {/* ==========================================
          SENSOR CHART
      ========================================== */}

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


      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <section className="content-grid">


        {/* ========================================
            VEHICLES
        ======================================== */}

        <div className="panel">

          <h2>
            Vehicle Status
          </h2>

          {dashboard.devices.length === 0 ? (

            <p>
              No vehicles registered.
            </p>

          ) : (

            dashboard.devices.map((device) => (

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

            ))

          )}

        </div>


        {/* ========================================
            ACTIVE INCIDENTS
        ======================================== */}

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
                      Vehicle: {incident.deviceId}
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


      {/* ==========================================
          RECENT INCIDENTS
      ========================================== */}

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
function SensorChart({ sensorHistory }) {
  return (
    <div className="panel">
      <h2>Sensor Monitoring</h2>

      {sensorHistory.length === 0 ? (
        <p>No sensor data available.</p>
      ) : (
        <div>
          {sensorHistory.map((data, index) => (
            <div key={index}>
              <p>
                Vibration: {data.vibration}
              </p>

              <p>
                Acceleration: {data.acceleration}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SensorChart;
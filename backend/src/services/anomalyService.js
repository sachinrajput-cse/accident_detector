const calculateAccelerationMagnitude = (accelerometer) => {
  const { x = 0, y = 0, z = 0 } = accelerometer || {};

  return Math.sqrt(
    x * x +
    y * y +
    z * z
  );
};

const detectAnomaly = ({
  accelerometer,
  vibration,
  speed,
}) => {
  const accelerationMagnitude =
    calculateAccelerationMagnitude(accelerometer);

  // Initial thresholds.
  // We will tune these later using your actual sensor data.
  const ACCELERATION_THRESHOLD = 15;
  const HIGH_ACCELERATION_THRESHOLD = 25;

  let anomaly = false;
  let type = "OTHER";
  let severity = "LOW";
  let description = "Normal sensor readings";

  if (
    accelerationMagnitude >= HIGH_ACCELERATION_THRESHOLD &&
    vibration === true
  ) {
    anomaly = true;
    type = "ACCIDENT";
    severity = "CRITICAL";

    description =
      "High acceleration and vibration detected. Possible accident.";
  } else if (
    accelerationMagnitude >= ACCELERATION_THRESHOLD &&
    vibration === true
  ) {
    anomaly = true;
    type = "HARD_IMPACT";
    severity = "HIGH";

    description =
      "High acceleration with vibration detected. Possible hard impact.";
  } else if (vibration === true) {
    anomaly = true;
    type = "VIBRATION_ANOMALY";
    severity = "MEDIUM";

    description =
      "Abnormal vibration detected.";
  }

  return {
    anomaly,
    type,
    severity,
    description,
    accelerationMagnitude,
    speed: speed || 0,
  };
};

module.exports = {
  calculateAccelerationMagnitude,
  detectAnomaly,
};
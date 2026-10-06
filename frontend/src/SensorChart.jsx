import React from "react";

function SensorChart({ data = [] }) {
  // Make sure data is always an array
  const sensorData = Array.isArray(data) ? data : [];

  // No data
  if (sensorData.length === 0) {
    return (
      <div
        style={{
          padding: "30px",
          textAlign: "center",
          color: "#666",
        }}
      >
        Waiting for sensor data...
      </div>
    );
  }

  // Get maximum value for chart scaling
  const getMaxValue = () => {
    let max = 1;

    sensorData.forEach((item) => {
      const x = Number(item?.accelerometer?.x) || 0;
      const y = Number(item?.accelerometer?.y) || 0;
      const z = Number(item?.accelerometer?.z) || 0;

      max = Math.max(max, Math.abs(x), Math.abs(y), Math.abs(z));
    });

    return max;
  };

  const maxValue = getMaxValue();

  // Chart dimensions
  const width = 900;
  const height = 350;

  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 50;

  const chartWidth =
    width - paddingLeft - paddingRight;

  const chartHeight =
    height - paddingTop - paddingBottom;

  // Convert sensor value to SVG Y coordinate
  const getY = (value) => {
    const numericValue = Number(value) || 0;

    return (
      paddingTop +
      chartHeight -
      ((numericValue + maxValue) /
        (maxValue * 2)) *
        chartHeight
    );
  };

  // Convert index to SVG X coordinate
  const getX = (index) => {
    if (sensorData.length === 1) {
      return paddingLeft + chartWidth / 2;
    }

    return (
      paddingLeft +
      (index / (sensorData.length - 1)) *
        chartWidth
    );
  };

  // Create SVG path
  const createPath = (axis) => {
    return sensorData
      .map((item, index) => {
        const value =
          Number(
            item?.accelerometer?.[axis]
          ) || 0;

        const x = getX(index);
        const y = getY(value);

        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const xPath = createPath("x");
  const yPath = createPath("y");
  const zPath = createPath("z");

  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: "25px",
          marginBottom: "15px",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
        <span>
          <span
            style={{
              display: "inline-block",
              width: "12px",
              height: "12px",
              background: "#2563eb",
              marginRight: "6px",
              borderRadius: "2px",
            }}
          ></span>
          Accelerometer X
        </span>

        <span>
          <span
            style={{
              display: "inline-block",
              width: "12px",
              height: "12px",
              background: "#16a34a",
              marginRight: "6px",
              borderRadius: "2px",
            }}
          ></span>
          Accelerometer Y
        </span>

        <span>
          <span
            style={{
              display: "inline-block",
              width: "12px",
              height: "12px",
              background: "#dc2626",
              marginRight: "6px",
              borderRadius: "2px",
            }}
          ></span>
          Accelerometer Z
        </span>
      </div>

      {/* Chart */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="350"
        style={{
          background: "#fafafa",
          borderRadius: "10px",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Horizontal grid lines */}

        <line
          x1={paddingLeft}
          y1={paddingTop}
          x2={width - paddingRight}
          y2={paddingTop}
          stroke="#ddd"
        />

        <line
          x1={paddingLeft}
          y1={paddingTop + chartHeight / 2}
          x2={width - paddingRight}
          y2={paddingTop + chartHeight / 2}
          stroke="#ddd"
        />

        <line
          x1={paddingLeft}
          y1={height - paddingBottom}
          x2={width - paddingRight}
          y2={height - paddingBottom}
          stroke="#ddd"
        />

        {/* Y axis */}

        <line
          x1={paddingLeft}
          y1={paddingTop}
          x2={paddingLeft}
          y2={height - paddingBottom}
          stroke="#999"
        />

        {/* X axis */}

        <line
          x1={paddingLeft}
          y1={height - paddingBottom}
          x2={width - paddingRight}
          y2={height - paddingBottom}
          stroke="#999"
        />

        {/* Zero line */}

        <line
          x1={paddingLeft}
          y1={getY(0)}
          x2={width - paddingRight}
          y2={getY(0)}
          stroke="#aaa"
          strokeDasharray="5 5"
        />

        {/* X axis label */}

        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          fontSize="13"
          fill="#555"
        >
          Sensor Reading
        </text>

        {/* Y axis label */}

        <text
          x="15"
          y={height / 2}
          textAnchor="middle"
          fontSize="13"
          fill="#555"
          transform={`rotate(-90 15 ${
            height / 2
          })`}
        >
          Acceleration
        </text>

        {/* X line */}

        <path
          d={xPath}
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
        />

        {/* Y line */}

        <path
          d={yPath}
          fill="none"
          stroke="#16a34a"
          strokeWidth="3"
        />

        {/* Z line */}

        <path
          d={zPath}
          fill="none"
          stroke="#dc2626"
          strokeWidth="3"
        />

        {/* Data points */}

        {sensorData.map((item, index) => {
          const xValue =
            Number(
              item?.accelerometer?.x
            ) || 0;

          const yValue =
            Number(
              item?.accelerometer?.y
            ) || 0;

          const zValue =
            Number(
              item?.accelerometer?.z
            ) || 0;

          return (
            <React.Fragment
              key={
                item?._id ||
                `${item?.timestamp || "reading"}-${index}`
              }
            >
              <circle
                cx={getX(index)}
                cy={getY(xValue)}
                r="4"
                fill="#2563eb"
              />

              <circle
                cx={getX(index)}
                cy={getY(yValue)}
                r="4"
                fill="#16a34a"
              />

              <circle
                cx={getX(index)}
                cy={getY(zValue)}
                r="4"
                fill="#dc2626"
              />
            </React.Fragment>
          );
        })}
      </svg>

      {/* Latest reading */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, 1fr)",
          gap: "10px",
          marginTop: "15px",
        }}
      >
        <div
          style={{
            padding: "12px",
            background: "#f3f4f6",
            borderRadius: "8px",
          }}
        >
          <strong>Readings</strong>
          <div>{sensorData.length}</div>
        </div>

        <div
          style={{
            padding: "12px",
            background: "#eff6ff",
            borderRadius: "8px",
          }}
        >
          <strong>Accel X</strong>
          <div>
            {sensorData[
              sensorData.length - 1
            ]?.accelerometer?.x ?? 0}
          </div>
        </div>

        <div
          style={{
            padding: "12px",
            background: "#f0fdf4",
            borderRadius: "8px",
          }}
        >
          <strong>Accel Y</strong>
          <div>
            {sensorData[
              sensorData.length - 1
            ]?.accelerometer?.y ?? 0}
          </div>
        </div>

        <div
          style={{
            padding: "12px",
            background: "#fef2f2",
            borderRadius: "8px",
          }}
        >
          <strong>Accel Z</strong>
          <div>
            {sensorData[
              sensorData.length - 1
            ]?.accelerometer?.z ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SensorChart;
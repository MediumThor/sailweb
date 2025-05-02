import React from 'react';

export default function WindCompass({
  heading = 0,
  trueWindDirection = 0,
  apparentWindDirection = 0,
  trueWindSpeed = 0,
  apparentWindSpeed = 0,
}) {
  const size = 300;
  const center = size / 2;
  const radius = 120;

  const toRelativeAngle = (windDir) => {
    let angle = windDir - heading;
    if (angle < 0) angle += 360;
    return angle;
  };

  const polarToCartesian = (angleDeg, radius) => {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  const renderArrow = (angle, length, color, label) => {
    const { x, y } = polarToCartesian(angle, length);
    return (
      <>
        <line
          x1={center}
          y1={center}
          x2={x}
          y2={y}
          stroke={color}
          strokeWidth={5}
          markerEnd="url(#arrowhead)"
          style={{ transition: 'x2 0.5s, y2 0.5s' }}
        />
        <text
          x={(x + center) / 2}
          y={(y + center) / 2}
          fill={color}
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label} kt
        </text>
      </>
    );
  };

  const trueRel = toRelativeAngle(trueWindDirection);
  const appRel = toRelativeAngle(apparentWindDirection);

  return (
    <div style={{ width: '100%', maxWidth: 360, margin: '0 auto' }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="auto"
        style={{ touchAction: 'none', userSelect: 'none' }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="0"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="black" />
          </marker>
        </defs>

        {/* Compass Circle */}
        <circle cx={center} cy={center} r={radius} stroke="#999" fill="none" />
        {[0, 90, 180, 270].map((deg) => {
          const { x, y } = polarToCartesian(deg, radius + 12);
          return (
            <text
              key={deg}
              x={x}
              y={y}
              fontSize="12"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#666"
            >
              {deg}°
            </text>
          );
        })}

        {/* Boat icon (top center) */}
        <polygon
          points={`${center},${center - 20} ${center - 10},${center + 10} ${center + 10},${center + 10}`}
          fill="black"
        />

        {/* True and Apparent Wind Arrows */}
        {renderArrow(trueRel, radius - 30, 'green', trueWindSpeed)}
        {renderArrow(appRel, radius - 50, 'red', apparentWindSpeed)}
      </svg>
    </div>
  );
}

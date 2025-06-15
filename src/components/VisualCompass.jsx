import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function VisualCompass({
  heading = 0,
  trueWindDirection = null,
  apparentWindDirection = null,
  bearingToDestination = null,
  heel = null,
}) {
  const [expanded, setExpanded] = useState(false);

  const normalizeDegrees = (deg) => ((deg % 360) + 360) % 360;
  const normalizedHeading = normalizeDegrees(heading);

  // Smooth compass rotation
  const rawHeading = useMotionValue(-normalizedHeading);
  const smoothHeading = useSpring(rawHeading, { stiffness: 90, damping: 20 });

  useEffect(() => {
    const current = rawHeading.get() % 360;
    const target = -normalizedHeading;
  
    // Calculate shortest angular distance ([-180°, 180°] range)
    let delta = ((target - current + 540) % 360) - 180;
  
    rawHeading.set(current + delta);
  }, [normalizedHeading]);

  const relBearing = normalizeDegrees((bearingToDestination ?? 0) - heading);

  const TICK_RADIUS = 410;
  const LABEL_RADIUS = 430;
  const NUMBER_RADIUS = 300;
  const ARROW_RADIUS = 570;
  const WIND_RADIUS = 535;


  const ticks = [];
  for (let deg = 0; deg < 360; deg += 10) {
    const isMajor = deg % 30 === 0;
    const height = isMajor ? 30 : 16;
    const translateY = -TICK_RADIUS + height / 2;

    ticks.push(
      <div
        key={`tick-${deg}`}
        className={`absolute origin-center ${isMajor ? "w-2" : "w-[2px]"}`}
        style={{
          height: `${height}px`,
          backgroundColor: isMajor ? "white" : "#a1a1aa",
          transform: `rotate(${deg}deg) translateY(${translateY}px)`,
        }}
      />
    );
  }

  const degreeNumbers = [];
  for (let deg = 0; deg < 360; deg += 30) {
    degreeNumbers.push(
      <div
        key={`degree-${deg}`}
        className="absolute"
        style={{
          transform: `rotate(${deg}deg) translateY(-${NUMBER_RADIUS}px)`,
        }}
      >
        <div
          className="text-white text-center text-xl"
        
        >
          {deg}
        </div>
      </div>
    );
  }
  


  const cardinalLabels = [
    { dir: "N", deg: 0 },
    { dir: "E", deg: 90 },
    { dir: "S", deg: 180 },
    { dir: "W", deg: 270 },
  ];

  if (expanded) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full"
        onClick={() => setExpanded(false)}
      >
        <div className="text-[20rem] font-extrabold text-white leading-none">
          {normalizedHeading.toFixed(1)}
        </div>
        <div className="text-6xl text-zinc-400 mt-20">Heading</div>
      </div>
    );
  }

  return (
    <div className="relative w-[900px] h-[900px] overflow-hidden">
      <button
        onClick={() => setExpanded(true)}
        className="absolute z-20 left-1/2"
        style={{
          top: `${(900 - NUMBER_RADIUS * 2.3) / 2}px`,
          transform: "translateX(-50%)",
          width: "300px",
          height: "120px",
          backgroundColor: "#0a0a0a",
          border: "4px solid white",
          borderRadius: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "4rem",
          fontWeight: "bold",
        }}
      >
        {normalizedHeading.toFixed(1)}°
      </button>

      <motion.div
        className="absolute inset-0 rounded-full border-2 border-white flex items-center justify-center"
        style={{ rotate: smoothHeading }}
      >
        {ticks}
        {degreeNumbers}

        {cardinalLabels.map(({ dir, deg }) => (
          <div
            key={`cardinal-${dir}`}
            className="absolute text-white text-2xl font-bold"
            style={{
              transform: `rotate(${deg}deg) translateY(-${LABEL_RADIUS}px) rotate(${-deg}deg)`,
            }}
          >
            {dir}
          </div>
        ))}

        <div
          className="absolute rounded-full border-white opacity-40"
          style={{
            width: `${NUMBER_RADIUS * 2.2}px`,
            height: `${NUMBER_RADIUS * 2.2}px`,
            borderWidth: "60px",
          }}
        />

{bearingToDestination !== null && (
  <div
    className="absolute top-1/2 left-1/2 origin-top"
    style={{
      width: "8px",
      height: "110px", // length of the line
      backgroundColor: "yellow",
      transform: `rotate(${bearingToDestination}deg) translateY(-${ARROW_RADIUS - 120}px)`,
    }}
  />
)}


{trueWindDirection !== null && (
  <div
    className="absolute top-1/2 left-1/2"
    style={{
      width: "30px",
      height: "30px",
      backgroundColor: "red",
      transform: `translate(-50%, -100%) rotate(${trueWindDirection}deg) translateY(-${WIND_RADIUS - 120}px)`,
      transformOrigin: "bottom center",
    }}
  />
)}

{apparentWindDirection !== null && (
  <div
    className="absolute top-1/2 left-1/2"
    style={{
      width: "30px",
      height: "30px",
      backgroundColor: "green",
      transform: `translate(-50%, -100%) rotate(${apparentWindDirection}deg) translateY(-${WIND_RADIUS - 120}px)`,
      transformOrigin: "bottom center",
    }}
  />
)}

      </motion.div>

      {bearingToDestination != null && (
  <div
    className="absolute left-1/2 text-white text-5xl font-extrabold text-center"
    style={{
      top: "35%",
      transform: "translate(-50%, -50%)",
      textShadow: "0 0 12px rgba(0,0,0,0.7)",
    }}
  >
    
    {` ${Math.round(Math.min(relBearing, 360 - relBearing))}°`}
    <div className="text-3xl mt-2 flex items-center justify-center gap-2">
      {relBearing > 1 && relBearing < 180 && (
        <>
          <span>→</span>
          <span className="text-blue-300">R</span>
        </>
      )}
      {relBearing >= 180 && relBearing < 359 && (
        <>
          <span>←</span>
          <span className="text-blue-300">L</span>
        </>
      )}
      {(relBearing <= 1 || relBearing >= 359) && (
        <span className="text-green-400">On Course</span>
      )}
    </div>
  </div>
)}




      <div
        className="absolute top-1/2 left-1/2 origin-center"
        style={{
          width: "300px",
          height: "4px",
          backgroundColor: "white",
          transform: `translate(-50%, -50%) rotate(${heel}deg)`,
          transformOrigin: "center",
          opacity: 0.6,
        }}
      />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 0,
          height: 0,
          borderLeft: "24px solid transparent",
          borderRight: "24px solid transparent",
          borderBottom: "78px solid white",
        }}
      />



<div
  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
  style={{
    top: "calc(20% - 90px)",
    width: 0,
    height: 0,
    borderLeft: "24px solid transparent",
    borderRight: "24px solid transparent",
    borderBottom: "78px solid #60a5fa", // Tailwind's light blue-400
  }}
/>

      {heel != null && (
        <div className="absolute top-[62%] left-1/2 transform -translate-x-1/2 text-white text-2xl font-semibold">
          Heel: {heel.toFixed(1)}°
        </div>
      )}

{bearingToDestination != null && (
  <div className="absolute top-[67%] left-1/2 transform -translate-x-1/2 text-white text-4xl font-semibold">
    Bearing: {bearingToDestination.toFixed(1)}°
  </div>
)}



    </div>
  );
}

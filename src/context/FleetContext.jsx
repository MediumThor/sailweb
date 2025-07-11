import React, { createContext, useContext, useState, useEffect } from "react";

// ⚓️ Vessel color storage moved outside so it doesn't reset on re-render
const vesselColors = {};
const colors = ["#3B82F6", "#F59E0B", "#10B981", "#8B5CF6", "#EF4444", "#EC4899", "#14B8A6"];

function getVesselColor(id) {
  if (!vesselColors[id]) {
    vesselColors[id] = colors[Object.keys(vesselColors).length % colors.length];
  }
  return vesselColors[id];
}

// ✅ Create the Fleet context
const FleetContext = createContext();

export function FleetProvider({ children }) {
  const [fleet, setFleet] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(`wss://ws.saildash.club`);

    ws.onopen = () => console.log("✅ Fleet WS connected to wss://ws.saildash.club");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📡 Incoming fleet WS data:", data);
        const now = new Date().toISOString();
    
        if (Array.isArray(data)) {
          const withTimestamps = data.map(v => ({ ...v, lastSeen: now }));
          setFleet(withTimestamps);
        } else if (Array.isArray(data.vessels)) {
          const withTimestamps = data.vessels.map(v => ({ ...v, lastSeen: now }));
          setFleet(withTimestamps);
        } else {
          console.error("Fleet WS unexpected data:", data);
          setFleet([]);
        }
      } catch (err) {
        console.error("Fleet WS parse error:", err);
      }
    };
    

    ws.onerror = (error) => console.error("Fleet WS error:", error);
    ws.onclose = () => console.log("Fleet WS closed");

    return () => ws.close();
  }, []);

  return (
    <FleetContext.Provider value={{ fleet, getVesselColor }}>
      {children}
    </FleetContext.Provider>
  );
}

export function useFleet() {
  return useContext(FleetContext);
}

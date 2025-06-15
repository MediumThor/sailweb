import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const DisplaySettingsContext = createContext();

// Export a hook to use the context easily
export const useDisplaySettings = () => useContext(DisplaySettingsContext);

// Export helper to access compass offset outside of React components
export function getCompassOffset() {
  return parseFloat(localStorage.getItem("compassOffset") || "0");
}

// Create the provider
export function DisplaySettingsProvider({ children }) {
  const [autoAdvanceDistance, setAutoAdvanceDistance] = useState(() => {
    const stored = localStorage.getItem("autoAdvanceDistance");
    return stored ? parseInt(stored) : 61;
  });

  const [showSpeedPanel, setShowSpeedPanel] = useState(() => {
    return localStorage.getItem("showSpeedPanel") !== "false";
  });

  const [showWindPanel, setShowWindPanel] = useState(() => {
    return localStorage.getItem("showWindPanel") !== "false";
  });

  const [showGpsMarker, setShowGpsMarker] = useState(() => {
    return localStorage.getItem("showGpsMarker") !== "false";
  });

  const [showSoundings, setShowSoundings] = useState(() => {
    return localStorage.getItem("showSoundings") !== "false";
  });

  const [showNavpoints, setShowNavpoints] = useState(() => {
    return localStorage.getItem("showNavpoints") !== "false";
  });

  const [showAutoAdvanceRadius, setShowAutoAdvanceRadius] = useState(() => {
    return localStorage.getItem("showAutoAdvanceRadius") === "true";
  });

  const [mapSource, setMapSource] = useState(() => {
    return localStorage.getItem("mapSource") || "offline";
  });

  const [showBathyShallow, setShowBathyShallow] = useState(() =>
    localStorage.getItem("showBathyShallow") === "true"
  );

  const [showBathyDeep, setShowBathyDeep] = useState(() =>
    localStorage.getItem("showBathyDeep") === "true"
  );

  const [compassOffset, setCompassOffset] = useState(() =>
    parseFloat(localStorage.getItem("compassOffset") || "0")
  );

  // Save compass offset
  useEffect(() => {
    localStorage.setItem("compassOffset", compassOffset);
  }, [compassOffset]);

  // Save booleans
  useEffect(() => {
    localStorage.setItem("showSpeedPanel", showSpeedPanel);
    localStorage.setItem("showWindPanel", showWindPanel);
    localStorage.setItem("showGpsMarker", showGpsMarker);
    localStorage.setItem("showSoundings", showSoundings);
    localStorage.setItem("showNavpoints", showNavpoints);
  }, [showSpeedPanel, showWindPanel, showGpsMarker, showSoundings, showNavpoints]);

  // Save numeric and select-type settings
  useEffect(() => {
    localStorage.setItem("autoAdvanceDistance", autoAdvanceDistance);
  }, [autoAdvanceDistance]);

  useEffect(() => {
    localStorage.setItem("showAutoAdvanceRadius", showAutoAdvanceRadius);
  }, [showAutoAdvanceRadius]);

  useEffect(() => {
    localStorage.setItem("mapSource", mapSource);
  }, [mapSource]);

  useEffect(() => {
    localStorage.setItem("showBathyShallow", showBathyShallow);
  }, [showBathyShallow]);

  useEffect(() => {
    localStorage.setItem("showBathyDeep", showBathyDeep);
  }, [showBathyDeep]);

  return (
    <DisplaySettingsContext.Provider
      value={{
        showSpeedPanel,
        setShowSpeedPanel,
        showWindPanel,
        setShowWindPanel,
        showGpsMarker,
        setShowGpsMarker,
        showSoundings,
        setShowSoundings,
        showNavpoints,
        setShowNavpoints,
        autoAdvanceDistance,
        setAutoAdvanceDistance,
        showAutoAdvanceRadius,
        setShowAutoAdvanceRadius,
        mapSource,
        setMapSource,
        showBathyShallow,
        setShowBathyShallow,
        showBathyDeep,
        setShowBathyDeep,
        compassOffset,
        setCompassOffset,
      }}
    >
      {children}
    </DisplaySettingsContext.Provider>
  );
}

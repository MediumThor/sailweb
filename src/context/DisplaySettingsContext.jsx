import React, { createContext, useContext, useState, useEffect } from "react";

const DisplaySettingsContext = createContext();
export const useDisplaySettings = () => useContext(DisplaySettingsContext);

export function getCompassOffset() {
  return parseFloat(localStorage.getItem("compassOffset") || "0");
}

export function DisplaySettingsProvider({ children }) {
  const [autoAdvanceDistance, setAutoAdvanceDistance] = useState(() =>
    parseInt(localStorage.getItem("autoAdvanceDistance") || "61")
  );

  const [showSpeedPanel, setShowSpeedPanel] = useState(() =>
    localStorage.getItem("showSpeedPanel") !== "false"
  );
  const [showWindPanel, setShowWindPanel] = useState(() =>
    localStorage.getItem("showWindPanel") !== "false"
  );
  const [showGpsMarker, setShowGpsMarker] = useState(() =>
    localStorage.getItem("showGpsMarker") !== "false"
  );
  const [showSoundings, setShowSoundings] = useState(() =>
    localStorage.getItem("showSoundings") !== "false"
  );
  const [showNavpoints, setShowNavpoints] = useState(() =>
    localStorage.getItem("showNavpoints") !== "false"
  );
  const [showAutoAdvanceRadius, setShowAutoAdvanceRadius] = useState(() =>
    localStorage.getItem("showAutoAdvanceRadius") === "true"
  );

  // 🔥 FORCE to "esri" on load, ignoring localStorage
  const [mapSource, setMapSource] = useState("esri");

  const [showBathyShallow, setShowBathyShallow] = useState(() =>
    localStorage.getItem("showBathyShallow") === "true"
  );
  const [showBathyDeep, setShowBathyDeep] = useState(() =>
    localStorage.getItem("showBathyDeep") === "true"
  );
  const [compassOffset, setCompassOffset] = useState(() =>
    parseFloat(localStorage.getItem("compassOffset") || "0")
  );

  // Effects to keep localStorage updated
  useEffect(() => {
    localStorage.setItem("compassOffset", compassOffset);
  }, [compassOffset]);

  useEffect(() => {
    localStorage.setItem("showSpeedPanel", showSpeedPanel);
    localStorage.setItem("showWindPanel", showWindPanel);
    localStorage.setItem("showGpsMarker", showGpsMarker);
    localStorage.setItem("showSoundings", showSoundings);
    localStorage.setItem("showNavpoints", showNavpoints);
  }, [showSpeedPanel, showWindPanel, showGpsMarker, showSoundings, showNavpoints]);

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
    localStorage.setItem("showBathyDeep", showBathyDeep);
  }, [showBathyShallow, showBathyDeep]);

  return (
    <DisplaySettingsContext.Provider
      value={{
        showSpeedPanel, setShowSpeedPanel,
        showWindPanel, setShowWindPanel,
        showGpsMarker, setShowGpsMarker,
        showSoundings, setShowSoundings,
        showNavpoints, setShowNavpoints,
        autoAdvanceDistance, setAutoAdvanceDistance,
        showAutoAdvanceRadius, setShowAutoAdvanceRadius,
        mapSource, setMapSource,
        showBathyShallow, setShowBathyShallow,
        showBathyDeep, setShowBathyDeep,
        compassOffset, setCompassOffset,
      }}
    >
      {children}
    </DisplaySettingsContext.Provider>
  );
}

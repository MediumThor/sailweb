import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const DisplaySettingsContext = createContext();

// Export a hook to use it easily
export const useDisplaySettings = () => useContext(DisplaySettingsContext);

// Create the provider
export function DisplaySettingsProvider({ children }) {
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
    return localStorage.getItem("showNavpoints") !== "false"; // default true
  });

  // Save to localStorage whenever changed
  useEffect(() => {
    localStorage.setItem("showSpeedPanel", showSpeedPanel);
    localStorage.setItem("showWindPanel", showWindPanel);
    localStorage.setItem("showGpsMarker", showGpsMarker);
    localStorage.setItem("showSoundings", showSoundings);
    localStorage.setItem("showNavpoints", showNavpoints);
  }, [showSpeedPanel, showWindPanel, showGpsMarker, showSoundings, showNavpoints]);

  return (
    <DisplaySettingsContext.Provider
      value={{
        showSpeedPanel, setShowSpeedPanel,
        showWindPanel, setShowWindPanel,
        showGpsMarker, setShowGpsMarker,
        showSoundings, setShowSoundings,
        showNavpoints, setShowNavpoints,
      }}
    >
      {children}
    </DisplaySettingsContext.Provider>
  );
}

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { DisplaySettingsProvider } from "./context/DisplaySettingsContext";
import { NavpointsProvider } from "./context/NavpointsContext";
import { SidebarProvider } from "./context/SidebarContext";
import { ModalProvider } from "./context/ModalContext";
import { KeyboardProvider } from "./context/KeyboardContext";
import TouchKeyboard from "./components/TouchKeyboard";
import SplashScreen from "./components/SplashScreen";
import { FleetProvider } from "./context/FleetContext";


import AppLayout from "./components/AppLayout";
import Microdisplay from "./microdisplay";

function App() {
  const [nightMode, setNightMode] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [signalkData, setSignalkData] = useState({});
  const [showSplash, setShowSplash] = useState(true);


  

  const { lat, lon } = { lat: 43.107, lon: -88.055 }; // fallback dummy GPS
  const baseUrl = "https://embed.windy.com/embed.html";

  const radarUrl = `${baseUrl}?type=map&location=coordinates&metricRain=in&metricTemp=°F&metricWind=kt&zoom=9&overlay=radar&product=radar&level=surface&lat=${lat}&lon=${lon}`;
  const liveWindUrl = `${baseUrl}?type=map&location=coordinates&metricRain=in&metricTemp=°F&metricWind=kt&zoom=9&overlay=wind&product=ecmwf&level=surface&lat=${lat}&lon=${lon}`;
  const forecastUrl = `${baseUrl}?type=map&location=coordinates&metricRain=in&metricTemp=°F&metricWind=kt&zoom=9&overlay=wind&product=ecmwf&level=surface&lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&detail=true`;

  const isMicro = window.location.pathname.startsWith("/microdisplay");

  return showSplash ? (
    <SplashScreen onDone={() => setShowSplash(false)} />
  ) : (
    <FleetProvider>
    <KeyboardProvider>
      <DisplaySettingsProvider>
        <NavpointsProvider>
          <ModalProvider>
            <SidebarProvider>
              {isMicro ? (
                <Router basename="/microdisplay">
                  <Microdisplay
                    nightMode={nightMode}
                    setNightMode={setNightMode}
                    brightness={brightness}
                    setBrightness={setBrightness}
                    signalkData={signalkData}
                  />
                </Router>
              ) : (
                <Router>
                  <AppLayout
                    nightMode={nightMode}
                    setNightMode={setNightMode}
                    brightness={brightness}
                    setBrightness={setBrightness}
                    signalkData={signalkData}
                  />
                </Router>
              )}
  
              {/* Windy widget preloaders */}
              <div className="fixed top-0 left-0 w-1 h-1 opacity-0 pointer-events-none overflow-hidden z-0">
                <iframe src={radarUrl} frameBorder="0" title="Radar Preload" />
                <iframe src={liveWindUrl} frameBorder="0" title="Live Wind Preload" />
                <iframe src={forecastUrl} frameBorder="0" title="Forecast Preload" />
              </div>
            </SidebarProvider>
          </ModalProvider>
        </NavpointsProvider>
      </DisplaySettingsProvider>
      <TouchKeyboard />
    </KeyboardProvider>
   </FleetProvider>

  );
  
}

export default App;

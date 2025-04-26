import React, { useEffect, useState } from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { DisplaySettingsProvider } from "./context/DisplaySettingsContext";
import { NavpointsProvider } from "./context/NavpointsContext";
import AppLayout from "./components/AppLayout"; // 👈 import AppLayout
import { SidebarProvider, useSidebar } from "./context/SidebarContext";
import { ModalProvider } from "./context/ModalContext";
import { KeyboardProvider } from "./context/KeyboardContext";
import TouchKeyboard from "./components/TouchKeyboard";



function App() {
  const [signalkData, setSignalkData] = useState({});
  const [nightMode, setNightMode] = useState(false);

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.68.57:3000/signalk/v1/stream");

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.updates) {
          setSignalkData((prev) => ({ ...prev, ...msg }));
        }
      } catch (e) {
        console.error("Failed to parse SignalK message", e);
      }
    };

    socket.onerror = (error) => console.error("WebSocket error:", error);
    socket.onclose = () => console.warn("SignalK WebSocket closed");

    return () => socket.close();
  }, []);

  // ⬇️ Define Preload URLs
  const { lat, lon } = { lat: 43.107, lon: -88.055 }; // fallback dummy GPS
  const baseUrl = "https://embed.windy.com/embed.html";

  const radarUrl = `${baseUrl}?type=map&location=coordinates&metricRain=in&metricTemp=°F&metricWind=kt&zoom=9&overlay=radar&product=radar&level=surface&lat=${lat}&lon=${lon}`;
  const liveWindUrl = `${baseUrl}?type=map&location=coordinates&metricRain=in&metricTemp=°F&metricWind=kt&zoom=9&overlay=wind&product=ecmwf&level=surface&lat=${lat}&lon=${lon}`;
  const forecastUrl = `${baseUrl}?type=map&location=coordinates&metricRain=in&metricTemp=°F&metricWind=kt&zoom=9&overlay=wind&product=ecmwf&level=surface&lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&detail=true`;

  return (
    <KeyboardProvider>

    <DisplaySettingsProvider>
<NavpointsProvider>
    <ModalProvider>
      <SidebarProvider>
        <Router>
          <AppLayout nightMode={nightMode} setNightMode={setNightMode} signalkData={signalkData} />
        </Router>

        {/* Global Hidden Preloaders for Weather */}
        <div className="fixed top-0 left-0 w-1 h-1 opacity-0 pointer-events-none overflow-hidden z-0">
  <iframe src={radarUrl} frameBorder="0" allowFullScreen title="Radar Preload" />
  <iframe src={liveWindUrl} frameBorder="0" allowFullScreen title="Live Wind Preload" />
  <iframe src={forecastUrl} frameBorder="0" allowFullScreen title="Forecast Preload" />
</div>

      </SidebarProvider>
    </ModalProvider>
    </NavpointsProvider>
    </DisplaySettingsProvider>
    <TouchKeyboard />
    </KeyboardProvider>

  );
}

export default App;

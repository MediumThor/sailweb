import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "./Dashboard";
import Settings from "./Settings";
import Charts from "./Charts";
import GPS from "./GPS";
import Weather from "./Weather";
import { useSidebar } from "../context/SidebarContext";
import { useModal } from "../context/ModalContext";
import AddNavpointModal from "./AddNavpointModal";
import SetDestinationModal from "./SetDestinationModal";
import WindowModal from "../context/WindowModal"; // Correct the import path if needed
import currentLocation from "../utils/currentLocation";
import Wifi from "./Wifi";
import Music from "./Music";
import Spotify from "./Spotify/Spotify";
import SpotifyPlayer from "./Spotify/SpotifyPlayer";
import SpotifyCallback from "./Spotify/SpotifyCallback";

export default function AppLayout({ nightMode, signalkData, setNightMode, brightness, setBrightness}){
  const { lat, lon } = currentLocation;

  const { isSidebarOpen } = useSidebar();
  const { modalType, closeModal } = useModal();
  const baseUrl = "https://embed.windy.com/embed.html";

  const isWeatherModal = modalType === "radar" || modalType === "liveWind" || modalType === "forecast";

  const radarUrl = `${baseUrl}?type=map&location=coordinates&metricRain=in&metricTemp=°F&metricWind=kt&zoom=7&overlay=radar&product=radar&level=surface&lat=${lat}&lon=${lon}`;
  const liveWindUrl = `${baseUrl}?type=map&location=coordinates&metricRain=in&metricTemp=°F&metricWind=kt&zoom=9&overlay=wind&product=ecmwf&level=surface&lat=${lat}&lon=${lon}`;
  const forecastUrl = `${baseUrl}?type=map&location=coordinates&metricRain=in&metricTemp=°F&metricWind=kt&zoom=6&overlay=wind&product=ecmwf&level=surface&lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&detail=true`;

  return (
<div
  className={`flex h-screen transition-all duration-300 bg-zinc-900 ${nightMode ? "text-amber-500" : "text-white"}`}
  style={{ filter: `brightness(${brightness / 100})` }}
>      <Sidebar nightMode={nightMode} />
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isSidebarOpen ? "ml-80" : "ml-0"}`}>
        <Header nightMode={nightMode} />
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route path="/" element={<Dashboard signalkData={signalkData} />} />
            <Route path="/settings" element={<Settings nightMode={nightMode} setNightMode={setNightMode} brightness={brightness} setBrightness={setBrightness} />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/gps" element={<GPS />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/wifi" element={<Wifi />} />
            <Route path="/music" element={<Music />} />
            <Route path="/music/spotify" element={<Spotify />} />         // This page has the "Login" button
            <Route path="/callback" element={<SpotifyCallback />} />
            <Route path="/music/spotify/player" element={<SpotifyPlayer />} /> // Player UI

          </Routes>
        </main>
      </div>

      {/* Global Modal Renderer (only show if weather modal is not open) */}
      {!isWeatherModal && modalType && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]"
          onClick={closeModal}
        >
          <div
            className="bg-zinc-800 p-8 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto w-[90%] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {modalType === "addNavpoint" && <AddNavpointModal closeModal={closeModal} />}
            {modalType === "setDestination" && <SetDestinationModal closeModal={closeModal} />}
          </div>
        </div>
      )}

      {/* Weather Modals */}
      {isWeatherModal && (
        <>
          <WindowModal name="radar" url={radarUrl}>
            <iframe src={radarUrl} className="w-full h-full border-0" allowFullScreen />
          </WindowModal>

          <WindowModal name="liveWind" url={liveWindUrl}>
            <iframe src={liveWindUrl} className="w-full h-full border-0" allowFullScreen />
          </WindowModal>

          <WindowModal name="forecast" url={forecastUrl}>
            <iframe src={forecastUrl} className="w-full h-full border-0" allowFullScreen />
          </WindowModal>
        </>
      )}
    </div>
  );
}

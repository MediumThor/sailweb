import React, { useEffect, useState } from "react";
import { useModal } from "../context/ModalContext";
import WindowModal from "../context/WindowModal";
import currentLocation from "../utils/currentLocation";
import PreviewFrame from "../context/PreviewFrame";

export default function Weather() {
  const { openModal } = useModal();
  const { lat, lon } = currentLocation;
  const baseUrl = "https://embed.windy.com/embed.html";

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const radarUrl = `${baseUrl}?type=map&location=coordinates&metricRain=in&metricTemp=°F&metricWind=kt&zoom=7&overlay=radar&product=radar&level=surface&lat=${lat}&lon=${lon}`;
  const liveWindUrl = `${baseUrl}?type=map&location=coordinates&metricRain=in&metricTemp=°F&metricWind=kt&zoom=9&overlay=wind&product=ecmwf&level=surface&lat=${lat}&lon=${lon}`;
  const forecastUrl = `${baseUrl}?type=map&location=coordinates&metricRain=in&metricTemp=°F&metricWind=kt&zoom=6&overlay=wind&product=ecmwf&level=surface&lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&detail=true`;

  return (
    <div className="flex flex-col items-center space-y-10">
      {/* Connection Status */}
      <div className="text-2xl font-bold mt-4 mb-8">
        {!isOnline && (
          <span className="text-red-400">Disconnected - Please connect to Wi-Fi</span>
        )}
      </div>

      {/* Top Row: Radar + Live Wind */}
      <div className="flex flex-row w-full max-w-7xl space-x-8">
        {/* Radar */}
        <button
          onClick={() => {
            setTimeout(() => openModal("radar"), 100);
          }}
          className="flex-1 bg-zinc-700 p-6 rounded-2xl hover:bg-zinc-600 overflow-hidden active:scale-95 transition-transform duration-100"
        >
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-6">Radar</span>
            <PreviewFrame src={radarUrl} />
          </div>
        </button>

        {/* Live Wind */}
        <button
          onClick={() => {
            setTimeout(() => openModal("liveWind"), 100);
          }}
          className="flex-1 bg-zinc-700 p-6 rounded-2xl hover:bg-zinc-600 overflow-hidden active:scale-95 transition-transform duration-100"
        >
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-6">Live Wind</span>
            <PreviewFrame src={liveWindUrl} />
          </div>
        </button>
      </div>

      {/* Bottom Row: Wind Forecast */}
      <button
        onClick={() => {
          setTimeout(() => openModal("forecast"), 100);
        }}
        className="bg-zinc-700 p-6 rounded-2xl hover:bg-zinc-600 w-full max-w-6xl overflow-hidden active:scale-95 transition-transform duration-100"
      >
        <div className="flex flex-col items-center">
          <span className="text-4xl mb-6">Wind Forecast</span>
          <PreviewFrame src={forecastUrl} />
        </div>
      </button>

      {/* Fullscreen Modals */}
      <WindowModal name="radar">
        <iframe src={radarUrl} className="w-full h-full border-0" allowFullScreen />
      </WindowModal>

      <WindowModal name="liveWind">
        <iframe src={liveWindUrl} className="w-full h-full border-0" allowFullScreen />
      </WindowModal>

      <WindowModal name="forecast">
        <iframe src={forecastUrl} className="w-full h-full border-0" allowFullScreen />
      </WindowModal>
    </div>
  );
}

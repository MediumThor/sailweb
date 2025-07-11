import React, { useEffect, useState } from "react";
import { useModal } from "../context/ModalContext";
import WindowModal from "../context/WindowModal";
import currentLocation from "../utils/currentLocation";

export default function Weather() {
  const { openModal } = useModal();
  const { lat, lon } = currentLocation;

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [windyLoaded, setWindyLoaded] = useState(false);

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

  useEffect(() => {
    if (!windyLoaded) {
      const script = document.createElement("script");
      script.src = "https://windy.app/widgets-code/forecast/windy_forecast_async.js?v164";
      script.async = true;
      script.dataset.cfasync = "false";
      document.body.appendChild(script);
      setWindyLoaded(true);
    }
  }, [windyLoaded]);

  return (
    <div className="flex flex-col items-center space-y-6 md:space-y-10 mt-2 md:mt-4 overflow-hidden">
      {/* Connection Status */}
      <div className="text-xl md:text-2xl font-bold mt-2 mb-4 md:mb-8">
        {!isOnline && (
          <span className="text-red-400">Disconnected - Please connect to Wi-Fi</span>
        )}
      </div>

      {/* Top Row: Radar + Live Wind */}
      <div className="flex flex-col md:flex-row w-full max-w-7xl space-y-4 md:space-y-0 md:space-x-8 px-4 md:px-0">
        {/* Radar Button */}
        <button
          onClick={() => {
            setTimeout(() => openModal("radar"), 100);
          }}
          className="flex-1 bg-zinc-700 p-4 md:p-6 rounded-xl md:rounded-2xl hover:bg-zinc-600 overflow-hidden active:scale-95 transition-transform duration-100"
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl mb-2 md:mb-4">Radar</span>
            <img
              src="/images/radar.png"
              alt="Radar Preview"
              className="rounded-lg md:rounded-xl shadow-lg w-full h-48 md:h-60 object-cover"
            />
          </div>
        </button>

        {/* Live Wind Button */}
        <button
          onClick={() => {
            setTimeout(() => openModal("liveWind"), 100);
          }}
          className="flex-1 bg-zinc-700 p-4 md:p-6 rounded-xl md:rounded-2xl hover:bg-zinc-600 overflow-hidden active:scale-95 transition-transform duration-100"
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl mb-2 md:mb-4">Live Wind</span>
            <img
              src="/images/wind.png"
              alt="Live Wind Preview"
              className="rounded-lg md:rounded-xl shadow-lg w-full h-48 md:h-60 object-cover"
            />
          </div>
        </button>
      </div>

      {/* Bottom Row: Wind Forecast Widget */}
      <div className="bg-zinc-700 p-4 md:p-6 rounded-xl md:rounded-2xl w-full max-w-7xl flex flex-col items-center overflow-hidden mx-4 md:mx-0" style={{ maxHeight: "500px" }}>
        <div
          data-windywidget="forecast"
          data-thememode="black"
          data-tempunit="F"
          data-lat={lat}
          data-lng={lon}
          data-appid="widgets_46134cff4e"
          className="w-full"
          style={{ minHeight: "400px", maxHeight: "400px", overflow: "hidden" }}
        ></div>
      </div>

      {/* Fullscreen Modals */}
      <WindowModal name="radar">
        <img
          src="/images/radar.png"
          alt="Radar Fullscreen"
          className="w-full h-full object-contain bg-black"
        />
      </WindowModal>

      <WindowModal name="liveWind">
        <img
          src="/images/wind.png"
          alt="Live Wind Fullscreen"
          className="w-full h-full object-contain bg-black"
        />
      </WindowModal>
    </div>
  );
}

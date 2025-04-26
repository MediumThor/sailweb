import React, { useEffect, useState } from "react";
import { useSidebar } from "../context/SidebarContext";

export default function Header({ nightMode }) {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
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

  return (
    <header className="bg-zinc-800 px-4 py-4 flex items-center justify-between shadow z-50 h-20">
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="p-4 w-16 h-24 flex items-center justify-center focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <div className="space-y-2">
            <div className="w-8 h-1 bg-white rounded"></div>
            <div className="w-8 h-1 bg-white rounded"></div>
            <div className="w-8 h-1 bg-white rounded"></div>
          </div>
        </button>
      )}

      <h1 className={`text-3xl font-warrior font-bold mx-auto ${nightMode ? "text-amber-500" : "text-white"}`}>
        Warrior
      </h1>

      {/* Clock and Wifi */}
      <div className="flex items-center space-x-4 text-3xl text-right">
        {isOnline && (
          <img
            src="/icons/wifi.png"
            alt="WiFi Connected"
            className="w-8 h-8"
          />
        )}
        <div className={`${nightMode ? "text-amber-300" : "text-zinc-300"}`}>
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </header>
  );
}

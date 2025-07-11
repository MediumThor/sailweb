import React, { useEffect, useState } from "react";
import { useSidebar } from "../context/SidebarContext";

export default function Header({ nightMode }) {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isWifiConnected, setIsWifiConnected] = useState(false);
  const [boatName, setBoatName] = useState(() => localStorage.getItem("boatName") || "Sailweb");

  useEffect(() => {
    const updateFromStorage = () => {
      setBoatName(localStorage.getItem("boatName") || "Saildash");
    };
    window.addEventListener("storage", updateFromStorage);
    return () => window.removeEventListener("storage", updateFromStorage);
  }, []);

  useEffect(() => {
    const checkWifi = async () => {
      try {
        const res = await fetch("http://localhost:8085/api/wifi/status");
        const data = await res.json();
        setIsWifiConnected(data.connected);
      } catch {
        setIsWifiConnected(false);
      }
    };
  
    checkWifi();                      // run once
    const interval = setInterval(checkWifi, 5000);  // poll every 5 seconds
  
    return () => clearInterval(interval);
  }, []);
  

  return (
    <header className="bg-zinc-800 px-4 py-4 flex items-center justify-between shadow z-50 h-24 relative">
      {/* Sidebar Hamburger Button */}
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

      {/* Centered Title */}
      <h1
  className={`text-4xl font-warrior font-bold absolute left-1/2 transform -translate-x-1/2 ${
    nightMode ? "text-amber-500" : "text-white"
  }`}
>
  {boatName}
</h1>

    
    </header>
  );
}

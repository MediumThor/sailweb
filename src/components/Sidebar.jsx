import React from "react";
import { useSidebar } from "../context/SidebarContext";
import { Link, useLocation } from "react-router-dom";

const navItems = [
 // { label: "Dashboard", path: "/" },
  { label: "Charts", path: "/charts" },
  { label: "Fleet", path: "/fleet" }, // ✅ new
  { label: "Weather", path: "/weather" },
  { label: "Settings", path: "/settings" },
];

export default function Sidebar({ nightMode }) {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const location = useLocation();

  return (
    <div
      className={`w-80 bg-zinc-800 p-4 flex flex-col justify-between items-center shadow-lg transform transition-transform duration-300 fixed h-full z-50 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } ${nightMode ? "text-amber-500" : "text-white"}`}
    >
      {/* Top: Title + Nav */}
      <div className="w-full flex flex-col space-y-14 items-center">
        <h2 className="text-xl font-bold">SailDash</h2>

        <nav className="w-full flex flex-col space-y-10">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-6 py-10 rounded-2xl w-full text-left text-3xl hover:bg-zinc-600 active:scale-95 transition-transform duration-100 ${
                location.pathname === item.path ? "bg-zinc-700" : "bg-zinc-800"
              }`}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom: Close Button */}
      <button
        onClick={toggleSidebar}
        className="w-full mt-10 px-6 py-10 rounded-2xl text-left text-2xl hover:bg-zinc-600 bg-zinc-700 active:scale-95 transition-transform duration-100"
        aria-label="Hide Sidebar"
      >
        ← Close
      </button>
    </div>
  );
}

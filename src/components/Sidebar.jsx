import React from "react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-zinc-800 p-4 flex flex-col space-y-4">
      <h2 className="text-2xl font-bold">SailDash</h2>
      <nav className="flex flex-col space-y-2">
        <a href="#" className="hover:bg-zinc-700 p-2 rounded">🧭 Dashboard</a>
        <a href="#" className="hover:bg-zinc-700 p-2 rounded">⚙️ Settings</a>
        <a href="#" className="hover:bg-zinc-700 p-2 rounded">📜 Logs</a>
      </nav>
    </div>
  );
}

import React from "react";

export default function Header() {
  return (
    <header className="bg-zinc-800 px-4 py-2 flex justify-between items-center shadow">
      <h1 className="text-xl font-semibold">⛵ Warrior Dashboard</h1>
      <div className="text-sm text-zinc-400">
        {new Date().toLocaleTimeString()}
      </div>
    </header>
  );
}

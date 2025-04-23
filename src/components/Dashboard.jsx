import React from "react";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-zinc-800 p-4 rounded shadow">🧭 Heading: ---</div>
      <div className="bg-zinc-800 p-4 rounded shadow">🌡 Temp: ---</div>
      <div className="bg-zinc-800 p-4 rounded shadow">💨 Wind: ---</div>
      <div className="bg-zinc-800 p-4 rounded shadow">📍 GPS: ---</div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavpoints } from "../context/NavpointsContext";

export default function SetRaceTripModal({ closeModal }) {
  const { navpoints, destinations, setDestinations } = useNavpoints();
  const [selectedIds, setSelectedIds] = useState([]);

  // Initialize with current destinations
  useEffect(() => {
    const current = destinations.map(d => d.id);
    setSelectedIds(current);
  }, [destinations]);

  const toggleNavpoint = (navpoint) => {
    setSelectedIds(prev => {
      if (prev.includes(navpoint.id)) {
        return prev.filter(id => id !== navpoint.id);
      } else {
        return [...prev, navpoint.id];
      }
    });
  };

  const handleSave = () => {
    const selected = navpoints.filter(p => selectedIds.includes(p.id));
    setDestinations(selected);
    closeModal();
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">📍 Select Race Course</h2>
      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {navpoints.map((p) => (
          <div
            key={p.id}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              selectedIds.includes(p.id)
                ? "bg-emerald-700 border-emerald-500"
                : "bg-zinc-800 border-zinc-700"
            }`}
            onClick={() => toggleNavpoint(p)}
          >
            <div className="text-xl font-semibold">{p.name}</div>
            <div className="text-sm text-zinc-300">
              {p.lat.toFixed(4)}, {p.lon.toFixed(4)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between gap-4">
        <button
          onClick={closeModal}
          className="bg-zinc-600 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl text-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg"
        >
          Save Trip
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavpoints } from "../context/NavpointsContext";

export default function LaylineModal({ closeModal, setLayline, layline }) {
  const { navpoints } = useNavpoints();
  const [selected, setSelected] = useState([]);

  const validNavpoints = navpoints.filter(
    (p) =>
      typeof p.lat === "number" &&
      typeof p.lon === "number" &&
      !isNaN(p.lat) &&
      !isNaN(p.lon)
  );

  const toggleSelection = (point) => {
    if (selected.find((s) => s.lat === point.lat && s.lon === point.lon && s.name === point.name)) {
      setSelected((prev) => prev.filter((s) => s.name !== point.name));
    } else if (selected.length < 2) {
      setSelected((prev) => [...prev, point]);
    }
  };

  const handleConfirm = () => {
    if (selected.length === 2) {
      setLayline({ from: selected[0], to: selected[1] });
      closeModal();
    }
  };

  const handleClear = () => {
    setLayline({ from: null, to: null });
    closeModal();
  };

  return (
    <div className="p-6 bg-zinc-800 rounded-2xl shadow-xl space-y-4">
      <h2 className="text-2xl font-bold text-white text-center mb-4">Draw Rhumb Line</h2>
      {layline?.from && layline?.to && (
            <button
              onClick={handleClear}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg mt-2"
            >
              ❌ Clear Rhumb Line
            </button>
          )}
      {validNavpoints.length < 2 ? (
        <div className="text-zinc-400 text-center">Need at least two navpoints.</div>
      ) : (
        <>
          <div className="space-y-3">
            {validNavpoints.map((point, index) => {
              const isSelected = selected.find(
                (s) => s.lat === point.lat && s.lon === point.lon && s.name === point.name
              );

              return (
                <button
                  key={index}
                  onClick={() => toggleSelection(point)}
                  className={`w-full flex items-center gap-4 ${
                    isSelected ? "bg-blue-700" : "bg-zinc-700"
                  } hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg`}
                >
                  <div className="w-8 text-left text-amber-400">
                    {isSelected ? selected.indexOf(point) + 1 : ""}
                  </div>
                  <div className="flex-1 text-left">
                    {point.name} ({point.lat.toFixed(2)}, {point.lon.toFixed(2)})
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleConfirm}
            disabled={selected.length !== 2}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-4 disabled:opacity-50"
          >
            ➤ Confirm Rhumb Line
          </button>

        
        </>
      )}
    </div>
  );
}

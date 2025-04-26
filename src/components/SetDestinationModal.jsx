import { useNavpoints } from "../context/NavpointsContext";

export default function SetDestinationModal({ closeModal }) {
  const { navpoints, setDestinationToNavpoint } = useNavpoints();

  const handleSelect = (point) => {
    setDestinationToNavpoint(point);
    closeModal();
  };

  return (
    <div className="p-6 bg-zinc-800 rounded-2xl shadow-xl space-y-4">
      <h2 className="text-2xl font-bold text-white text-center mb-4">Set Destination</h2>

      {navpoints.length === 0 ? (
        <div className="text-zinc-400 text-center">No navpoints saved yet.</div>
      ) : (
        <div className="space-y-3">
          {navpoints.map((point, index) => (
            <button
              key={index}
              onClick={() => handleSelect(point)}
              className="w-full bg-zinc-700 hover:bg-amber-700 text-white font-bold py-3 rounded-lg"
            >
              {point.name} ({point.lat.toFixed(2)}, {point.lon.toFixed(2)})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import { useNavpoints } from "../context/NavpointsContext";

export default function SetDestinationModal({ closeModal }) {
  const { navpoints, destinations, addDestination, clearDestinations } = useNavpoints();

  const handleSelect = (point) => {
    addDestination(point);
    closeModal();
  };

  // 🔒 Filter out bad data (e.g., lat/lon strings or missing fields)
  const validNavpoints = navpoints.filter(
    (p) =>
      typeof p.lat === "number" &&
      typeof p.lon === "number" &&
      !isNaN(p.lat) &&
      !isNaN(p.lon)
  );

  return (
    <div className="p-6 bg-zinc-800 rounded-2xl shadow-xl space-y-4">
      <h2 className="text-2xl font-bold text-white text-center mb-4">Set Destination</h2>

      {validNavpoints.length === 0 ? (
        <div className="text-zinc-400 text-center">No valid navpoints found.</div>
      ) : (
        <>
          <div className="space-y-3">
            {validNavpoints.map((point, index) => {
              const tripIndex = destinations.findIndex(
                (d) => d.lat === point.lat && d.lon === point.lon && d.name === point.name
              );
              const isInTrip = tripIndex !== -1;

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(point)}
                  className="w-full flex items-center gap-4 bg-zinc-700 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg"
                >
                  <div className="w-8 text-left text-amber-400">
                    {isInTrip ? `#${tripIndex + 1}` : ""}
                  </div>
                  <div className="flex-1 text-left">
                    {point.name} ({point.lat.toFixed(2)}, {point.lon.toFixed(2)})
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              clearDestinations();
              closeModal();
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg mt-4"
          >
            ❌ Clear Trip
          </button>
        </>
      )}
    </div>
  );
}

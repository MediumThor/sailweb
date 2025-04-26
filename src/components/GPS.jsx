import React from "react";

export default function GPS() {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-3xl font-bold">📡 GPS</h2>
      <p className="text-lg text-zinc-400">Awaiting GPS data from Arduino...</p>
      <div className="bg-zinc-800 p-4 rounded-lg shadow text-left max-w-md mx-auto">
        <p><span className="font-semibold">Latitude:</span> --</p>
        <p><span className="font-semibold">Longitude:</span> --</p>
        <p><span className="font-semibold">Speed:</span> -- knots</p>
        <p><span className="font-semibold">Course:</span> --°</p>
        <p><span className="font-semibold">Satellites:</span> --</p>
      </div>
    </div>
  );
}

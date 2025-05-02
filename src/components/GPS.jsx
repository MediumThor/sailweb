import React, { useEffect, useState } from "react";
import liveData from "../utils/liveData";

export default function GPS() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}:8081`);

    ws.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        liveData.set(json);  // update shared data store
        setData(json);       // local state
      } catch (err) {
        console.error("WebSocket error:", err);
      }
    };

    ws.onopen = () => console.log("📡 Connected to GPS WebSocket");
    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("GPS WebSocket closed");

    return () => ws.close();
  }, []);

  return (
    <div className="text-center space-y-4">
      <h2 className="text-3xl font-bold">📡 GPS</h2>
      {!data ? (
        <p className="text-lg text-zinc-400">Awaiting GPS data from Arduino...</p>
      ) : (
        <div className="bg-zinc-800 p-4 rounded-lg shadow text-left max-w-md mx-auto">
          <p><span className="font-semibold">Latitude:</span> {data.lat}</p>
          <p><span className="font-semibold">Longitude:</span> {data.lon}</p>
          <p><span className="font-semibold">Speed:</span> {data.speed} knots</p>
          <p><span className="font-semibold">Course:</span> {data.heading}°</p>
          <p><span className="font-semibold">Satellites:</span> {data.sats}</p>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { useDisplaySettings } from "../context/DisplaySettingsContext";
import { useNavpoints } from "../context/NavpointsContext";

export default function Settings({ nightMode, setNightMode, hideCursor, setHideCursor }) {
  const [brightness, setBrightness] = useState(100);
  const [soundEffects, setSoundEffects] = useState(() => localStorage.getItem("soundEffects") === "true");
  const [connectionStatus, setConnectionStatus] = useState("unknown");
  const [latestMessage, setLatestMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const clickSoundRef = useRef(null);

  const {
    showSpeedPanel, setShowSpeedPanel,
    showWindPanel, setShowWindPanel,
    showGpsMarker, setShowGpsMarker,
    showSoundings, setShowSoundings,
    showNavpoints, setShowNavpoints,   // 🛠️ ADD this line!!
  } = useDisplaySettings();

  const { navpoints, removeNavpoint } = useNavpoints();

  useEffect(() => {
    localStorage.setItem("soundEffects", soundEffects);
  }, [soundEffects]);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.68.57:3000/signalk/v1/stream");
    setSocket(ws);

    ws.onopen = () => setConnectionStatus("connected");
    ws.onclose = () => setConnectionStatus("disconnected");
    ws.onerror = () => setConnectionStatus("error");
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.updates) setLatestMessage(msg);
      } catch {}
    };

    return () => ws.close();
  }, []);

  const playClickSound = () => {
    if (soundEffects && clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play();
    }
  };

  return (
    <div className="space-y-6">
      <audio ref={clickSoundRef} src="/click.mp3" preload="auto" />

      <h2 className="text-3xl font-bold">⚙️ Settings</h2>

      {/* Other Settings... */}

      {/* Chart Display Toggles */}
      <div className="bg-zinc-800 rounded-lg p-4 space-y-4">
        <h3 className="text-xl font-semibold">Chart Display</h3>

        {/* Toggle Speed/Heading/Depth */}
        <label className="flex items-center justify-between bg-zinc-700 p-3 rounded-lg cursor-pointer">
          <span className="text-lg">Show Speed / Heading / Depth</span>
          <input
            type="checkbox"
            checked={showSpeedPanel}
            onChange={() => { setShowSpeedPanel(!showSpeedPanel); playClickSound(); }}
            className="w-6 h-6"
          />
        </label>

        {/* Toggle Wind Panel */}
        <label className="flex items-center justify-between bg-zinc-700 p-3 rounded-lg cursor-pointer">
          <span className="text-lg">Show Wind Data</span>
          <input
            type="checkbox"
            checked={showWindPanel}
            onChange={() => { setShowWindPanel(!showWindPanel); playClickSound(); }}
            className="w-6 h-6"
          />
        </label>

        {/* Toggle GPS Marker */}
        <label className="flex items-center justify-between bg-zinc-700 p-3 rounded-lg cursor-pointer">
          <span className="text-lg">Show GPS Marker</span>
          <input
            type="checkbox"
            checked={showGpsMarker}
            onChange={() => { setShowGpsMarker(!showGpsMarker); playClickSound(); }}
            className="w-6 h-6"
          />
        </label>

        {/* Toggle Soundings */}
        <label className="flex items-center justify-between bg-zinc-700 p-3 rounded-lg cursor-pointer">
          <span className="text-lg">Show Soundings</span>
          <input
            type="checkbox"
            checked={showSoundings}
            onChange={() => { setShowSoundings(!showSoundings); playClickSound(); }}
            className="w-6 h-6"
          />
        </label>

        {/* 🔥 Toggle Navpoints */}
        <label className="flex items-center justify-between bg-zinc-700 p-3 rounded-lg cursor-pointer">
          <span className="text-lg">Show Navpoints</span>
          <input
            type="checkbox"
            checked={showNavpoints}
            onChange={() => { setShowNavpoints(!showNavpoints); playClickSound(); }}
            className="w-6 h-6"
          />
        </label>
      </div>

      {/* Manage Navpoints Section */}
      <div className="bg-zinc-800 rounded-lg p-4 space-y-4">
        <h3 className="text-xl font-semibold">Manage Navpoints</h3>
        {navpoints.length === 0 ? (
          <div className="text-zinc-400">No navpoints saved yet.</div>
        ) : (
          navpoints.map((point, index) => (
            <div key={index} className="flex items-center justify-between bg-zinc-700 p-3 rounded-lg">
              <div>
                <div className="font-bold">{point.name}</div>
                <div className="text-sm text-zinc-400">{point.lat.toFixed(4)}, {point.lon.toFixed(4)}</div>
              </div>
              <button
                onClick={() => removeNavpoint(index)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

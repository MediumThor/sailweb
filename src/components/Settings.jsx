import React, { useState, useEffect, useRef } from "react";
import { useDisplaySettings } from "../context/DisplaySettingsContext";
import { useNavpoints } from "../context/NavpointsContext";
import { useNavigate } from "react-router-dom";
import TouchKeyboard from "../components/TouchKeyboard";



export default function Settings({ nightMode, setNightMode, brightness, setBrightness}){
  const [soundEffects, setSoundEffects] = useState(() => localStorage.getItem("soundEffects") === "true");
  const [connectionStatus, setConnectionStatus] = useState("unknown");
  const [latestMessage, setLatestMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const clickSoundRef = useRef(null);
  const navigate = useNavigate();
  const [boatName, setBoatName] = useState(() => localStorage.getItem("boatName") || "");
const [showBoatNameModal, setShowBoatNameModal] = useState(false);
const [boatNameInput, setBoatNameInput] = useState(boatName);
const [keyboardResetSignal, setKeyboardResetSignal] = useState(0);


  const {
    showSpeedPanel, setShowSpeedPanel,
    showWindPanel, setShowWindPanel,
    showGpsMarker, setShowGpsMarker,
    showSoundings, setShowSoundings,
    showNavpoints, setShowNavpoints,   // 🛠️ ADD this line!!
  } = useDisplaySettings();

  const { navpoints, removeNavpoint, fetchNavpoints } = useNavpoints();

  useEffect(() => {
    fetchNavpoints(); // ✅ ensure fresh list from server
  }, []);
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

      <h2 className="text-3xl font-bold">Settings</h2>

      <div className="bg-zinc-800 rounded-lg p-4 flex items-center justify-between">
  <span className="text-xl">Boat Name</span>
  <button
    onClick={() => {
      setShowBoatNameModal(true);
      setKeyboardResetSignal((s) => s + 1); // reset keyboard
    }}
    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
  >
    {boatName || "Set Name"}
  </button>
</div>

 {/* Night Mode Toggle */}
 <div className="bg-zinc-800 rounded-lg p-4 flex items-center justify-between">
        <span className="text-xl">Night Mode</span>
        <input
          type="checkbox"
          checked={nightMode}
          onChange={() => { setNightMode(!nightMode); playClickSound(); }}
          className="w-8 h-8"
        />
      </div>

   {/* Brightness Slider */}
<div className="bg-zinc-800 rounded-lg p-4 space-y-4">
  <h3 className="text-xl font-semibold mb-2">Screen Brightness</h3>
  <input
  type="range"
  min="10"
  max="100"
  value={brightness}
  onChange={(e) => setBrightness(Number(e.target.value))}
  className="w-full appearance-none bg-zinc-700 rounded-lg"
  style={{
    WebkitAppearance: "none",
    height: "2rem",
    borderRadius: "1rem",
    outline: "none",
    background: "#404040",
  }}
/>
  <style>{`
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 3rem;
      width: 3rem;
      background: #fbbf24;
      border-radius: 50%;
      cursor: pointer;
    }
    input[type="range"]::-moz-range-thumb {
      height: 3rem;
      width: 3rem;
      background: #fbbf24;
      border-radius: 50%;
      cursor: pointer;
    }
  `}</style>
</div>





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

    {/* Manage Wifi */}

    <button
  onClick={() => navigate("/wifi")}
  className="bg-zinc-700 text-white py-2 px-4 rounded-lg"
>
  Manage Wi-Fi
</button>


{/* Manage Navpoints Section */}
<div className="bg-zinc-800 rounded-lg p-4 space-y-4">
  <h3 className="text-xl font-semibold">Manage Navpoints</h3>

  {/* Export / Import Controls */}
  <div className="flex justify-between gap-4">
    <button
      onClick={() => {
        const blob = new Blob([JSON.stringify(navpoints, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "navpoints.json";
        a.click();
        URL.revokeObjectURL(url);
      }}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg"
    >
      ⬇️ Export
    </button>

    <input
      type="file"
      accept="application/json"
      onChange={(e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const data = JSON.parse(reader.result);
            if (Array.isArray(data)) {
              data.forEach(point => {
                if (point.name && typeof point.lat === "number" && typeof point.lon === "number") {
                  // prevent duplicates
                  if (!navpoints.some(p => p.name === point.name && p.lat === point.lat && p.lon === point.lon)) {
                    addNavpoint(point.name, point.lat, point.lon);
                  }
                }
              });
            }
          } catch (err) {
            alert("Invalid JSON file");
          }
        };
        reader.readAsText(file);
      }}
      className="text-white"
    />
  </div>

   {/* Navpoint list */}
{!Array.isArray(navpoints) || navpoints.length === 0 ? (
  <div className="text-zinc-400">No navpoints saved yet.</div>
) : (
  navpoints
    .map((p, i) => ({ ...p, __index: i })) // preserve original index
    .filter(
      (point) =>
        typeof point.lat === "number" &&
        typeof point.lon === "number" &&
        !isNaN(point.lat) &&
        !isNaN(point.lon)
    )
    .map((point) => (
      <div key={point.__index} className="flex items-center justify-between bg-zinc-700 p-3 rounded-lg">
        <div>
          <div className="font-bold">{point.name}</div>
          <div className="text-sm text-zinc-400">
            {point.lat.toFixed(4)}, {point.lon.toFixed(4)}
          </div>
        </div>
        
        <button
          onClick={() => removeNavpoint(point.__index)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded-lg"
        >
          Delete
        </button>
      </div>
    ))
)}

</div>


  

    {/* Boat Name */}


      {showBoatNameModal && (
  <div className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex flex-col items-center justify-center px-4">
<div className="bg-zinc-900 p-6 rounded-2xl shadow-xl w-full max-w-lg text-white space-y-6 text-center translate-y-[-15vh]">
<h2 className="text-2xl font-bold">Set Your Boat Name</h2>
      <div className="text-3xl font-mono bg-zinc-800 p-4 rounded-xl">{boatNameInput || "—"}</div>
      <div className="flex justify-center gap-4">
        <button
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl text-white font-bold"
          onClick={() => {
            setBoatName(boatNameInput);
            localStorage.setItem("boatName", boatNameInput);
            setShowBoatNameModal(false);
            playClickSound();
          }}
        >
          Save
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl text-white font-bold"
          onClick={() => {
            setShowBoatNameModal(false);
            setBoatNameInput(boatName);
            playClickSound();
          }}
        >
          Cancel
        </button>
      </div>
    </div>

    <TouchKeyboard
      input={boatNameInput}
      onInputChange={setBoatNameInput}
      visible={true}
      resetSignal={keyboardResetSignal}
    />
  </div>
)}

    </div>
  );
}

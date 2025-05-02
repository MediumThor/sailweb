import { useState, useEffect } from "react";
import { useNavpoints } from "../context/NavpointsContext";
import TouchKeyboard from "./TouchKeyboard";

export default function AddNavpointModal({ closeModal, lat: presetLat, lon: presetLon }) {
  const { addNavpoint } = useNavpoints();
  const [name, setName] = useState("");
  const [lat, setLat] = useState(presetLat?.toFixed(5) || "");
  const [lon, setLon] = useState(presetLon?.toFixed(5) || "");

  const [activeField, setActiveField] = useState(null);
  const [keyboardInput, setKeyboardInput] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleFocus = (field) => {
    setActiveField(field);
    if (field === "name") setKeyboardInput(name);
    if (field === "lat") setKeyboardInput(lat);
    if (field === "lon") setKeyboardInput(lon);
  };

  const handleKeyboardInput = (input) => {
    setKeyboardInput(input);
    if (activeField === "name") setName(input);
    if (activeField === "lat") setLat(input);
    if (activeField === "lon") setLon(input);
  };

  const handleSubmit = async () => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
  
    if (!name || isNaN(latNum) || isNaN(lonNum)) {
      alert("Please enter valid name, latitude, and longitude.");
      return;
    }
  
    await addNavpoint(name, latNum, lonNum);
    closeModal();
    setName("");
    setLat("");
    setLon("");
    setKeyboardInput("");
    setActiveField(null);
  };
  

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-start pt-[8%] z-[99999]"
      onClick={(e) => {
        if (e.target.id === "modal-backdrop") {
          closeModal();
        }
      }}
    >
      <div
        className="p-6 bg-zinc-800 rounded-2xl shadow-xl space-y-4 w-[90%] max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white text-center">Add Navpoint</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-4 text-2xl bg-zinc-700 rounded-lg text-white"
          value={keyboardInput && activeField === "name" ? keyboardInput : name}
          onFocus={() => handleFocus("name")}
          readOnly
        />
        <input
          type="text"
          placeholder="Latitude"
          className="w-full p-4 text-2xl bg-zinc-700 rounded-lg text-white"
          value={keyboardInput && activeField === "lat" ? keyboardInput : lat}
          onFocus={() => handleFocus("lat")}
          readOnly
        />
        <input
          type="text"
          placeholder="Longitude"
          className="w-full p-4 text-2xl bg-zinc-700 rounded-lg text-white"
          value={keyboardInput && activeField === "lon" ? keyboardInput : lon}
          onFocus={() => handleFocus("lon")}
          readOnly
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-lg mt-2"
        >
          Save
        </button>
      </div>

      <TouchKeyboard
        onInputChange={handleKeyboardInput}
        layout={activeField === "name" ? "default" : "numbers"}
        input={keyboardInput}
        visible={!!activeField}
      />
    </div>
  );
}

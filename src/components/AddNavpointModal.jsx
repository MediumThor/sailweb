import { useState } from "react";
import { useNavpoints } from "../context/NavpointsContext";
import TouchKeyboard from "./TouchKeyboard";

export default function AddNavpointModal({ closeModal }) {
  const { addNavpoint } = useNavpoints();
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  const [activeField, setActiveField] = useState(null);
  const [keyboardInput, setKeyboardInput] = useState("");

  const handleFocus = (field) => {
    setActiveField(field);
    // When switching fields, reset keyboardInput to match that field exactly
    if (field === "name") setKeyboardInput(name);
    if (field === "lat") setKeyboardInput(lat);
    if (field === "lon") setKeyboardInput(lon);
  };

  const handleKeyboardInput = (input) => {
    setKeyboardInput(input);

    // Write to correct field
    if (activeField === "name") setName(input);
    if (activeField === "lat") setLat(input);
    if (activeField === "lon") setLon(input);
  };

  const handleSubmit = () => {
    if (!name || !lat || !lon) {
      alert("Please fill all fields!");
      return;
    }
    addNavpoint(name, parseFloat(lat), parseFloat(lon));
    closeModal();
    setName("");
    setLat("");
    setLon("");
    setKeyboardInput("");
    setActiveField(null);
  };

  return (
    <div className="p-6 bg-zinc-800 rounded-2xl shadow-xl space-y-4 relative">
      <h2 className="text-2xl font-bold text-white">Add Navpoint</h2>

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
        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-lg"
      >
        Save
      </button>

      <TouchKeyboard
        onInputChange={handleKeyboardInput}
        layout={activeField === "name" ? "default" : "numbers"}
        input={keyboardInput}
        visible={!!activeField}
      />
    </div>
  );
}

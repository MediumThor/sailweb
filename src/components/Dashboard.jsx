import React from "react";
import { useModal } from "../context/ModalContext";
import Modal from "./Modal";

export default function Dashboard({ signalkData }) {
  const { openModal } = useModal();

  const heading = signalkData?.updates?.find(u =>
    u.values?.some(v => v.path === "navigation.headingTrue")
  )?.values?.find(v => v.path === "navigation.headingTrue")?.value;

  const temperature = signalkData?.updates?.find(u =>
    u.values?.some(v => v.path === "environment.outside.temperature")
  )?.values?.find(v => v.path === "environment.outside.temperature")?.value;

  const wind = signalkData?.updates?.find(u =>
    u.values?.some(v => v.path === "environment.wind.speedApparent")
  )?.values?.find(v => v.path === "environment.wind.speedApparent")?.value;

  const gps = signalkData?.updates?.find(u =>
    u.values?.some(v => v.path === "navigation.position")
  )?.values?.find(v => v.path === "navigation.position")?.value;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <button
          className="bg-zinc-800 p-12 rounded shadow text-left text-2xl hover:text-amber-300"
          onClick={() => openModal("heading")}
        >
          🧭 Heading: {heading ? `${Math.round(heading * (180 / Math.PI))}°` : "---"}
        </button>
        <button
          className="bg-zinc-800 p-12 rounded shadow text-left text-2xl hover:text-amber-300"
          onClick={() => openModal("temperature")}
        >
          🌡 Temp: {temperature ? `${Math.round(temperature * 9/5 + 32)}°F` : "---"}
        </button>
        <button
          className="bg-zinc-800 p-12 rounded shadow text-left text-2xl hover:text-amber-300"
          onClick={() => openModal("wind")}
        >
          💨 Wind: {wind ? `${(wind * 1.94384).toFixed(1)} kn` : "---"}
        </button>
        <button
          className="bg-zinc-800 p-12 rounded shadow text-left text-2xl hover:text-amber-300"
          onClick={() => openModal("gps")}
        >
          📍 GPS: {gps ? `${gps.latitude.toFixed(4)}, ${gps.longitude.toFixed(4)}` : "---"}
        </button>
      </div>

      <Modal name="heading">
  Heading: {heading ? `${Math.round(heading * (180 / Math.PI))}°` : "---"}
</Modal>


<Modal name="temperature">
  Temperature: {temperature ? `${Math.round(temperature * 9/5 + 32)}°F` : "---"}
</Modal>


<Modal name="wind">
  Wind: {wind ? `${(wind * 1.94384).toFixed(1)} knots` : "---"}
</Modal>


<Modal name="gps">
  {gps ? (
    <>
      Latitude: {gps.latitude.toFixed(6)}
      <br />
      Longitude: {gps.longitude.toFixed(6)}
    </>
  ) : (
    "No GPS Data"
  )}
</Modal>

    </div>
  );
}

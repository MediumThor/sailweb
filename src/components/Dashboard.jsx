import React, { useEffect, useState } from "react";
import { useModal } from "../context/ModalContext";
import Modal from "./Modal";
import ExpandableWindButton from "../instruments/ExpandableWindButton";
import liveData from "../utils/liveData";

export default function Dashboard({ signalkData }) {
  const { openModal } = useModal();
  const [bmeData, setBmeData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}:8081`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setBmeData(data);
        liveData.set(data); // 🔄 update central data
      } catch (err) {
        console.error("WebSocket error:", err);
      }
    };

    ws.onopen = () => console.log("📡 Connected to serial WebSocket");
    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, []);

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
        {/* BME280 tiles */}
        <div className="bg-zinc-800 p-12 rounded-2xl shadow text-left text-2xl">
          BME Temp: {bmeData ? `${bmeData.temperature}°F` : "Waiting for Arduino..."}
        </div>

        <div className="bg-zinc-800 p-12 rounded-2xl shadow text-left text-2xl">
          BME Humidity: {bmeData ? `${bmeData.humidity}%` : "Waiting for Arduino..."}
        </div>

        <div className="bg-zinc-800 p-12 rounded-2xl shadow text-left text-2xl">
          BME Pressure: {bmeData ? `${bmeData.pressure} hPa` : "Waiting for Arduino..."}
        </div>

        {/* SignalK tiles */}
        <button
          className="bg-zinc-800 p-12 rounded-2xl shadow text-left text-2xl hover:text-amber-300"
          onClick={() => openModal("heading")}
        >
          Heading: {heading ? `${Math.round(heading * (180 / Math.PI))}°` : "---"}
        </button>

        <button
          className="bg-zinc-800 p-12 rounded-2xl shadow text-left text-2xl hover:text-amber-300"
          onClick={() => openModal("wind")}
        >
          Wind: {wind ? `${(wind * 1.94384).toFixed(1)} kn` : "---"}
        </button>

        <button
          className="bg-zinc-800 p-12 rounded-2xl shadow text-left text-2xl hover:text-amber-300"
          onClick={() => openModal("gps")}
        >
          GPS: {bmeData?.lat && bmeData?.lon ? `${bmeData.lat.toFixed(4)}, ${bmeData.lon.toFixed(4)}` : "---"}
        </button>

        {/* Expandable Wind */}
        <ExpandableWindButton
          data={{
            heading: 0,
            trueWindDirection: 120,
            apparentWindDirection: 80,
            trueWindSpeed: 14,
            apparentWindSpeed: 18,
          }}
        />
      </div>
    </div>
  );
}

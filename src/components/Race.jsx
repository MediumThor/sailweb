import React, { useEffect, useState } from "react";
import liveData from "../utils/liveData";
import { useNavpoints } from "../context/NavpointsContext";
import { useKeyboard } from "../context/KeyboardContext";
import TouchKeyboard from "../components/TouchKeyboard";
import SetDestinationModal from "../components/SetDestinationModal";
import { calculateBearing } from "../utils/calculateBearing";
import { calculateDistance } from "../utils/calculateDistance";

export default function Race() {
  const { destinations } = useNavpoints();
  const { activeField, setActiveField, inputValue } = useKeyboard();
  const [data, setData] = useState(liveData.get());

  const [tempRaceTime, setTempRaceTime] = useState("13:10");
  const [raceTime, setRaceTime] = useState(null); // real start time
  const [showDestModal, setShowDestModal] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [editingRaceTime, setEditingRaceTime] = useState(false);
  const [countdownStarted, setCountdownStarted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(liveData.get());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeField === "raceTime") {
      setTempRaceTime(inputValue);
    }
  }, [inputValue, activeField]);

  const now = new Date();
  let raceTarget = null;
  let countdown = "--";

  if (raceTime && countdownStarted) {
    const [hour, minute] = raceTime.split(":").map(Number);
    raceTarget = new Date();
    raceTarget.setHours(hour);
    raceTarget.setMinutes(minute);
    raceTarget.setSeconds(0);

    const countdownMs = raceTarget - now;
    countdown =
      countdownMs > 0
        ? `${Math.floor(countdownMs / 60000)}m ${Math.floor(
            (countdownMs % 60000) / 1000
          )}s`
        : "Race Started";
  }

  const currentLat = data?.gps?.lat;
  const currentLon = data?.gps?.lon;
  const speed = data?.gps?.speed?.toFixed(1);

  const next = destinations?.[0];
  const bearing = next
    ? calculateBearing(currentLat, currentLon, next.lat, next.lon).toFixed(0)
    : "--";
  const distance = next
    ? calculateDistance(currentLat, currentLon, next.lat, next.lon).toFixed(2)
    : "--";

  const handleBackdropClick = () => {
    setKeyboardVisible(false);
    setActiveField(null);
    setEditingRaceTime(false);
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Race Dashboard</h1>

      <div className="mb-4">
        <label className="block text-lg mb-2">Start Time (HH:MM):</label>
        <input
          type="text"
          value={tempRaceTime}
          readOnly
          onFocus={() => {
            setActiveField("raceTime");
            setKeyboardVisible(true);
            setEditingRaceTime(true);
          }}
          className="bg-zinc-700 px-4 py-2 rounded-lg text-lg text-white w-32 text-center"
        />

        <button
          onClick={() => {
            setRaceTime(tempRaceTime);
            setCountdownStarted(true);
            setKeyboardVisible(false);
            setActiveField(null);
            setEditingRaceTime(false);
          }}
          className="mt-2 ml-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
        >
          Start Countdown
        </button>
      </div>

      {countdownStarted && (
        <div className="text-2xl mb-6">⏱ Countdown: {countdown}</div>
      )}

      <div className="grid grid-cols-2 gap-6 text-xl">
        <div>
          <div className="text-sm">Speed</div>
          <div className="text-3xl font-bold">{speed || "--"} kt</div>
        </div>
        <div>
          <div className="text-sm">Bearing to Next</div>
          <div className="text-3xl font-bold">{bearing}°</div>
        </div>
        <div>
          <div className="text-sm">Distance to Next</div>
          <div className="text-3xl font-bold">{distance} nm</div>
        </div>
      </div>

      <div className="mt-8 flex gap-4 justify-center">
        <button
          onClick={() => setShowDestModal(true)}
          className="px-6 py-2 rounded-lg bg-amber-600 text-white"
        >
          Set Race Course
        </button>
      </div>

      {keyboardVisible && editingRaceTime && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center"
          onClick={handleBackdropClick}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <TouchKeyboard
              visible={keyboardVisible}
              input={tempRaceTime}
              onInputChange={(val) => setTempRaceTime(val)}
              layout="raceTime"
            />
          </div>
        </div>
      )}

      {showDestModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-[10001] flex items-center justify-center"
          onClick={() => setShowDestModal(false)}
        >
          <div
            className="bg-zinc-800 p-6 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <SetDestinationModal closeModal={() => setShowDestModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import WifiKeyboard from "./WifiKeyboard";

export default function Wifi() {
  const [networks, setNetworks] = useState([]);
  const [connected, setConnected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedSSID, setSelectedSSID] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const fetchNetworks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://${window.location.hostname}:8085/api/wifi/scan`);
      const data = await res.json();
      if (data.connected) setConnected(data.connected);
      if (data.networks) setNetworks(data.networks);
    } catch (err) {
      console.error("Failed to fetch Wi-Fi networks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworks();
  }, []);

  const getBand = (channel) => {
    if (!channel) return "";
    return channel <= 14 ? "2.4GHz" : "5GHz";
  };

  const getSignalBars = (signal) => {
    if (signal >= 80) return "Signal: Excellent";
    if (signal >= 60) return "Signal: Good";
    if (signal >= 40) return "Signal: Fair";
    if (signal >= 20) return "Signal: Weak";
    if (signal > 0) return "Signal: Very Weak";
    return "No Signal";
  };

  const handleConnect = (ssid) => {
    setSelectedSSID(ssid);
    setPassword("");
    setShowPasswordModal(true);
    setKeyboardVisible(true);
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      setStatusMessage("Password is required.");
      return;
    }
  
    setShowPasswordModal(false);
    setKeyboardVisible(false);
    setStatusMessage(`Connecting to ${selectedSSID}...`);
  
    console.log("▶️ Attempting to connect to:", selectedSSID, "with password:", password);
  
    try {
      const res = await fetch(`http://${window.location.hostname}:8085/api/wifi/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ssid: selectedSSID, password }),
      });
  
      const text = await res.text();
      console.log("⬅️ Raw response from backend:", text);
  
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("❌ Failed to parse backend response as JSON:", err);
        setStatusMessage("Invalid server response.");
        return;
      }
  
      if (!res.ok) {
        console.error("❌ Connection error:", data.error || text);
        setStatusMessage(data.error || "Failed to connect.");
        return;
      }
  
      console.log("✅ Connection initiated:", data);
      setStatusMessage(`Connected to ${selectedSSID}`);
      fetchNetworks();
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setStatusMessage("Failed to connect.");
    }
  };
  

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Wi-Fi Networks</h2>

      <div className="bg-zinc-800 p-4 rounded-lg space-y-2">
        <div className="text-lg mb-2">
          Connected to: {connected || "None"}
        </div>

        {statusMessage && (
          <div className="text-center text-lg text-amber-400 my-4">
            {statusMessage}
          </div>
        )}

        <button
          onClick={fetchNetworks}
          className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg"
        >
          Refresh Networks
        </button>

        {loading ? (
          <div className="mt-4 text-zinc-400">Loading networks...</div>
        ) : networks.length === 0 ? (
          <div className="mt-4 text-zinc-400">No networks found.</div>
        ) : (
          <div className="mt-4 space-y-4">
            {networks.map((net, idx) => {
              const name = net.ssid && net.ssid.trim() !== "" ? net.ssid : "(Unnamed Network)";
              const band = getBand(net.channel);
              const signal = getSignalBars(net.signal);
              const secure = net.security && net.security !== "none";

              return (
                <div key={idx} className="bg-zinc-700 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold">
                      {secure && "🔒"} {name} {band && `(${band})`}
                    </div>
                    <div className="text-sm text-zinc-400">{signal}</div>
                  </div>
                  {!net.inUse ? (
                    <button
                      onClick={() => handleConnect(net.ssid)}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                    >
                      Connect
                    </button>
                  ) : (
                    <div className="text-green-400 font-semibold">Connected</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-[10vh] z-[9999]">
        <div className="bg-zinc-800 p-8 rounded-lg shadow-2xl relative max-w-md w-full">
            <h3 className="text-xl text-center mb-4">Enter Password for {selectedSSID}</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 text-2xl text-black bg-zinc-100 rounded-lg mb-6 border-2 border-gray-500"
              placeholder="Password"
            />
            <div className="flex justify-between">
              <button
                onClick={handlePasswordSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Connect
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setKeyboardVisible(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wifi Keyboard */}
      {keyboardVisible && (
        <WifiKeyboard
          input={password}
          onInputChange={setPassword}
          visible={keyboardVisible}
          layout="default"
        />
      )}

      <button
        onClick={() => navigate("/settings")}
        className="bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-4 rounded-lg"
      >
        Back to Settings
      </button>
    </div>
  );
}

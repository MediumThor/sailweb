import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

function App() {
  const [signalkData, setSignalkData] = useState({});

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.68.57:3000/signalk/v1/stream");

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.updates) {
          setSignalkData((prev) => ({ ...prev, ...msg }));
        }
      } catch (e) {
        console.error("Failed to parse SignalK message", e);
      }
    };

    socket.onerror = (error) => console.error("WebSocket error:", error);
    socket.onclose = () => console.warn("SignalK WebSocket closed");

    return () => socket.close();
  }, []);

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <Dashboard signalkData={signalkData} />
        </main>
      </div>
    </div>
  );
}

export default App;


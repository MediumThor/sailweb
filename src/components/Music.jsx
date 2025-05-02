import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SpotifyLoginModal from "./Spotify/SpotifyLoginModal";

export default function Music() {
  const [showSpotifyModal, setShowSpotifyModal] = useState(false);

 

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      <button
        className="w-72 h-40 text-4xl bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition"
      >
        Spotify
      </button>

      <button
        className="w-72 h-40 text-4xl bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
      >
        Offline Music
      </button>

      {showSpotifyModal && <SpotifyLoginModal closeModal={() => setShowSpotifyModal(false)} />}
    </div>
  );
}

// src/components/Spotify/SpotifyLoginModal.jsx
import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { generateCodeVerifier, generateCodeChallenge } from "../../utils/spotifyAuth";

const CLIENT_ID = "0affdf1b6562488ba4aac4ac08ce8c81";
const REDIRECT_URI = "https://accounts.spotify.com/authorize?...&redirect_uri=https%3A%2F%2Fbellastone.net%2Fcallback";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SCOPES = [
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
  "user-read-private",
  "user-read-email"
];

export default function SpotifyLoginModal({ closeModal }) {
  const [authUrl, setAuthUrl] = useState("");

  useEffect(() => {
    const setupQR = async () => {
      const verifier = generateCodeVerifier();
      const challenge = await generateCodeChallenge(verifier);
      localStorage.setItem("spotify_code_verifier", verifier);

      const url = `${AUTH_ENDPOINT}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&scope=${encodeURIComponent(SCOPES.join(" "))}&code_challenge_method=S256&code_challenge=${challenge}`;

      setAuthUrl(url);
    };

    setupQR();
  }, []);
  useEffect(() => {
    const channel = new BroadcastChannel("spotify-auth");
  
    channel.onmessage = async (event) => {
      const { code } = event.data;
      const verifier = localStorage.getItem("spotify_code_verifier");
  
      if (!code || !verifier) return;
  
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier: verifier,
      });
  
      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body.toString(),
        });
  
        const data = await response.json();
        if (data.access_token) {
          localStorage.setItem("spotify_token", data.access_token);
          window.location.href = "/music/spotify/player";
        } else {
          console.error("Failed to get token:", data);
        }
      } catch (err) {
        console.error("Token exchange error:", err);
      }
    };
  
    return () => channel.close();
  }, []);
  

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("spotify_token");
      if (token) {
        clearInterval(interval);
        window.location.href = "/music/spotify/player";
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex flex-col items-center justify-center"
      onClick={(e) => {
        if (e.target.id === "modal-backdrop") {
          closeModal();
        }
      }}
    >
      <div className="bg-zinc-900 p-8 rounded-2xl max-w-md text-center shadow-2xl border border-zinc-700">
        <h2 className="text-white text-3xl font-bold mb-4">Scan to Login with Spotify</h2>
        <p className="text-zinc-400 mb-6 text-lg">
          Scan the QR code on your phone to authenticate your Spotify account.
        </p>
        {authUrl && (
          <QRCodeCanvas value={authUrl} size={512} bgColor="#111827" fgColor="#10B981" />
        )}
        <button
          onClick={closeModal}
          className="mt-8 px-6 py-3 text-xl bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

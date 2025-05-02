import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { generateCodeVerifier, generateCodeChallenge } from "../../utils/spotifyAuth";

const CLIENT_ID = "0affdf1b6562488ba4aac4ac08ce8c81";
const REDIRECT_URI = "https://bellastone.net/callback";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SCOPES = [
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
  "user-read-private",
  "user-read-email"
];

export default function SpotifyAuth() {
  const [authUrl, setAuthUrl] = useState("");

  useEffect(() => {
    const setup = async () => {
      const verifier = generateCodeVerifier();
      const challenge = await generateCodeChallenge(verifier);
      localStorage.setItem("spotify_code_verifier", verifier);

      const scopeParam = encodeURIComponent(SCOPES.join(" "));
      const url = `${AUTH_ENDPOINT}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scopeParam}&code_challenge_method=S256&code_challenge=${challenge}`;

      setAuthUrl(url);
    };

    setup();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 text-white">
      <h1 className="text-4xl">Scan to Connect Spotify</h1>
      {authUrl && <QRCodeCanvas value={authUrl} size={300} />}
      <p className="text-xl">Use your phone to log in.</p>
    </div>
  );
}

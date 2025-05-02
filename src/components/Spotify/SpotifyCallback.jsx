import { useEffect } from "react";

const CLIENT_ID = "0affdf1b6562488ba4aac4ac08ce8c81";
const REDIRECT_URI = "https://bellastone.net/callback"; // this MUST match Spotify's configured redirect

export default function SpotifyCallback() {
  useEffect(() => {
    const bc = new BroadcastChannel("spotify-auth");

    bc.onmessage = async (event) => {
      const { code } = event.data;
      const verifier = localStorage.getItem("spotify_code_verifier");

      if (!code || !verifier) {
        console.error("❌ Missing code or verifier");
        return;
      }

      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier: verifier,
      });

      try {
        const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });

        const data = await tokenRes.json();

        if (data.access_token) {
          localStorage.setItem("spotify_token", data.access_token);
          window.location.href = "/music/spotify/player";
        } else {
          console.error("❌ Token exchange failed:", data);
        }
      } catch (err) {
        console.error("❌ Error exchanging token:", err);
      }

      bc.close();
    };

    return () => bc.close();
  }, []);

  return (
    <div className="text-white text-center mt-20 text-xl">
      Waiting for Spotify login...
    </div>
  );
}

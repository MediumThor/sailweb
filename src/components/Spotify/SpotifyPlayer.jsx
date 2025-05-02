import React, { useEffect, useState } from "react";

export default function SpotifyPlayer() {
  const [track, setTrack] = useState(null);
  const token = localStorage.getItem("spotify_token");

  useEffect(() => {
    if (!token) return;
    fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.item) {
          setTrack({
            name: data.item.name,
            artist: data.item.artists.map((a) => a.name).join(", "),
            albumArt: data.item.album.images[0].url,
          });
        }
      });
  }, [token]);

  const handleControl = (type) => {
    fetch(`https://api.spotify.com/v1/me/player/${type}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  if (!track) {
    return <div className="text-center text-xl">No music playing</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <img src={track.albumArt} alt="Album Art" className="w-64 rounded-lg shadow" />
      <div className="text-3xl font-bold">{track.name}</div>
      <div className="text-xl text-zinc-400">{track.artist}</div>
      <div className="space-x-6 mt-4">
        <button onClick={() => handleControl("previous")} className="text-3xl">⏮️</button>
        <button onClick={() => handleControl("pause")} className="text-3xl">⏸️</button>
        <button onClick={() => handleControl("play")} className="text-3xl">▶️</button>
        <button onClick={() => handleControl("next")} className="text-3xl">⏭️</button>
      </div>
    </div>
  );
}

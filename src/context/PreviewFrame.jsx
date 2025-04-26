import React, { useState } from "react";

export default function PreviewFrame({ src }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-56 rounded-lg overflow-hidden border-2 border-zinc-600">
      {/* Loading Spinner */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-700">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* iframe */}
      <iframe
        src={src}
        className={`w-full h-full transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        frameBorder="0"
        allowFullScreen
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}

import React, { useState } from "react";
import WindCompass from "../instruments/WindCompass";

export default function ExpandableWindButton({ data }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-700 text-white font-bold px-4 py-2 rounded-xl shadow-md text-lg"
      >
        {open ? "Hide Wind Compass" : "Show Wind Compass"}
      </button>

      {open && (
        <div className="mt-4 p-4 bg-white rounded-xl shadow-xl max-w-md mx-auto">
          <WindCompass
            heading={data.heading}
            trueWindDirection={data.trueWindDirection}
            apparentWindDirection={data.apparentWindDirection}
            trueWindSpeed={data.trueWindSpeed}
            apparentWindSpeed={data.apparentWindSpeed}
          />
        </div>
      )}
    </div>
  );
}

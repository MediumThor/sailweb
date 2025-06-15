import React, { useState, useEffect, useRef } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

export default function TouchKeyboard({
  input,
  onInputChange,
  visible = false,
  resetSignal,
  layout = "default",
}) {
  const keyboardRef = useRef(null);

  useEffect(() => {
    if (keyboardRef.current) {
      keyboardRef.current.setInput(input || "");
    }
  }, [resetSignal, input]);

  const handleKeyPress = (button) => {
    if (layout === "raceTime") {
      if (/^[0-9:]$/.test(button)) {
        onInputChange((prev) => prev + button);
      } else if (button === "{bksp}") {
        onInputChange((prev) => prev.slice(0, -1));
      }
    } else {
      if (button === "{bksp}") {
        onInputChange((prev) => prev.slice(0, -1));
      } else if (button !== "{space}") {
        onInputChange((prev) => prev + button);
      } else {
        onInputChange((prev) => prev + " ");
      }
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full flex flex-col items-center z-[99999] animate-slide-up overflow-hidden">
      <div className="bg-gray-300 bg-opacity-20 p-6 rounded-t-3xl w-full max-w-6xl shadow-2xl flex flex-col justify-center">
        <Keyboard
          keyboardRef={(r) => (keyboardRef.current = r)}
          input={input}
          onChange={onInputChange}
          onKeyPress={handleKeyPress}
          layoutName={layout}
          layout={{
            default: [
              "Q W E R T Y U I O P",
              "A S D F G H J K L",
              "Z X C V B N M",
              "{space} {bksp}",
            ],
            numbers: [
              "1 2 3",
              "4 5 6",
              "7 8 9",
              "- 0 .",
              "{bksp}",
            ],
            raceTime: [
              "1 2 3",
              "4 5 6",
              "7 8 9",
              ": 0 {bksp}",
            ],
          }}
          display={{
            "{bksp}": "⌫",
            "{space}": "space",
          }}
          theme="hg-theme-default custom-keyboard"
        />
      </div>

      {/* Hide shift/number buttons if in locked layout */}
      {layout !== "raceTime" && (
        <div className="flex gap-4 p-4">
          {/* layout toggles could go here if needed */}
        </div>
      )}

      <style jsx global>{`
        @keyframes slide-up {
          0% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.15s ease-out forwards;
        }

        html, body {
          overflow-x: hidden;
        }

        .custom-keyboard .hg-button {
          background: rgb(50, 102, 154);
          color: #000;
          font-size: 3.5rem;
          padding: 1.8rem;
          min-width: 80px;
          min-height: 80px;
          border: 3px solid #ccc;
          border-radius: 12px;
          margin: 6px;
        }

        .custom-keyboard .hg-button:hover {
          background: #ffe082;
        }

        .custom-keyboard {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

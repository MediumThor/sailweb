import React, { useState, useEffect, useRef } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

export default function WifiKeyboard({
  input,
  onInputChange,
  visible = false,
  resetSignal,
}) {
  const keyboardRef = useRef(null);
  const [layout, setLayout] = useState("default");
  const [shiftActive, setShiftActive] = useState(false);

  useEffect(() => {
    if (keyboardRef.current) {
      keyboardRef.current.setInput(input || "");
    }
  }, [resetSignal, input]);

  const toggleShift = () => {
    setShiftActive(!shiftActive);
    setLayout(shiftActive ? "default" : "shift");
  };

  const toggleNumbers = () => {
    setLayout(layout === "numbers" ? "default" : "numbers");
  };

  return (
    <div
      className={`fixed bottom-0 left-0 w-full flex flex-col items-center z-[99999] transform transition-transform duration-500 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-gray-300 bg-opacity-50 p-6 rounded-t-3xl w-full max-w-7xl shadow-2xl flex flex-col justify-center">
        {/* 📝 bg-gray-300 + bg-opacity-50 makes it semi-transparent */}
        <Keyboard
          keyboardRef={(r) => (keyboardRef.current = r)}
          input={input}
          onChange={onInputChange}
          onKeyPress={(button) => {
            if (button === "{bksp}") {
              onInputChange((prev) => prev.slice(0, -1));
            } else if (button !== "{space}") {
              onInputChange((prev) => prev + button);
            } else {
              onInputChange((prev) => prev + " ");
            }
          }}
          layoutName={layout}
          layout={{
            default: [
              "q w e r t y u i o p",
              "a s d f g h j k l",
              "z x c v b n m",
              "{space} {bksp}",
            ],
            shift: [
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
          }}
          display={{
            "{bksp}": "⌫",
            "{space}": "space",
          }}
          theme="hg-theme-default custom-keyboard"
        />
      </div>

      <div className="flex gap-4 p-4">
        <button
          onClick={toggleShift}
          className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 text-2xl rounded-lg"
        >
          {shiftActive ? "abc" : "SHIFT"}
        </button>
        <button
          onClick={toggleNumbers}
          className="bg-green-500 hover:bg-green-600 text-white py-4 px-6 text-2xl rounded-lg"
        >
          {layout === "numbers" ? "ABC" : "123"}
        </button>
      </div>

      <style jsx global>{`
        .custom-keyboard .hg-button {
          background: rgb(50, 102, 154);
          color: #000;
          font-size: 5rem;
          padding: 2.5rem;
          min-width: 100px;
          min-height: 100px;
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

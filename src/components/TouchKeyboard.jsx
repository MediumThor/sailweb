import React, { useEffect, useRef } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

export default function TouchKeyboard({ input, onInputChange, layout = "default", visible = false, resetSignal }) {
  const keyboardRef = useRef(null);

  useEffect(() => {
    if (keyboardRef.current) {
      keyboardRef.current.setInput(input || "");
    }
  }, [resetSignal, input]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center z-[99999]">
      {/* ➡️ Background container */}
      <div className="bg-zinc-300 p-6 rounded-t-3xl w-[100%] max-w-4xl shadow-2xl h-[300px] flex flex-col justify-center">
        
        <Keyboard
          keyboardRef={(r) => (keyboardRef.current = r)}
          input={input}
          onChange={onInputChange}
          layoutName={layout}
          layout={{
            default: [
              "q w e r t y u i o p",
              "a s d f g h j k l",
              "z x c v b n m",
              "{space} {bksp}"
            ],
            numbers: [
              "1 2 3",
              "4 5 6",
              "7 8 9",
              "- 0 . {bksp}"   // ⬅️ Add '-' key
            ]
          }}
          display={{
            "{bksp}": "⌫",
            "{space}": "␣"
          }}
          theme="hg-theme-default custom-keyboard"
        />
      </div>

      {/* Styles */}
      <style jsx global>{`
        .custom-keyboard .hg-button {
          background: #f8f9fa;
          color: #000;
          font-size: 2.2rem;
          padding: 1rem;
          border: 2px solid #ccc;
          border-radius: 8px;
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

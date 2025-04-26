import { createContext, useContext, useState } from "react";

const KeyboardContext = createContext();

export function useKeyboard() {
  return useContext(KeyboardContext);
}

export function KeyboardProvider({ children }) {
  const [activeField, setActiveField] = useState(null);
  const [inputValue, setInputValue] = useState("");

  return (
    <KeyboardContext.Provider
      value={{ activeField, setActiveField, inputValue, setInputValue }}
    >
      {children}
    </KeyboardContext.Provider>
  );
}

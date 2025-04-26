import React, { useState, useEffect } from "react";
import { useModal } from "../context/ModalContext";

export default function WindowModal({ name, children, url }) {
  const { modalType, closeModal } = useModal();
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const isOpen = modalType === name;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 10); // Animation delay
    } else {
      setVisible(false);
      setLoaded(false); // Reset loaded state when modal is closed
    }
  }, [isOpen]);

  const handleBackgroundClick = (e) => {
    // Close the modal only if the backdrop (outside of the modal) is clicked
    if (e.target.id === "modal-backdrop") {
      closeModal();
    }
  };

  const handleIframeLoad = () => {
    setLoaded(true); // Mark iframe as loaded
  };

  if (!isOpen) return null;

  return (
    <div
      id="modal-backdrop"
      onClick={handleBackgroundClick}
      className="fixed inset-0 z-[10000] bg-black bg-opacity-80 flex items-center justify-center"
    >
      {/* Modal card */}
      <div
        className={`relative bg-zinc-800 text-white rounded-xl w-[90vw] h-[90vh] p-4 overflow-hidden transition-all duration-500 ease-in-out transform ${
          visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-6 opacity-0 scale-95"
        }`}
      >
        {/* Loading Spinner */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Content */}
        <div className="w-full h-full flex items-center justify-center">
          <div
            className={`w-full h-full transition-all duration-500 ease-in-out transform ${
              loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                  onLoad: handleIframeLoad,  // Trigger when iframe finishes loading
                  src: url, // Dynamically set iframe URL
                });
              }
              return child;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

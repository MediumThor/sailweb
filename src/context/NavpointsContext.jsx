import React, { createContext, useContext, useState, useEffect } from "react";

const NavpointsContext = createContext();

export const useNavpoints = () => useContext(NavpointsContext);

export function NavpointsProvider({ children }) {
  const [navpoints, setNavpoints] = useState(() => {
    const saved = localStorage.getItem("navpoints");
    return saved ? JSON.parse(saved) : [];
  });

  const [destination, setDestination] = useState(() => {
    const saved = localStorage.getItem("destination");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem("navpoints", JSON.stringify(navpoints));
  }, [navpoints]);

  useEffect(() => {
    localStorage.setItem("destination", JSON.stringify(destination));
  }, [destination]);

  const addNavpoint = (name, lat, lon) => {
    setNavpoints([...navpoints, { name, lat, lon }]);
  };

  const removeNavpoint = (index) => {
    setNavpoints(navpoints.filter((_, i) => i !== index));
  };

  const setDestinationToNavpoint = (navpoint) => {
    setDestination(navpoint);
  };

  return (
    <NavpointsContext.Provider value={{
      navpoints, addNavpoint, removeNavpoint,
      destination, setDestinationToNavpoint
    }}>
      {children}
    </NavpointsContext.Provider>
  );
}

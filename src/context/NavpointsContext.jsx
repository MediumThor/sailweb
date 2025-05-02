import React, { createContext, useContext, useState, useEffect } from "react";

const NavpointsContext = createContext();
export const useNavpoints = () => useContext(NavpointsContext);

export function NavpointsProvider({ children }) {
  const [navpoints, setNavpoints] = useState([]);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetchNavpoints(); // initial load

    const interval = setInterval(() => {
      fetchNavpoints(); // auto-refresh
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchNavpoints = async () => {
    try {
      const res = await fetch("http://pi5.local:8091/api/navpoints");
      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("JSON parse error:", e, "Raw response:", text);
        return;
      }

      if (!Array.isArray(data)) {
        console.warn("Expected array, got:", data);
        return;
      }

      const clean = data.filter(
        (p) =>
          typeof p.name === "string" &&
          typeof p.lat === "number" &&
          typeof p.lon === "number" &&
          !isNaN(p.lat) &&
          !isNaN(p.lon)
      );

      setNavpoints(clean);
    } catch (err) {
      console.error("Navpoint fetch error:", err);
    }
  };

  const addNavpoint = async (name, lat, lon) => {
    try {
      const res = await fetch("http://pi5.local:8091/api/navpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, lat, lon }),
      });

      if (!res.ok) throw new Error("Navpoint add failed");

      await res.json(); // ✅ required to resolve the fetch

      await fetchNavpoints();
    } catch (err) {
      console.error("Add navpoint error:", err);
    }
  };

  const removeNavpoint = async (index) => {
    try {
      await fetch(`http://pi5.local:8091/api/navpoints/${index}`, {
        method: "DELETE",
      });
      await fetchNavpoints();
    } catch (err) {
      console.error("Delete navpoint error:", err);
    }
  };

  const addDestination = (point) => {
    if (
      point &&
      typeof point.lat === "number" &&
      typeof point.lon === "number"
    ) {
      setDestinations((prev) => [...prev, point]);
    }
  };

  const clearDestinations = () => {
    setDestinations([]);
  };

  return (
    <NavpointsContext.Provider
      value={{
        navpoints,
        addNavpoint,
        removeNavpoint,
        destinations,
        addDestination,
        clearDestinations,
        fetchNavpoints,
      }}
    >
      {children}
    </NavpointsContext.Provider>
  );
}

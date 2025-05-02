export async function fetchGPSData() {
    try {
      const res = await fetch("http://localhost:8090/api/gps");
      if (!res.ok) throw new Error("Failed to fetch GPS");
      return await res.json();
    } catch (err) {
      console.error("❌ GPS fetch failed:", err);
      return null;
    }
  }
  
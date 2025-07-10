// pages/api/fleet.js

let fleetData = [];

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const data = req.body;
      if (data && Array.isArray(data.vessels)) {
        fleetData = data.vessels;
        console.log(`✅ Received ${fleetData.length} vessels from SailTrack`);
        return res.status(200).json({ success: true });
      } else {
        console.error("⚠️ Invalid POST payload:", data);
        return res.status(400).json({ error: "Invalid data format" });
      }
    } catch (err) {
      console.error("🚨 Error processing POST /api/fleet:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === 'GET') {
    return res.status(200).json({ vessels: fleetData });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

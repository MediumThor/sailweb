import { calculateBearing } from "../utils/calculateBearing";
import { getCompassOffset } from "../context/DisplaySettingsContext";


let latest = {
  temperature: null,
  humidity: null,
  pressure: null,
  lat: null,
  lon: null,
  alt: null,
  sats: null,
  fix: null,
  speed: null,
  heading: null,
  speedKnots: null,
  headingDeg: 237,
  windAngle: null,
  depthFeet: 28.5,
  trueWindSpeed: null,
  trueWindDirection: null,
  apparentWindDirection: null,
  apparentWindSpeed: null,

  // ➕ HWT901B fields
  heel: null,
  pitch: null,
  compass: 200,

  // ➕ Bearing (will be injected externally)
  bearingToDestination: null,
};

const liveData = {
  set(data) {
    const swapped = { ...data };
  
    // Fix compass reversal (if sensor gives West=90°, East=270°)
    if (swapped.compass != null) {
      swapped.compass = (360 - swapped.compass) % 360;
    }
  
    // Fix accidental heel/pitch swap
    if ('heel' in swapped && 'pitch' in swapped) {
      const temp = swapped.heel;
      swapped.heel = swapped.pitch;
      swapped.pitch = temp;
    }
  // Compass Offset
    if (swapped.compass != null) {
      swapped.compass = (360 - swapped.compass + getCompassOffset()) % 360;
    }
    latest = { ...latest, ...swapped };
  },
  

  
  

  get() {
    return { ...latest };
  },

  getTempF() {
    return latest.temperature;
  },

  getLatLon() {
    return [latest.lat, latest.lon];
  },

  getPressure() {
    return latest.pressure;
  },

  getHumidity() {
    return latest.humidity;
  },

  getHeading() {
    return latest.heading;
  },

  getSpeed() {
    return latest.speedKnots ?? latest.speed;
  },

 getCompassHeading() {
  if (latest.compass == null) return null;
  return (latest.compass + getCompassOffset() + 360) % 360;
},


  getHeel() {
    return latest.heel;
  },

  getPitch() {
    return latest.pitch;
  },

  getBearingToDestination() {
    return latest.bearingToDestination;
  },
};

export default liveData;

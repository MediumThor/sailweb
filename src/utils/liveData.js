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
  speedKnots: 5.7,
  headingDeg: 237,
  windAngle: 42,
  depthFeet: 28.5,
  trueWindDirection: 215,
  trueWindSpeed: 12.3,
  apparentWindDirection: 190,
  apparentWindSpeed: 15.6,
};

const liveData = {
  set(data) {
    latest = { ...latest, ...data };
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
    return latest.speed;
  },
};

export default liveData;

import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, Polyline, Circle, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import liveData from "../utils/liveData";
import { useDisplaySettings } from "../context/DisplaySettingsContext";
import { useNavpoints } from "../context/NavpointsContext";
import { useModal } from "../context/ModalContext";
import AddNavpointModal from "../components/AddNavpointModal";
import SetDestinationModal from "../components/SetDestinationModal";
import { calculateBearing } from "../utils/calculateBearing";
import LaylineModal from "./LaylineModal";
import clsx from "clsx";
import { syncValue } from "../utils/syncStorage";
import { useFleet } from "../context/FleetContext";


// Click handler for adding marker
function ClickPopup({ setClickLatLng, openModal, ignoreNextClick }) {
  useMapEvents({
    click(e) {
      if (ignoreNextClick.current) {
        ignoreNextClick.current = false; // reset it
        return; // skip this click
      }
      const clickedLatLng = e.latlng;
      setClickLatLng(clickedLatLng);
      openModal("addNavpoint", clickedLatLng);
    },
  });
  return null;
}


export default function Charts({ layline, setLayline }) {
  const [geoData, setGeoData] = useState(null);
  const [longPressLatLng, setLongPressLatLng] = useState(null);
  const [clickLatLng, setClickLatLng] = useState(null);
  const mapRef = useRef(null);
  const { autoAdvanceDistance } = useDisplaySettings();
  const { navpoints, destinations, setDestinations, addNavpoint } = useNavpoints();
  const { openModal, closeModal, modalType, modalProps } = useModal();
  const fallbackLatLon = [43.3875, -87.8750]; // Port Washington, WI
  const liveLat = liveData.get().lat;
  const liveLon = liveData.get().lon;
  const isValidCoord = (v) => typeof v === "number" && !isNaN(v);
  
  const lat = isValidCoord(liveLat) ? liveLat : fallbackLatLon[0];
  const lon = isValidCoord(liveLon) ? liveLon : fallbackLatLon[1];
  const center = [lat, lon];
  const currentDestination = destinations.find((d) => isValidCoord(d.lat) && isValidCoord(d.lon));

  const distanceToDestination = currentDestination &&
  isValidCoord(lat) &&
  isValidCoord(lon)
  ? L.latLng(lat, lon).distanceTo(
      L.latLng(currentDestination.lat, currentDestination.lon)
    ) / 1852
  : null;

  
  const { mapSource } = useDisplaySettings();
  const [etaNextMin, setEtaNextMin] = useState(null);
const [etaNextSec, setEtaNextSec] = useState(null);
const [etaFullMin, setEtaFullMin] = useState(null);
const [etaFullSec, setEtaFullSec] = useState(null);

const speedRef = useRef();
const headingRef = useRef();

const [isSpeedPanelExpanded, setIsSpeedPanelExpanded] = useState(false);
const [isHeadingPanelExpanded, setIsHeadingPanelExpanded] = useState(false);

const [speedFocusKey, setSpeedFocusKey] = useState("speed");
const [headingFocusKey, setHeadingFocusKey] = useState("heading");

const [isWindPanelExpanded, setIsWindPanelExpanded] = useState(false);
const [windFocusKey, setWindFocusKey] = useState("true");
const ignoreNextClick = useRef(false);

const windRef = useRef();
const compass = liveData.getCompassHeading();
const { fleet, getVesselColor } = useFleet();

console.log("Fleet array length:", fleet.length);


{/* FLEET ICON SETTINGS */}

const fleetIcon = (color) =>
L.divIcon({
className: "fleet-marker",
html: `
<div style="
  width: 26px;
  height: 26px;
  background: ${color};
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(0,0,0,0.5);
  animation: pulse 1s infinite;
"></div>
<style>
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }
</style>
`,
iconSize: [16, 16],
iconAnchor: [8, 8],
});

  
const {
  showBathyShallow,
  showBathyDeep,
  showAutoAdvanceRadius,  // ✅ Add this
  showWindPanel,
  showGpsMarker,
  showNavpoints,
} = useDisplaySettings();

  const tileBase =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8085"
    : `http://${window.location.hostname}:8085`;


    function MapZoomControls({ ignoreNextClick }) {
      const map = useMap();
      return (
        <div className="absolute top-4 right-4 flex flex-col space-y-4 z-[1000]">
          <button
            onMouseDown={() => ignoreNextClick.current = true}
            onClick={() => map.zoomIn()}
            className="manual-zoom-button bg-zinc-800 bg-opacity-80 hover:bg-zinc-700 text-white px-6 py-4 rounded-xl text-3xl font-bold shadow-lg active:scale-95 transition"
          >
            +
          </button>
          <button
            onMouseDown={() => ignoreNextClick.current = true}
            onClick={() => map.zoomOut()}
            className="manual-zoom-button bg-zinc-800 bg-opacity-80 hover:bg-zinc-700 text-white px-6 py-4 rounded-xl text-3xl font-bold shadow-lg active:scale-95 transition"
          >
            −
          </button>
        </div>
      );
    }

  useEffect(() => {
    const interval = setInterval(() => {
      const speed = liveData.getSpeed();
      if (speed > 0 && isValidCoord(lat) && isValidCoord(lon)) {
        if (currentDestination) {
          const distNM = L.latLng(lat, lon).distanceTo(L.latLng(currentDestination.lat, currentDestination.lon)) / 1852;
          const totalSecNext = Math.round((distNM / speed) * 3600);
          setEtaNextMin(formatEta(totalSecNext));
        }
  
        if (destinations.length > 0) {
          const distNM = calculateTotalTripDistance(lat, lon, destinations);
          const totalSecFull = Math.round((distNM / speed) * 3600);
          setEtaFullMin(formatEta(totalSecFull));
        }
      } else {
        setEtaNextMin(null);
        setEtaFullMin(null);
      }
    }, 1000);
  
    return () => clearInterval(interval);
  }, [lat, lon, currentDestination, destinations]);
  


  const tempMarkerIcon = L.icon({
    iconUrl: "icons/location-pin.png", // Replace with your boat icon URL
    iconSize: [32, 32], // Adjust the size to fit the image
    iconAnchor: [16, 32], // Anchor point of the icon (typically bottom center)
    popupAnchor: [0, -32], // Position the popup above the marker
  });

  

  useEffect(() => {
    fetch("/data/soundings.geojson")
      .then(res => res.json())
      .then(data => setGeoData(data));
  }, []);



  const hasAdvancedRef = useRef(false);

  useEffect(() => {
    const firstWaypoint = destinations[0];
    if (
      firstWaypoint &&
      isValidCoord(lat) &&
      isValidCoord(lon) &&
      isValidCoord(firstWaypoint.lat) &&
      isValidCoord(firstWaypoint.lon)
    ) {
      const distanceMeters = L.latLng(lat, lon).distanceTo(
        L.latLng(firstWaypoint.lat, firstWaypoint.lon)
      );
      if (distanceMeters < autoAdvanceDistance && !hasAdvancedRef.current) {
        hasAdvancedRef.current = true;
        advanceToNextWaypoint();
        setTimeout(() => {
          hasAdvancedRef.current = false;
        }, 5000);
      }
    }
  }, [lat, lon, destinations, autoAdvanceDistance]);


  useEffect(() => {
    if (
      currentDestination &&
      isValidCoord(lat) &&
      isValidCoord(lon) &&
      isValidCoord(currentDestination.lat) &&
      isValidCoord(currentDestination.lon)
    ) {
      const bearing = calculateBearing(
        lat,
        lon,
        currentDestination.lat,
        currentDestination.lon
      );
      syncValue("bearingToDestination", bearing);  // ✅ this does everything
    } else {
      syncValue("bearingToDestination", null);
    }
  }, [lat, lon, currentDestination]);
  


  function formatEta(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  }

  function calculateTotalTripDistance(currentLat, currentLon, destinations) {
    const valid = destinations.filter(
      (d) => typeof d.lat === "number" && typeof d.lon === "number" && !isNaN(d.lat) && !isNaN(d.lon)
    );
    if (valid.length === 0) return 0;
    let total = 0;
    let prev = L.latLng(currentLat, currentLon);
    for (const dest of valid) {
      const next = L.latLng(dest.lat, dest.lon);
      total += prev.distanceTo(next);
      prev = next;
    }
    return total / 1852; // Convert meters to nautical miles
  }


  function advanceToNextWaypoint() {
    if (destinations.length > 1) {
      const updated = [...destinations.slice(1)];
      setDestinations(updated); // You must have this from useNavpoints context
    } else {
      setDestinations([]); // All done
    }
  }



  function distanceToLineSegment(p, v, w) {
    // p: current position [lat, lon]
    // v and w: layline.from and layline.to as [lat, lon]
    const latLngP = L.latLng(p[0], p[1]);
    const latLngV = L.latLng(v[0], v[1]);
    const latLngW = L.latLng(w[0], w[1]);
  
    const l2 = latLngV.distanceTo(latLngW) ** 2;
    if (l2 === 0) return latLngP.distanceTo(latLngV);
  
    const t = Math.max(0, Math.min(1,
      ((latLngP.lat - latLngV.lat) * (latLngW.lat - latLngV.lat) +
       (latLngP.lng - latLngV.lng) * (latLngW.lng - latLngV.lng)) /
      ((latLngW.lat - latLngV.lat) ** 2 + (latLngW.lng - latLngV.lng) ** 2)
    ));
  
    const projection = L.latLng(
      latLngV.lat + t * (latLngW.lat - latLngV.lat),
      latLngV.lng + t * (latLngW.lng - latLngV.lng)
    );
  
    return latLngP.distanceTo(projection); // in meters
  }



  const legBearing = (
    destinations.length >= 2 &&
    isValidCoord(destinations[0]?.lat) &&
    isValidCoord(destinations[0]?.lon) &&
    isValidCoord(destinations[1]?.lat) &&
    isValidCoord(destinations[1]?.lon)
  )
    ? calculateBearing(
        destinations[0].lat,
        destinations[0].lon,
        destinations[1].lat,
        destinations[1].lon
      ).toFixed(0)
    : null;
  

  

  return (
    <div className="h-full w-full relative overflow-hidden">
      <MapContainer
        center={center}
        zoom={15}
        minZoom={8}
        maxZoom={20}
        scrollWheelZoom
        touchZoom
        zoomControl={false}  // ← disables built-in zoom buttons
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >



{showBathyShallow && (
  <TileLayer
    url="/charts/BathyShallow/{z}/{x}/{y}.png"
    attribution="NOAA Bathymetry Shallow"
    maxZoom={12}
    zIndex={500}
  />
)}

{showBathyDeep && (
  <TileLayer
    url="/charts/BathyDeep/{z}/{x}/{y}.png"
    attribution="NOAA Bathymetry Deep"
    maxZoom={12}
    zIndex={700}  // ensures it's drawn over shallow
  />
)}


<TileLayer
  attribution="NOAA ENC styled with QGIS"
  url={`${tileBase}/tiles/{z}/{x}/{y}.png`}
  maxZoom={18}
/>

{mapSource === "esri" && navigator.onLine && (
  <TileLayer
  url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  attribution="Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics"
  maxZoom={20}
  zIndex={1000}
  updateWhenIdle={false}   // load more eagerly
  keepBuffer={7}            // keep 7 extra rows/columns outside viewport
/>
)}


        {/* ClickHandler Popup: Click to add marker */}
        <ClickPopup setClickLatLng={setClickLatLng} openModal={openModal} ignoreNextClick={ignoreNextClick} />

        {/* Show clicked Lat/Lon marker */}
        {clickLatLng && (
  <Marker
    position={[clickLatLng.lat, clickLatLng.lng]}
    icon={tempMarkerIcon}
  >            <Popup autoClose={false} autoPan={false}>
              <div>
                Lat: {clickLatLng.lat.toFixed(4)}<br />
                Lon: {clickLatLng.lng.toFixed(4)}<br />
                <button
                  className="bg-green-500 text-white p-2 rounded mt-2"
                  onClick={() => openModal("addNavpoint", clickLatLng)}
                >
                  Add as Navpoint
                </button>
              </div>
            </Popup>
          </Marker>
        )}

{fleet.map((vessel, index) => (
  vessel.latitude && vessel.longitude && (
    <Marker
    key={`fleet-${vessel.id}-${vessel.latitude}-${vessel.longitude}`}
    position={[vessel.latitude, vessel.longitude]}
    icon={fleetIcon(getVesselColor(vessel.id))}
  >
    <Popup>
  <strong>{vessel.name}</strong><br />
  Lat: {vessel.latitude.toFixed(5)}<br />
  Lon: {vessel.longitude.toFixed(5)}<br />
  Battery: {vessel.battery ?? "?"} %<br />
  Last seen: {vessel.lastSeen ? new Date(vessel.lastSeen).toLocaleTimeString() : "—"}
</Popup>
  </Marker>
  )
))}

{showAutoAdvanceRadius && isValidCoord(lat) && isValidCoord(lon) && (
  <Circle
    center={[lat, lon]}
    radius={autoAdvanceDistance}
    pathOptions={{
      color: "orange",
      weight: 2,
      opacity: 0.6,
      dashArray: "4 6"
    }}
  />
)}

   

    


        {/* GPS Marker */}
        {showGpsMarker && isValidCoord(lat) && isValidCoord(lon) && (
  <Marker
    position={[lat, lon]}
    icon={L.divIcon({
      className: "boat-marker",
      html: `
        <img
          src="icons/boat.png"
          style="
            width: 54px;
            height: 54px;
            transform: translate(-50%, -50%) rotate(${compass}deg);

            transition: transform 0.2s linear;
            position: absolute;
            top: 50%;
            left: 50%;
          "
        />
      `,
      iconSize: [64, 64],
      iconAnchor: [32, 32],
    })}
  >
    <Popup>{localStorage.getItem("boatName") || "Your Position"}</Popup>
  </Marker>
)}


        {/* Navpoints */}
        {showNavpoints && Array.isArray(navpoints) &&
          navpoints.filter(p => isValidCoord(p.lat) && isValidCoord(p.lon)).map((point, index) => (
            <Marker key={index} position={[point.lat, point.lon]}>
              <Popup>{point.name}<br />{point.lat.toFixed(4)}, {point.lon.toFixed(4)}</Popup>
            </Marker>
        ))}

        {/* Destinations and Polyline */}
        {Array.isArray(destinations) && destinations.length > 0 && (
          <>
            {destinations.filter(d => isValidCoord(d.lat) && isValidCoord(d.lon)).map((dest, i) => (
              <Marker key={`dest-${i}`} position={[dest.lat, dest.lon]}>
                <Popup>{dest.name}</Popup>
              </Marker>
            ))}
            <Polyline
              positions={[
                [lat, lon],
                ...destinations.filter(d => isValidCoord(d.lat) && isValidCoord(d.lon)).map(d => [d.lat, d.lon]),
              ]}
              color="red"
              weight={5}
              dashArray="6,8"
            />
          </>
        )}

{layline.from && layline.to && (
  <Polyline
    positions={[
      [layline.from.lat, layline.from.lon],
      [layline.to.lat, layline.to.lon],
    ]}
    color="blue"
    weight={4}
    dashArray="2,6"
  />
)}

<MapZoomControls ignoreNextClick={ignoreNextClick} />


      </MapContainer>







        {destinations.length > 0 && isValidCoord(lat) && isValidCoord(lon) && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-zinc-800 bg-opacity-60 text-white rounded-full px-8 py-4 text-xl font-semibold shadow-xl z-[1000] text-center space-y-1">
         <div>Total Trip: {calculateTotalTripDistance(lat, lon, destinations).toFixed(2)} nm</div>
         {legBearing !== null && legBearing !== undefined && (
  <div className="text-2xl font-medium text-zinc-300">
    Next Leg: {legBearing}°
  </div>
)}

        </div>
      )}

{layline.from && layline.to && isValidCoord(lat) && isValidCoord(lon) && (
  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-zinc-800 bg-opacity-60 text-white rounded-xl px-6 py-4 text-xl font-semibold shadow-lg z-[1000] text-center">
    <div>Off Layline:</div>
    <div className="text-4xl mt-1 font-bold">
      {(distanceToLineSegment(
        [lat, lon],
        [layline.from.lat, layline.from.lon],
        [layline.to.lat, layline.to.lon]
      ) / 1852).toFixed(2)} nm
    </div>
  </div>
)}


      {/* Modals */}
      {modalType === "addNavpoint" && (
        <AddNavpointModal closeModal={closeModal} lat={clickLatLng?.lat} lon={clickLatLng?.lng} />
      )}
      {modalType === "setDestination" && <SetDestinationModal closeModal={closeModal} />}


    </div>

  );
}

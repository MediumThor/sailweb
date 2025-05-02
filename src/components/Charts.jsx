import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import liveData from "../utils/liveData";
import { useDisplaySettings } from "../context/DisplaySettingsContext";
import { useNavpoints } from "../context/NavpointsContext";
import { useModal } from "../context/ModalContext";
import AddNavpointModal from "../components/AddNavpointModal";
import SetDestinationModal from "../components/SetDestinationModal";
import { calculateBearing } from "../utils/calculateBearing";

function ClickPopup({ setClickLatLng }) {
  useMapEvents({
    click(e) {
      setClickLatLng(e.latlng);
    },
  });
  return null;
}

export default function Charts() {
  const [geoData, setGeoData] = useState(null);
  const [longPressLatLng, setLongPressLatLng] = useState(null);
  const [clickLatLng, setClickLatLng] = useState(null);
  const mapRef = useRef(null);
  const LONG_PRESS_DURATION = 800;

  const { navpoints, destinations } = useNavpoints();
  const { openModal, closeModal, modalType } = useModal();

  const {
    showSpeedPanel,
    showWindPanel,
    showGpsMarker,
    showSoundings,
    showNavpoints,
  } = useDisplaySettings();

  useEffect(() => {
    fetch("/data/soundings.geojson")
      .then(res => res.json())
      .then(data => setGeoData(data));
  }, []);

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}:8081`);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        liveData.set(data);
      } catch (err) {
        console.error("WebSocket parse error:", err);
      }
    };
    return () => ws.close();
  }, []);

  const { lat, lon } = liveData.get();
  const center = [lat, lon];
  const isValidCoord = (v) => typeof v === "number" && !isNaN(v);

  const currentDestination = destinations.find((d) => isValidCoord(d.lat) && isValidCoord(d.lon));
  const distanceToDestination = currentDestination && isValidCoord(lat) && isValidCoord(lon)
    ? L.latLng(lat, lon).distanceTo(L.latLng(currentDestination.lat, currentDestination.lon)) / 1852
    : null;

  const timeToCurrentDestination = distanceToDestination && liveData.getSpeed() > 0
    ? Math.floor((distanceToDestination / liveData.getSpeed()) * 60)
    : null;

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
    return total / 1852;
  }

  function getTimeToDestinationNM(currentLat, currentLon, destinations, speedKnots) {
    const tripDistance = calculateTotalTripDistance(currentLat, currentLon, destinations);
    if (speedKnots <= 0 || isNaN(speedKnots)) return null;
    const hours = tripDistance / speedKnots;
    return Math.floor(hours * 60);
  }

  return (
    <div className="h-full w-full relative overflow-hidden">
      <MapContainer
        center={center}
        zoom={15}
        minZoom={9}
        maxZoom={17}
        scrollWheelZoom
        touchZoom
        zoomControl
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;

          let timeout;
          const startPress = (e) => {
            timeout = setTimeout(() => {
              const latlng = e.latlng || (e.originalEvent && mapInstance.mouseEventToLatLng(e.originalEvent));
              if (latlng) {
                setLongPressLatLng(latlng);
                openModal("addNavpoint");
              }
            }, LONG_PRESS_DURATION);
          };

          const cancelPress = () => timeout && clearTimeout(timeout);

          mapInstance.on("mousedown", startPress);
          mapInstance.on("touchstart", startPress);
          mapInstance.on("mouseup", cancelPress);
          mapInstance.on("touchend", cancelPress);
          mapInstance.on("move", cancelPress);
        }}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution="NOAA ENC styled with QGIS"
          url="http://pi5.local:8082/tiles/{z}/{x}/{y}.png"
        />
        <ClickPopup setClickLatLng={setClickLatLng} />

        {clickLatLng && (
          <Marker position={[clickLatLng.lat, clickLatLng.lng]}>
            <Popup autoClose={false} autoPan={false}>
              Lat: {clickLatLng.lat.toFixed(4)}<br />
              Lon: {clickLatLng.lng.toFixed(4)}
            </Popup>
          </Marker>
        )}

        {showSoundings && geoData && (
          <GeoJSON
            data={geoData}
            pointToLayer={(feature, latlng) =>
              L.circleMarker(latlng, {
                radius: 4,
                fillColor: "#0066cc",
                color: "#fff",
                weight: 1,
                fillOpacity: 0.9,
              })
            }
          />
        )}

        {showGpsMarker && isValidCoord(lat) && isValidCoord(lon) && (
          <Marker position={[lat, lon]}>
            <Popup>{localStorage.getItem("boatName") || "Your Position"}</Popup>
          </Marker>
        )}

        {showNavpoints && Array.isArray(navpoints) &&
          navpoints.filter(p => isValidCoord(p.lat) && isValidCoord(p.lon)).map((point, index) => (
            <Marker key={index} position={[point.lat, point.lon]}>
              <Popup>{point.name}<br />{point.lat.toFixed(4)}, {point.lon.toFixed(4)}</Popup>
            </Marker>
        ))}

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
      </MapContainer>

      {showWindPanel && (
        <div className="absolute bottom-4 left-4 bg-zinc-800 bg-opacity-80 text-white rounded-2xl px-6 py-4 text-lg font-semibold z-[1000] space-y-2">
          <div>
            True Wind: {liveData.get().trueWindDirection}° @ {liveData.get().trueWindSpeed} kn
          </div>
          <div>
            Apparent Wind: {liveData.get().apparentWindDirection}° @ {liveData.get().apparentWindSpeed} kn
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 flex flex-col gap-4 z-[1000]">
        <button
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-full"
          onClick={() => openModal("addNavpoint")}
        >
          ➕ Add Navpoint
        </button>

        {navpoints.length > 0 && (
          <button
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-full"
            onClick={() => openModal("setDestination")}
          >
            Set Destination
          </button>
        )}
      </div>

      {showSpeedPanel && (
        <div className="absolute top-4 right-4 bg-zinc-800 bg-opacity-80 text-white rounded-2xl px-8 py-6 text-2xl font-bold z-[1000] space-y-4">
          <div>{liveData.getSpeed()?.toFixed(1) ?? "--"} kn</div>
          <div>{liveData.getHeading()?.toFixed(0) ?? "--"}°</div>
          <div>{liveData.get().windAngle?.toFixed(0) ?? "--"}° wind</div>
          <div>{liveData.get().depthFeet?.toFixed(1) ?? "--"} ft</div>
        </div>
      )}

      {currentDestination && distanceToDestination != null && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-zinc-800 bg-opacity-60 text-white rounded-full px-14 py-4 shadow-xl z-[1000] text-center space-y-3">
          <div className="flex items-center justify-center gap-6 text-8xl font-bold">
            <div>{calculateBearing(lat, lon, currentDestination.lat, currentDestination.lon).toFixed(0)}°</div>
            <div className="w-10 h-10" style={{
              transform: `rotate(${calculateBearing(lat, lon, currentDestination.lat, currentDestination.lon)}deg)`,
              transition: "transform 0.3s ease",
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                className="w-10 h-10 text-amber-400">
                <path d="M12 2l6 8h-4v8h-4v-8H6l6-8z" />
              </svg>
            </div>
            <div className="text-3xl">{distanceToDestination.toFixed(2)} nm</div>
          </div>
          {timeToCurrentDestination != null && (
            <div className="text-2xl font-medium text-zinc-300">
              ETA: {timeToCurrentDestination} min
            </div>
          )}
        </div>
      )}

      {destinations.length > 0 && isValidCoord(lat) && isValidCoord(lon) && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-zinc-800 bg-opacity-60 text-white rounded-full px-8 py-4 text-xl font-semibold shadow-xl z-[1000] text-center space-y-1">
          <div>Total Trip: {calculateTotalTripDistance(lat, lon, destinations).toFixed(2)} nm</div>
          {liveData.getSpeed() > 0 && (
            <div>
              ETA: {getTimeToDestinationNM(lat, lon, destinations, liveData.getSpeed())} min
            </div>
          )}
        </div>
      )}

      {modalType === "addNavpoint" && (
        <AddNavpointModal closeModal={closeModal} lat={longPressLatLng?.lat} lon={longPressLatLng?.lng} />
      )}
      {modalType === "setDestination" && <SetDestinationModal closeModal={closeModal} />}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import currentLocation from "../utils/currentLocation";
import liveData from "../utils/liveData";
import { useDisplaySettings } from "../context/DisplaySettingsContext";
import { useNavpoints } from "../context/NavpointsContext";
import { useModal } from "../context/ModalContext";
import AddNavpointModal from "../components/AddNavpointModal";
import SetDestinationModal from "../components/SetDestinationModal";
import { calculateBearing } from "../utils/calculateBearing";



export default function Charts() {
  const [geoData, setGeoData] = useState(null);
  const { navpoints, destination, setDestinationToNavpoint } = useNavpoints();
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

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* ➡️ MAP */}
      <MapContainer
        center={[currentLocation.lat, currentLocation.lon]}
        zoom={15}
        minZoom={10}
        maxZoom={19}
        scrollWheelZoom
        touchZoom
        zoomControl
        style={{ height: "100%", width: "100%" }}
        className="z-0" // lower z-index for the map
      >
        {/* ENC Tiles */}
        <TileLayer attribution="NOAA ENC styled with QGIS" url="/charts/lake-michigan/MAPS/PortWashington/{z}/{x}/{y}.png" />
        <TileLayer attribution="NOAA ENC styled with QGIS" url="/charts/lake-michigan/MAPS/PortWashingtonMarina/{z}/{x}/{y}.png" />
        <TileLayer attribution="NOAA ENC styled with QGIS" url="/charts/lake-michigan/PortWashingtonOuter2/{z}/{x}/{y}.png" />

       
        {/* ... */}

        {/* Soundings */}
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

        {/* Your location */}
        {showGpsMarker && (
          <Marker position={[currentLocation.lat, currentLocation.lon]}>
            <Popup>You are here!</Popup>
          </Marker>
        )}

        {/* Navpoints */}
        {showNavpoints && navpoints.map((point, index) => (
          <Marker key={index} position={[point.lat, point.lon]}>
            <Popup>
              {point.name}<br />
              {point.lat.toFixed(4)}, {point.lon.toFixed(4)}
            </Popup>
          </Marker>
        ))}

        {/* Destination */}
        {destination && (
          <>
            <Marker position={[destination.lat, destination.lon]}>
              <Popup>Destination: {destination.name}</Popup>
            </Marker>
            <Polyline
              positions={[
                [currentLocation.lat, currentLocation.lon],
                [destination.lat, destination.lon],
              ]}
              color="lime"
              weight={4}
              dashArray="6,8"
            />
          </>
        )}
      </MapContainer>



      {/* ➡️ UI FLOATING ABOVE THE MAP */}
      {/* Buttons */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-4 z-[1000]">
        <button
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-full"
          onClick={() => openModal("addNavpoint")}
        >
          ➕ Add Navpoint
        </button>
        <button
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-full"
          onClick={() => openModal("setDestination")}
        >
           Set Destination
        </button>
      </div>




      {/* Speed / Wind panels */}
      {showSpeedPanel && (
        <div className="absolute top-4 right-4 bg-zinc-800 bg-opacity-80 text-white rounded-2xl px-8 py-6 text-2xl font-bold z-[1000] space-y-4">
          <div>{liveData.speedKnots.toFixed(1)} kn</div>
          <div>{liveData.headingDeg.toFixed(0)}°</div>
          <div>{liveData.windAngle.toFixed(0)}° wind</div>
          <div>{liveData.depthFeet.toFixed(1)} ft</div>
        </div>
      )}
      {showWindPanel && (
        <div className="absolute bottom-4 left-4 bg-zinc-800 bg-opacity-80 text-white rounded-2xl px-6 py-4 text-lg font-semibold z-[1000] space-y-2">
          <div>True Wind: {liveData.trueWindDirection.toFixed(0)}° @ {liveData.trueWindSpeed.toFixed(1)} kn</div>
          <div>Apparent Wind: {liveData.apparentWindDirection.toFixed(0)}° @ {liveData.apparentWindSpeed.toFixed(1)} kn</div>
        </div>
      )}




      {/* Show Bearing */}

{destination && (
  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-zinc-800 bg-opacity-80 text-white rounded-full px-14 py-4 text-8xl font-bold shadow-xl z-[1000] flex items-center gap-4">
    <div>
      {calculateBearing(currentLocation.lat, currentLocation.lon, destination.lat, destination.lon).toFixed(0)}°
    </div>
    <div
      className="w-10 h-10"
      style={{
        transform: `rotate(${calculateBearing(currentLocation.lat, currentLocation.lon, destination.lat, destination.lon)}deg)`,
        transition: "transform 0.3s ease",
      }}
    >
    <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
  viewBox="0 0 24 24"
  className="w-10 h-10 text-amber-400"
>
  <path d="M12 2l6 8h-4v8h-4v-8H6l6-8z" />
</svg>

    </div>
  </div>
)}


      {/* ➡️ MODALS */}
      {modalType === "addNavpoint" && <AddNavpointModal closeModal={closeModal} />}
      {modalType === "setDestination" && <SetDestinationModal closeModal={closeModal} />}

     
    </div>
  );
}

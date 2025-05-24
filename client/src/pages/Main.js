import React, { useState } from "react";
import { MapContainer, TileLayer, Polygon, Marker, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default icon paths
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ClickHandler = ({ addPoint }) => {
  useMapEvent("click", (e) => {
    addPoint([e.latlng.lat, e.latlng.lng]);
  });
  return null;
};

const DrawPolygon = () => {
  const [positions, setPositions] = useState([]);

  const addPoint = (point) => {
    setPositions((prev) => [...prev, point]);
  };

  return (
    <MapContainer
      center={[51.105, 71.4272]}
      zoom={12}
      style={{ height: "1000px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler addPoint={addPoint} />
      {positions.length > 0 && <Polygon positions={positions} />}
      {positions.map((pos, idx) => (
        <Marker key={idx} position={pos} />
      ))}
    </MapContainer>
  );
};

export default DrawPolygon;

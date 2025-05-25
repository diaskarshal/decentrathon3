import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Исправление путей иконок leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DroneTrackerMap = () => {
  const [drones, setDrones] = useState({}); // drone_id: [lat, lng]
  const socketRef = useRef(null);

  useEffect(() => {
    // Подключение к WebSocket серверу
    socketRef.current = new WebSocket("ws://localhost:5001/ws/track");

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { drone_id, lat, lng } = data;

        if (drone_id && lat && lng) {
          setDrones((prev) => ({
            ...prev,
            [drone_id]: [lat, lng],
          }));
        }
      } catch (error) {
        console.error("Ошибка при обработке сообщения WS:", error);
      }
    };

    socketRef.current.onerror = (err) => {
      console.error("WebSocket Error:", err);
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  return (
    <MapContainer
      center={[51.13, 71.42]}
      zoom={12}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {Object.entries(drones).map(([droneId, position]) => (
        <Marker key={droneId} position={position}>
          <Popup>
            <strong>Drone ID:</strong> {droneId}
            <br />
            <strong>Lat:</strong> {position[0].toFixed(5)}
            <br />
            <strong>Lng:</strong> {position[1].toFixed(5)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DroneTrackerMap;
 
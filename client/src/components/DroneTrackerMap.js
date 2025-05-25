import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getAllNoFlyZones } from "../http/noFlyZoneAPI";

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
  const [drones, setDrones] = useState({});
  const [noFlyZones, setNoFlyZones] = useState([]);
  const [loadingNFZs, setLoadingNFZs] = useState(true);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchNFZs = async () => {
      try {
        setLoadingNFZs(true);
        const nfzData = await getAllNoFlyZones();
        setNoFlyZones(nfzData || []);
      } catch (error) {
        console.error("Failed to fetch No-Fly Zones:", error);
        setNoFlyZones([]);
      } finally {
        setLoadingNFZs(false);
      }
    };
    fetchNFZs();
  }, []);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:5001/ws/track");

    socketRef.current.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        if (messageData.type === "drone_position" && messageData.data) {
          const { droneId, lat, lng } = messageData.data;
          if (droneId && typeof lat === "number" && typeof lng === "number") {
            setDrones((prevDrones) => ({
              ...prevDrones,
              [droneId]: [lat, lng],
            }));
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    socketRef.current.onerror = (err) => {
      console.error("WebSocket Error:", err);
    };

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established for drone tracking.");
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed for drone tracking.");
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const getNFZCoordinates = (nfz) => {
    if (nfz.geojson && nfz.geojson.geometry && nfz.geojson.geometry.coordinates) {
      if (nfz.geojson.geometry.type === "Polygon") {
        return nfz.geojson.geometry.coordinates[0].map((coord) => [
          coord[1],
          coord[0],
        ]);
      }
    } else if (nfz.zone_data && nfz.zone_data.coordinates) {
      return nfz.zone_data.coordinates;
    }
    return [];
  };

  return (
    <MapContainer
      center={[51.13, 71.42]} //Astana coordinates
      zoom={12}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render Drones (hard-coded ts)*/}
      {Object.entries(drones).map(([droneId, position]) => (
        <Marker key={`drone-${droneId}`} position={position}>
          <Popup>
            <div>
              <strong>Drone ID:</strong> {droneId}
              <br />
              <strong>Coordinates:</strong> {position[0]?.toFixed(5)}, {position[1]?.toFixed(5)}
              <br />
              <strong>Status:</strong> Active
              <br />
              <strong>Altitude:</strong> 100m
              <br />
              <strong>Speed:</strong> 100 km/h
              <br />
              <strong>Last Update:</strong> {new Date().toLocaleTimeString()}
            </div>
          </Popup>

        </Marker>
      ))}

      {/* Render NFZ*/}
      {!loadingNFZs &&
        noFlyZones.map((nfz) => {
          const coordinates = getNFZCoordinates(nfz);
          if (coordinates.length === 0) {
            console.warn("NFZ with invalid coordinates:", nfz);
            return null;
          }
          return (
            <Polygon
              key={`nfz-${nfz.id}`}
              pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.3 }} // Style for NFZs
              positions={coordinates}
            >
              <Popup>
                <strong>No-Fly Zone</strong>
                <br />
                ID: {nfz.id}
                <br />
                Description: {nfz.description || "N/A"}
                {nfz.geojson?.properties?.description && nfz.description !== nfz.geojson.properties.description && (
                  <>
                    <br />
                    GeoJSON Desc: {nfz.geojson.properties.description}
                  </>
                )}
              </Popup>
            </Polygon>
          );
        })}
    </MapContainer>
  );
};

export default DroneTrackerMap;

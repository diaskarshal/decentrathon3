'use client';
import React from 'react';
import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import { useMap } from 'react-leaflet/hooks';
import 'leaflet/dist/leaflet.css';

const CenterMap = () => {
  const map = useMap();
  map.setView([51.1155, 71.4572], 12); // Example: center the map manually
  return null;
};

const MapView = () => {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; OpenStreetMap contributors'
        />
        <CenterMap />
      </MapContainer>
    </div>
  );
};

export default MapView;

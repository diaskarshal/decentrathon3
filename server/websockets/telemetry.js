const WebSocket = require('ws');
const NodeCache = require("node-cache");
const turf = require('@turf/turf');
const { Flight } = require("../models/models");

const cache = new NodeCache({ stdTTL: 60 });

function isDroneInsideZone([lng, lat], zoneType, zoneData) {
  const point = turf.point([lng, lat]);

  if (zoneType === "polygon") {
    const polygon = turf.polygon([zoneData.coordinates]);
    return turf.booleanPointInPolygon(point, polygon);
  } else if (zoneType === "circle") {
    const center = turf.point(zoneData.center);
    const distance = turf.distance(center, point, { units: 'meters' });
    return distance <= zoneData.radius;
  } else {
    return false;
  }
}

async function handleTelemetry(data) {
  const droneId = data.drone_id;
  const coords = [data.lng, data.lat]; 

  cache.set(`drone:${droneId}`, { lat: data.lat, lng: data.lng });

  const flight = await Flight.findOne({ where: { drone_id: droneId, status: 'active' } });
  if (!flight || !flight.zoneType || !flight.zoneData) {
    console.warn(`No active flight or zone config for drone ${droneId}`);
    return;
  }

  const inside = isDroneInsideZone(coords, flight.zoneType, flight.zoneData);
  if (!inside) {
    console.warn(`Drone ${droneId} exited the allowed zone`);
  }
}

function initWebSocketTelemetry(server) {
    const wss = new WebSocket.Server({ server });
  
    wss.on('connection', (ws, req) => {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const droneId = url.searchParams.get('drone_id');
  
      if (!droneId) {
        ws.close(1008, 'Missing drone_id');
        return;
      }
  
      ws.droneId = droneId;
      console.log(`WebSocket connected for drone ${droneId}`);
  
      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message);
          data.drone_id = droneId;
          await handleTelemetry(data);
          ws.send(JSON.stringify({ status: 'ok' }));
        } catch (err) {
          console.error('Error processing message:', err);
          ws.send(JSON.stringify({ status: 'error', message: err.message }));
        }
      });
  
      ws.on('close', () => {
        console.log(`Drone ${droneId} disconnected`);
      });
    });
  
    return wss;
  }
  
module.exports = { initWebSocketTelemetry };
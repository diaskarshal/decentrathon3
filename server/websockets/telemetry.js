const WebSocket = require("ws");
const NodeCache = require("node-cache");
const turf = require("@turf/turf");
const { Flight, Notification } = require("../models/models");

const cache = new NodeCache({ stdTTL: 60 });

// Все клиенты-юзеры
const trackingClients = new Set();

function isDroneInsideZone([lng, lat], zoneData) {
  const point = turf.point([lng, lat]);
  const polygon = turf.polygon([zoneData.coordinates]);
  return turf.booleanPointInPolygon(point, polygon);
}

async function handleTelemetry(data, droneId) {
  const coords = [data.lng, data.lat];
  const payload = { droneId, lat: data.lat, lng: data.lng };

  cache.set(`drone:${droneId}`, payload);

  // Проверка выхода за зону
  const flight = await Flight.findOne({ where: { drone_id: droneId, status: "active" } });
  if (flight && flight.zoneData) {
    const inside = isDroneInsideZone(coords, flight.zoneData);
    if (!inside) {
      console.warn(`🚨 Drone ${droneId} exited allowed zone`);
      Notification.create({
        user_id: flight.pilot_id,
        message: `Drone ${droneId} exited allowed zone`,
        type: "warning",
      })
    }
  }

  // Рассылаем всем клиентам
  broadcastToClients(payload);
}

function broadcastToClients(data) {
  const message = JSON.stringify({ type: "drone_position", data });

  for (const client of trackingClients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

function initWebSocketTelemetry(server) {
  const wss = new WebSocket.Server({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname.startsWith("/ws/telemetry/")) {
      const droneId = url.pathname.split("/").pop();

      wss.handleUpgrade(req, socket, head, (ws) => {
        ws.droneId = droneId;
        wss.emit("connection", ws, req);
      });
    }

    if (url.pathname === "/ws/track") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        ws.isTrackingClient = true;
        wss.emit("connection", ws, req);
      });
    }
  });

  wss.on("connection", (ws, req) => {
    if (ws.isTrackingClient) {
      console.log("📡 Tracking client connected");
      trackingClients.add(ws);

      ws.on("close", () => {
        trackingClients.delete(ws);
      });
    } else {
      const droneId = ws.droneId;
      console.log(`🛸 Drone connected: ${droneId}`);

      ws.on("message", async (message) => {
        try {
          const data = JSON.parse(message);
          await handleTelemetry(data, droneId);
          ws.send(JSON.stringify({ status: "ok" }));
        } catch (err) {
          console.error("Error handling telemetry:", err);
          ws.send(JSON.stringify({ status: "error", message: err.message }));
        }
      });

      ws.on("close", () => {
        console.log(`🛑 Drone ${droneId} disconnected`);
      });
    }
  });
}

module.exports = { initWebSocketTelemetry };

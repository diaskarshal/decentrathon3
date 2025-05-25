const WebSocket = require('ws');

class DroneSimulator {
  constructor(droneId, flightRoute) {
    this.droneId = droneId;
    this.route = flightRoute || [];
    this.currentIndex = 0;
    this.ws = null;
    this.interval = null;
  }

  connect() {
    try {
      this.ws = new WebSocket(`ws://localhost:${process.env.PORT || 5001}/ws/telemetry/${this.droneId}`);
      
      this.ws.on('open', () => {
        console.log(`Drone ${this.droneId} simulator connected`);
        this.startSending();
      });

      this.ws.on('error', (error) => {
        console.error(`Drone ${this.droneId} connection error:`, error);
      });

      this.ws.on('close', () => {
        console.log(`🛑 Drone ${this.droneId} simulator disconnected`);
        this.stopSending();
      });
    } catch (error) {
      console.error('Failed to connect drone simulator:', error);
    }
  }

  startSending() {
    if (this.route.length === 0) {
      this.route = [
        [51.1694, 71.4491], //Astana center
        [51.1804, 71.4391],
        [51.1894, 71.4491],
        [51.1804, 71.4591],
        [51.1694, 71.4491]
      ];
    }

    this.interval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const position = this.getNextPosition();
        this.ws.send(JSON.stringify({
          lat: position[0],
          lng: position[1],
          altitude: 100,
          speed: 15,
          timestamp: new Date().toISOString()
        }));
      }
    }, 2000);
  }

  getNextPosition() {
    const position = this.route[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.route.length;
    return position;
  }

  stopSending() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  disconnect() {
    this.stopSending();
    if (this.ws) {
      this.ws.close();
    }
  }
}

module.exports = DroneSimulator;

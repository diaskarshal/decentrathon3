// import React, { useState, useEffect, useRef } from "react";
import React, { useState, useEffect } from "react";
import {
  Offcanvas,
  Button,
  Form,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { MapContainer, TileLayer, Polygon, Marker, useMapEvent } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createFlight } from "../http/flightAPI";
import { getMyDrones } from "../http/droneAPI";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ClickHandler = ({ isDrawing, onAddPoint }) => {
  useMapEvent("click", (e) => {
    if (isDrawing) {
      onAddPoint([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
};

const RequestFlight = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    drone_id: "",
    min_altitude: "",
    max_altitude: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    purpose: "",
    rtmp_url: "",
  });

  const [isDrawing, setIsDrawing] = useState(false);
  const [zonePoints, setZonePoints] = useState([]);
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (show) {
      fetchDrones();
    }
  }, [show]);

  useEffect(() => {
    if (zonePoints.length >= 3) {
      setFormData((prev) => ({
        ...prev,
        route: zonePoints,
      }));
    }
  }, [zonePoints]);

  const fetchDrones = async () => {
    try {
      const dronesData = await getMyDrones();
      setDrones(dronesData);
    } catch (error) {
      setError("Failed to load drones");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (!formData.drone_id || zonePoints.length < 3) {
        setError("Please select a drone and draw a flight zone");
        return;
      }

      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
      const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);

      const flightData = {
        drone_id: parseInt(formData.drone_id),
        pilot_id: JSON.parse(localStorage.getItem("token") ? 
          JSON.parse(atob(localStorage.getItem("token").split('.')[1])).id : null),
        route: zonePoints,
        rtmp_url: formData.rtmp_url || null,
        altitude: parseFloat(formData.max_altitude),
        purpose: formData.purpose,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
      };

      await createFlight(flightData);
      setSuccess("Flight request submitted successfully!");
      
      setFormData({
        drone_id: "",
        min_altitude: "",
        max_altitude: "",
        start_date: "",
        start_time: "",
        end_date: "",
        end_time: "",
        purpose: "",
        rtmp_url: "",
      });
      setZonePoints([]);
      
      setTimeout(() => {
        handleClose();
        setSuccess("");
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit flight request");
    } finally {
      setLoading(false);
    }
  };

  const handleStartDrawing = () => {
    setZonePoints([]);
    setIsDrawing(true);
  };

  const handleAddPoint = (point) => {
    setZonePoints((prev) => [...prev, point]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <Offcanvas 
      show={show} 
      onHide={handleClose} 
      placement="start" 
      backdrop={false} 
      className="bg-dark text-white" 
      style={{ width: "500px" }}
    >
      <Offcanvas.Header closeButton closeVariant="white">
        <Offcanvas.Title>Flight request</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Select Drone</Form.Label>
            <Form.Select
              name="drone_id"
              value={formData.drone_id}
              onChange={handleChange}
            >
              <option value="">Choose a drone...</option>
              {drones.map((drone) => (
                <option key={drone.id} value={drone.id}>
                  {drone.name} ({drone.model})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Row className="mb-3">
            <Col>
              <Form.Label>Min Altitude (m)</Form.Label>
              <Form.Control
                type="number"
                name="min_altitude"
                value={formData.min_altitude}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Form.Label>Max Altitude (m)</Form.Label>
              <Form.Control
                type="number"
                name="max_altitude"
                value={formData.max_altitude}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Purpose</Form.Label>
            <Form.Control
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Flight Zone ({zonePoints.length} points)</Form.Label>
            <div className="d-flex gap-2 mb-2">
              <Button 
                variant="outline-light" 
                size="sm"
                onClick={handleStartDrawing}
                disabled={isDrawing}
              >
                {isDrawing ? "Drawing..." : "Draw Zone"}
              </Button>
              {isDrawing && (
                <Button variant="outline-warning" size="sm" onClick={stopDrawing}>
                  Stop Drawing
                </Button>
              )}
              {zonePoints.length > 0 && (
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => setZonePoints([])}
                >
                  Clear
                </Button>
              )}
            </div>
          </Form.Group>

          <div className="d-flex gap-2 mb-3">
            <Button 
              variant="success" 
              onClick={handleSubmit} 
              disabled={loading || !formData.drone_id || zonePoints.length < 3}
            >
              {loading ? "Submitting..." : "Send Request"}
            </Button>
          </div>
        </Form>

        {(isDrawing || zonePoints.length > 0) && (
          <div style={{ marginTop: "20px", border: "1px solid #444" }}>
            <MapContainer
              center={[51.13, 71.42]}
              zoom={12}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ClickHandler isDrawing={isDrawing} onAddPoint={handleAddPoint} />
              {zonePoints.length > 2 && <Polygon positions={zonePoints} />}
              {zonePoints.map((pos, idx) => (
                <Marker key={idx} position={pos} />
              ))}
            </MapContainer>
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default RequestFlight;

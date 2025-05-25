import React, { useState, useEffect, useRef } from "react";
import {
  Offcanvas,
  Button,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { MapContainer, TileLayer, Polygon, Marker, useMapEvent } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon paths for Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to handle drawing clicks
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
    zone_data: "",
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

  useEffect(() => {
    if (zonePoints.length >= 3) {
      setFormData((prev) => ({
        ...prev,
        zone_data: JSON.stringify(zonePoints),
      }));
    }
  }, [zonePoints]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    console.log("Flight submitted:", formData);
    // TODO: send to backend
    handleClose();
  };

  const handleStartDrawing = () => {
    setZonePoints([]);
    setIsDrawing(true);
  };

  const handleAddPoint = (point) => {
    setZonePoints((prev) => [...prev, point]);
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="start" backdrop={false} className="bg-dark text-white" style={{ width: "500px" }}>
      <Offcanvas.Header closeButton closeVariant="white">
        <Offcanvas.Title>Запрос на полёт</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Drone ID</Form.Label>
            <Form.Control
              type="text"
              name="drone_id"
              value={formData.drone_id}
              onChange={handleChange}
            />
          </Form.Group>

          <Row className="mb-3">
            <Col>
              <Form.Label>Min Altitude</Form.Label>
              <Form.Control
                type="number"
                name="min_altitude"
                value={formData.min_altitude}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Form.Label>Max Altitude</Form.Label>
              <Form.Control
                type="number"
                name="max_altitude"
                value={formData.max_altitude}
                onChange={handleChange}
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
              />
            </Col>
            <Col>
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
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
              />
            </Col>
            <Col>
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Цель</Form.Label>
            <Form.Control
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>RTMP URL</Form.Label>
            <Form.Control
              type="text"
              name="rtmp_url"
              value={formData.rtmp_url}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Зона (координаты)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.zone_data}
              readOnly
              style={{ fontSize: "0.85em", backgroundColor: "#222", color: "#ccc" }}
            />
          </Form.Group>

          <Button variant="outline-light" className="mb-3" onClick={handleStartDrawing}>
            Выбрать зону на карте
          </Button>

          <Button variant="success" onClick={handleSubmit} disabled={zonePoints.length < 3}>
            Отправить заявку
          </Button>
        </Form>

        {isDrawing && (
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
              {zonePoints.length > 0 && <Polygon positions={zonePoints} />}
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

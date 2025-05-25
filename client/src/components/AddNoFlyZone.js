import React, { useState, useEffect } from "react";
import {
  Offcanvas,
  Button,
  Form,
  Alert,
  Card,
  ListGroup,
  ButtonGroup,
} from "react-bootstrap";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  useMapEvent,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  createNoFlyZone,
  getAllNoFlyZones,
  deleteNoFlyZone,
} from "../http/noFlyZoneAPI";

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

const AddNoFlyZoneForm = ({ show, handleClose, onZoneCreated }) => {
  const [formData, setFormData] = useState({
    description: "",
    zone_type: "polygon",
  });

  const [isDrawing, setIsDrawing] = useState(false);
  const [zonePoints, setZonePoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (zonePoints.length >= 3) {
      setFormData((prev) => ({
        ...prev,
        zone_data: {
          type: "polygon",
          coordinates: zonePoints,
        },
      }));
    }
  }, [zonePoints]);

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

      if (!formData.description || zonePoints.length < 3) {
        setError("Please provide description and draw a zone with at least 3 points");
        return;
      }

      const geoJsonData = {
        type: "Feature",
        properties: {
          description: formData.description,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [...zonePoints.map(point => [point[1], point[0]]), 
             [zonePoints[0][1], zonePoints[0][0]]] //close the polygon
          ],
        },
      };

      const noFlyZoneData = {
        description: formData.description,
        geojson: geoJsonData,
        zone_type: formData.zone_type,
        zone_data: {
          type: "polygon",
          coordinates: zonePoints,
        },
      };

      await createNoFlyZone(noFlyZoneData);
      setSuccess("No-fly zone created successfully!");

      setFormData({
        description: "",
        zone_type: "polygon",
      });
      setZonePoints([]);
      setIsDrawing(false);

      onZoneCreated();

      setTimeout(() => {
        handleClose();
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create no-fly zone"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartDrawing = () => {
    setZonePoints([]);
    setIsDrawing(true);
    setError("");
  };

  const handleAddPoint = (point) => {
    setZonePoints((prev) => [...prev, point]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearZone = () => {
    setZonePoints([]);
    setIsDrawing(false);
  };

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="start"
      backdrop={false}
      className="bg-dark text-white"
      style={{ width: "500px", zIndex: 1050 }}
    >
      <Offcanvas.Header closeButton closeVariant="white">
        <Offcanvas.Title>Add No-Fly Zone</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Airport restricted area, Military zone..."
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Zone Type</Form.Label>
            <Form.Select
              name="zone_type"
              value={formData.zone_type}
              onChange={handleChange}
            >
              <option value="polygon">Polygon</option>
              <option value="circle" disabled>
                Circle (Coming Soon)
              </option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Zone Boundaries ({zonePoints.length} points)
            </Form.Label>
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
                <Button variant="outline-danger" size="sm" onClick={clearZone}>
                  Clear
                </Button>
              )}
            </div>
            <small className="text-muted">
              Click on the map to add points. Minimum 3 points required.
            </small>
          </Form.Group>

          <div className="d-flex gap-2 mb-3">
            <Button
              variant="success"
              onClick={handleSubmit}
              disabled={
                loading || !formData.description || zonePoints.length < 3
              }
            >
              {loading ? "Creating..." : "Create No-Fly Zone"}
            </Button>
          </div>
        </Form>

        {(isDrawing || zonePoints.length > 0) && (
          <div style={{ marginTop: "20px", border: "1px solid #444" }}>
            <MapContainer
              center={[51.13, 71.42]} //Astana coordinates
              zoom={12}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <ClickHandler isDrawing={isDrawing} onAddPoint={handleAddPoint} />
              {zonePoints.length > 2 && (
                <Polygon
                  positions={zonePoints}
                  pathOptions={{ color: "red", fillOpacity: 0.3 }}
                />
              )}
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

const AddNoFlyZone = ({ show, handleClose }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [noFlyZones, setNoFlyZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNoFlyZones = async () => {
    try {
      setLoading(true);
      const data = await getAllNoFlyZones();
      setNoFlyZones(data);
    } catch (error) {
      setError("Failed to load no-fly zones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      fetchNoFlyZones();
    }
  }, [show]);

  const handleOpenAddForm = () => setShowAddForm(true);
  const handleCloseAddForm = () => setShowAddForm(false);

  const handleDeleteZone = async (zoneId) => {
    if (window.confirm("Are you sure you want to delete this no-fly zone?")) {
      try {
        await deleteNoFlyZone(zoneId);
        fetchNoFlyZones();
      } catch (error) {
        setError("Failed to delete no-fly zone");
      }
    }
  };

  return (
    <>
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        backdrop={false}
        className="bg-dark text-white"
        style={{ width: "500px", zIndex: 1040 }}
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>No-Fly Zone Management</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <div className="d-flex gap-2 mb-3">
            <Button variant="primary" onClick={handleOpenAddForm}>
              Add New Zone
            </Button>
            <Button variant="outline-light" onClick={fetchNoFlyZones}>
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <Card className="bg-secondary">
              <Card.Header>
                <h6 className="mb-0 text-white">
                  Existing No-Fly Zones ({noFlyZones.length})
                </h6>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {noFlyZones.length === 0 ? (
                    <ListGroup.Item className="bg-secondary text-white text-center">
                      No zones defined yet
                    </ListGroup.Item>
                  ) : (
                    noFlyZones.map((zone) => (
                      <ListGroup.Item
                        key={zone.id}
                        className="bg-secondary text-white d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <div>
                            <strong>{zone.description}</strong>
                          </div>
                          <small className="text-muted">
                            Type: {zone.zone_type} | Created:{" "}
                            {new Date(zone.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <ButtonGroup size="sm">
                          <Button
                            variant="outline-danger"
                            onClick={() => handleDeleteZone(zone.id)}
                          >
                            Delete
                          </Button>
                        </ButtonGroup>
                      </ListGroup.Item>
                    ))
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <AddNoFlyZoneForm
        show={showAddForm}
        handleClose={handleCloseAddForm}
        onZoneCreated={fetchNoFlyZones}
      />
    </>
  );
};

export default AddNoFlyZone;

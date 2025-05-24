import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Context } from "../index";
import { createFlight } from "../http/flightAPI";
import { getMyDrones } from "../http/droneAPI";
import { useNavigate } from "react-router-dom";
import { MY_FLIGHTS_ROUTE } from "../utils/consts";

const RequestFlight = () => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [drones, setDrones] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    drone_id: "",
    route: "",
    altitude: "",
    purpose: "",
    rtmp_url: "",
  });

  useEffect(() => {
    fetchDrones();
  }, []);

  const fetchDrones = async () => {
    try {
      const dronesData = await getMyDrones();
      setDrones(dronesData);
    } catch (error) {
      setError("Failed to load drones");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let parsedRoute;
      try {
        parsedRoute = JSON.parse(formData.route);
      } catch (e) {
        setError("Invalid JSON format for route");
        setLoading(false);
        return;
      }

      const flightData = {
        drone_id: parseInt(formData.drone_id),
        pilot_id: user.user.id,
        route: parsedRoute,
        altitude: parseFloat(formData.altitude),
        purpose: formData.purpose,
        rtmp_url: formData.rtmp_url || null,
      };

      await createFlight(flightData);
      setSuccess("Flight request submitted successfully!");
      
      setFormData({
        drone_id: "",
        route: "",
        altitude: "",
        purpose: "",
        rtmp_url: "",
      });

      setTimeout(() => {
        navigate(MY_FLIGHTS_ROUTE);
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit flight request");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h3>Request Flight Permission</h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Drone</Form.Label>
                      <Form.Select
                        name="drone_id"
                        value={formData.drone_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a drone</option>
                        {drones.map((drone) => (
                          <option key={drone.id} value={drone.id}>
                            {drone.brand} {drone.model} ({drone.serial})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Altitude (m)</Form.Label>
                      <Form.Control
                        type="number"
                        name="altitude"
                        value={formData.altitude}
                        onChange={handleChange}
                        min="1"
                        max="400"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Route (JSON)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="route"
                    value={formData.route}
                    onChange={handleChange}
                    placeholder='{"coordinates": [[lng, lat], [lng, lat]]}'
                    required
                  />
                  <Form.Text className="text-muted">
                    Enter route as JSON with coordinates array
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>RTMP Stream URL (optional)</Form.Label>
                  <Form.Control
                    type="url"
                    name="rtmp_url"
                    value={formData.rtmp_url}
                    onChange={handleChange}
                    placeholder="rtmp://example.com/live/stream"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Purpose</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    placeholder="Purpose of the flight..."
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RequestFlight;

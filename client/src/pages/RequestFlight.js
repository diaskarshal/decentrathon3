import React, { useState, useContext } from "react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import { Context } from "../index";

const RequestFlight = () => {
  const { user } = useContext(Context);
  const [formData, setFormData] = useState({
    droneId: "",
    route: "",
    altitude: "",
    estimatedDuration: "",
    purpose: "",
    rtmpUrl: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    //TODO: Implement flight request submission
    console.log("Flight request:", formData);
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
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Drone ID</Form.Label>
                      <Form.Control
                        type="text"
                        name="droneId"
                        value={formData.droneId}
                        onChange={handleChange}
                        required
                      />
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
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Estimated Duration (minutes)</Form.Label>
                      <Form.Control
                        type="number"
                        name="estimatedDuration"
                        value={formData.estimatedDuration}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>RTMP Stream URL (optional)</Form.Label>
                      <Form.Control
                        type="url"
                        name="rtmpUrl"
                        value={formData.rtmpUrl}
                        onChange={handleChange}
                        placeholder="rtmp://example.com/live/stream"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Purpose</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Submit Request
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

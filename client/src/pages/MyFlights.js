import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Card,
  Table,
  Badge,
  Button,
  Modal,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Context } from "../index";
import { getMyFlights, getFlight } from "../http/flightAPI";

const MyFlights = () => {
  const { user } = useContext(Context);
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyFlights();
  }, []);

  const fetchMyFlights = async () => {
    try {
      setLoading(true);
      const flightsData = await getMyFlights();
      setFlights(flightsData);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load flights");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      approved: "success",
      active: "info",
      completed: "secondary",
      cancelled: "danger",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  const handleViewDetails = async (flight) => {
    try {
      const detailedFlight = await getFlight(flight.id);
      setSelectedFlight(detailedFlight);
      setShowModal(true);
    } catch (error) {
      setError("Failed to load flight details");
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>My Flights</h3>
          <Button variant="outline-primary" onClick={fetchMyFlights}>
            Refresh
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Drone</th>
                <th>Status</th>
                <th>Start Time</th>
                <th>Altitude</th>
                <th>Purpose</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No flights found
                  </td>
                </tr>
              ) : (
                flights.map((flight) => (
                  <tr key={flight.id}>
                    <td>{flight.id}</td>
                    <td>
                      {flight.drone
                        ? `${flight.drone.brand} ${flight.drone.model}`
                        : "N/A"}
                    </td>
                    <td>{getStatusBadge(flight.status)}</td>
                    <td>
                      {flight.start_time
                        ? new Date(flight.start_time).toLocaleString()
                        : "Not started"}
                    </td>
                    <td>{flight.altitude ? `${flight.altitude}m` : "N/A"}</td>
                    <td>{flight.purpose || "N/A"}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleViewDetails(flight)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Flight Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Flight Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFlight && (
            <div>
              <p>
                <strong>Flight ID:</strong> {selectedFlight.id}
              </p>
              <p>
                <strong>Status:</strong> {getStatusBadge(selectedFlight.status)}
              </p>
              <p>
                <strong>Drone:</strong>{" "}
                {selectedFlight.drone
                  ? `${selectedFlight.drone.brand} ${selectedFlight.drone.model} (${selectedFlight.drone.serial})`
                  : "N/A"}
              </p>
              <p>
                <strong>Altitude:</strong> {selectedFlight.altitude}m
              </p>
              <p>
                <strong>Purpose:</strong> {selectedFlight.purpose || "N/A"}
              </p>
              <p>
                <strong>Route:</strong>{" "}
                <pre>{JSON.stringify(selectedFlight.route, null, 2)}</pre>
              </p>
              {selectedFlight.rtsp_url && (
                <p>
                  <strong>Live Stream:</strong>{" "}
                  <a
                    href={selectedFlight.rtsp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedFlight.rtsp_url}
                  </a>
                </p>
              )}
              <p>
                <strong>Created:</strong>{" "}
                {new Date(selectedFlight.createdAt).toLocaleString()}
              </p>
              {selectedFlight.start_time && (
                <p>
                  <strong>Started:</strong>{" "}
                  {new Date(selectedFlight.start_time).toLocaleString()}
                </p>
              )}
              {selectedFlight.end_time && (
                <p>
                  <strong>Ended:</strong>{" "}
                  {new Date(selectedFlight.end_time).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyFlights;

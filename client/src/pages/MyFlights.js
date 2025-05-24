import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Card,
  Table,
  Badge,
  Button,
  Modal,
} from "react-bootstrap";
import { Context } from "../index";

const MyFlights = () => {
  const { user } = useContext(Context);
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // TODO: Fetch user's flights from API
    // fetchMyFlights();
  }, []);

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

  const handleViewDetails = (flight) => {
    setSelectedFlight(flight);
    setShowModal(true);
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h3>My Flights</h3>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Drone</th>
                <th>Status</th>
                <th>Start Time</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No flights found
                  </td>
                </tr>
              ) : (
                flights.map((flight) => (
                  <tr key={flight.id}>
                    <td>{flight.id}</td>
                    <td>{flight.drone?.model || "N/A"}</td>
                    <td>{getStatusBadge(flight.status)}</td>
                    <td>
                      {flight.start_time
                        ? new Date(flight.start_time).toLocaleString()
                        : "Not started"}
                    </td>
                    <td>
                      {flight.estimated_duration
                        ? `${flight.estimated_duration} min`
                        : "N/A"}
                    </td>
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
                <strong>Purpose:</strong> {selectedFlight.purpose || "N/A"}
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

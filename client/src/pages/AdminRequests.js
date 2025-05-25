import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Table,
  Badge,
  Button,
  ButtonGroup,
  Alert,
  Spinner,
  Modal,
  Form,
} from "react-bootstrap";
import { getAllFlights, approveFlight, rejectFlight, getFlight } from "../http/flightAPI";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingFlight, setRejectingFlight] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const flightsData = await getAllFlights();
      const pendingRequests = flightsData.filter(
        (flight) => flight.status === "pending"
      );
      setRequests(pendingRequests);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (flightId) => {
    try {
      await approveFlight(flightId);
      setRequests(requests.filter((req) => req.id !== flightId));
      alert("Flight approved successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to approve flight");
    }
  };

  const handleRejectClick = (flight) => {
    setRejectingFlight(flight);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    try {
      await rejectFlight(rejectingFlight.id, rejectionReason);
      setRequests(requests.filter((req) => req.id !== rejectingFlight.id));
      setShowRejectModal(false);
      setRejectingFlight(null);
      setRejectionReason("");
      alert("Flight rejected successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reject flight");
    }
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

  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      approved: "success",
      rejected: "danger",
      completed: "secondary",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
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
          <h3>Flight Requests</h3>
          <Button variant="outline-primary" onClick={fetchRequests}>
            Refresh
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Pilot</th>
                <th>Drone</th>
                <th>Altitude</th>
                <th>Purpose</th>
                <th>Start Time</th>
                <th>Requested At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    No pending requests found
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.user?.name || "N/A"}</td>
                    <td>
                      {request.drone
                        ? `${request.drone.name} (${request.drone.model})`
                        : "N/A"}
                    </td>
                    <td>{request.altitude}m</td>
                    <td>{request.purpose || "N/A"}</td>
                    <td>
                      {request.start_time
                        ? new Date(request.start_time).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>{new Date(request.createdAt).toLocaleString()}</td>
                    <td>
                      <ButtonGroup size="sm">
                        <Button
                          variant="outline-info"
                          onClick={() => handleViewDetails(request)}
                        >
                          View
                        </Button>
                        <Button
                          variant="success"
                          onClick={() => handleApprove(request.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleRejectClick(request)}
                        >
                          Reject
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Flight Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFlight && (
            <div>
              <p><strong>Flight ID:</strong> {selectedFlight.id}</p>
              <p><strong>Pilot:</strong> {selectedFlight.user?.name || "N/A"} ({selectedFlight.user?.email})</p>
              <p><strong>Phone:</strong> {selectedFlight.user?.phone || "N/A"}</p>
              <p><strong>Drone:</strong> {selectedFlight.drone ? `${selectedFlight.drone.name} ${selectedFlight.drone.model} (${selectedFlight.drone.serial})` : "N/A"}</p>
              <p><strong>Altitude:</strong> {selectedFlight.altitude}m</p>
              <p><strong>Purpose:</strong> {selectedFlight.purpose || "N/A"}</p>
              <p><strong>Start Time:</strong> {selectedFlight.start_time ? new Date(selectedFlight.start_time).toLocaleString() : "N/A"}</p>
              <p><strong>End Time:</strong> {selectedFlight.end_time ? new Date(selectedFlight.end_time).toLocaleString() : "N/A"}</p>
              <p><strong>Route:</strong></p>
              <pre style={{fontSize: "0.8em", maxHeight: "200px", overflow: "auto"}}>
                {JSON.stringify(selectedFlight.route, null, 2)}
              </pre>
              {selectedFlight.rtmp_url && (
                <p><strong>RTMP URL:</strong> {selectedFlight.rtmp_url}</p>
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

      {}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Flight Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to reject flight request #{rejectingFlight?.id}?</p>
          <Form.Group>
            <Form.Label>Rejection Reason (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRejectConfirm}>
            Reject Flight
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminRequests;

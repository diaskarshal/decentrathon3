import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, ButtonGroup } from "react-bootstrap";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // TODO: Fetch pending flight requests
    // fetchFlightRequests();
  }, []);

  const handleApprove = async (flightId) => {
    // TODO: Implement approval logic
    console.log("Approving flight:", flightId);
  };

  const handleReject = async (flightId) => {
    // TODO: Implement rejection logic
    console.log("Rejecting flight:", flightId);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      approved: "success",
      rejected: "danger",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h3>Flight Requests</h3>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Pilot</th>
                <th>Drone</th>
                <th>Status</th>
                <th>Requested At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No requests found
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.pilot?.name || "N/A"}</td>
                    <td>{request.drone?.model || "N/A"}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>
                      {new Date(request.createdAt).toLocaleString()}
                    </td>
                    <td>
                      {request.status === "pending" && (
                        <ButtonGroup>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleApprove(request.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleReject(request.id)}
                          >
                            Reject
                          </Button>
                        </ButtonGroup>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminRequests;

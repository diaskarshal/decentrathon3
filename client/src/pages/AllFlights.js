import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button } from "react-bootstrap";

const AllFlights = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    // TODO: Fetch all flights
    // fetchAllFlights();
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

  const handleFinishFlight = async (flightId) => {
    // TODO: Implement finish flight logic
    console.log("Finishing flight:", flightId);
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h3>All Flights</h3>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Pilot</th>
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
                  <td colSpan="7" className="text-center">
                    No flights found
                  </td>
                </tr>
              ) : (
                flights.map((flight) => (
                  <tr key={flight.id}>
                    <td>{flight.id}</td>
                    <td>{flight.pilot?.name || "N/A"}</td>
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
                      {flight.status === "active" && (
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleFinishFlight(flight.id)}
                        >
                          Finish Flight
                        </Button>
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

export default AllFlights;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Row, Col, Alert } from "react-bootstrap";

function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); // Redirect if not logged in
    } else {
      fetch("http://localhost:5000/events", {
        headers: { Authorization: `Bearer ${token}` }, // Send JWT token
      })
        .then((res) => res.json())
        .then((data) => setEvents(data))
        .catch((err) => setError("Error fetching events"));
    }
  }, [navigate]);

  return (
    <Container className="mt-5">
      <h2>Upcoming Events</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        {events.map((event) => (
          <Col key={event.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Text>{event.description}</Card.Text>
                <Card.Text><strong>Date:</strong> {event.date}</Card.Text>
                <Button variant="primary">Book Now</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default EventsPage;

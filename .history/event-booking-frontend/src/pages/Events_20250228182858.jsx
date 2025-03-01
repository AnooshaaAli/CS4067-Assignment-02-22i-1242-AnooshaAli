import { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/events") // Change this to your backend API URL
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  return (
    <Container className="mt-5">
      <h2>Upcoming Events</h2>
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

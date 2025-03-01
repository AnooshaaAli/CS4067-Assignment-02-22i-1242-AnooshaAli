import { useState, useEffect } from "react";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/events")  // Calling FastAPI backend
      .then((response) => response.json())
      .then((data) => {
        setEvents(data); // Store fetched events in state
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading events...</p>;

  return (
    <div>
      <h2>Upcoming Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Date:</strong> {new Date(event.date).toDateString()}</p>
            <p><strong>Price:</strong> ${event.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsList;

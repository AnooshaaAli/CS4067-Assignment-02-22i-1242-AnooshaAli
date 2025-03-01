import { useEffect, useState } from "react";

const EventsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/events", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setEvents(data);
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h2>Available Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>📍 {event.location}</p>
            <p>💲 {event.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsPage;
import { useEffect, useState } from "react";
import "../styles/Events.css"; // Import the CSS file

const EventsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/events", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setEvents(data);
    };

    fetchEvents();
  }, []);

  return (
    <div className="events-container">
      <h2 className="events-title">Available Events</h2>
      <ul className="events-list">
        {events.map((event) => (
          <li key={event._id} className="event-card">
            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">{event.description}</p>
            <p className="event-location">📍 {event.location}</p>
            <p className="event-price">💲 {event.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsPage;

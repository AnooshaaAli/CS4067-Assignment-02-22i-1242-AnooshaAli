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

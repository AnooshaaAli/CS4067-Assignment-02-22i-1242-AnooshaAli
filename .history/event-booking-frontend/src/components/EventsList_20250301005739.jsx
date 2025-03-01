import { useEffect, useState } from "react";

const EventsList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  return (
    <div>
      <h2>Events</h2>
      {events.length === 0 ? <p>No events found.</p> : (
        <ul>
          {events.map((event) => (
            <li key={event._id}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Location: {event.location}</p>
              <p>Price: ${event.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventsList;

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    axios.get("http://127.0.0.1:8000/events", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => setEvents(response.data))
    .catch(() => {
      localStorage.removeItem("token");
      navigate("/login");
    });
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h2>Events</h2>
      {events.length === 0 ? <p>No events available.</p> : (
        <ul className="list-group">
          {events.map(event => (
            <li key={event.id} className="list-group-item">{event.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventsPage;

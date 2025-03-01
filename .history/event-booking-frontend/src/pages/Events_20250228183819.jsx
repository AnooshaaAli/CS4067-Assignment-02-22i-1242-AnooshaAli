import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios.get("http://localhost:8000/events", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((response) => setEvents(response.data))
    .catch(() => navigate("/login")); // Redirect if unauthorized
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h2>Events</h2>
      <ul className="list-group">
        {events.map(event => (
          <li key={event.id} className="list-group-item">
            {event.name} - {event.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsPage;

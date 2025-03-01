import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addEvent } from "../services/eventService"; // Import the Event Service
import "../styles/AddEvent.css"; // Import styles

const AddEventPage = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await addEvent(eventData);
      setMessage("✅ Event added successfully!");
      setTimeout(() => navigate("/events"), 2000); // Redirect after 2 seconds
    } catch (error) {
      setMessage("❌ Failed to add event. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="events-container">
      <h2 className="events-title">Add New Event</h2>
      <div className="event-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Title</label>
            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleChange}
              rows="3"
              required
            ></textarea>
          </div>
          <div className="form-group">
          <label>Date</label>
          <input
            type="text"
            name="date"
            onChange={handleChange}
            required
          />
        </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={eventData.price}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Adding..." : "Add Event"}
          </button>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddEventPage;

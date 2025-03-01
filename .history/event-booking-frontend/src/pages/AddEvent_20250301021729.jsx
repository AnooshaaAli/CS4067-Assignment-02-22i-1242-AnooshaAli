import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddEvent.css"; // Importing the same styling

const AddEventPage = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
  });

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/add-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        alert("Event added successfully!");
        navigate("/events"); // Navigate back to Events Page
      } else {
        alert("Failed to add event.");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Something went wrong.");
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
          <button type="submit" className="submit-btn">
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEventPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddBooking.css";

const AddBookingPage = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    user_id: "",  // Assuming user must enter their ID
    event_id: "", // The ID of the event being booked
    num_tickets: 1, // Default to 1 ticket
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/bookings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Booking created successfully!");
        navigate("/bookings"); // Redirect to bookings page after success
      } else {
        setMessage(`Failed to create booking: ${result.detail}`);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      setMessage("An error occurred while creating the booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-container">
      <h2 className="booking-title">Book an Event</h2>
      <div className="booking-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>User ID</label>
            <input
              type="text"
              name="user_id"
              value={bookingData.user_id}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Event ID</label>
            <input
              type="text"
              name="event_id"
              value={bookingData.event_id}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Number of Tickets</label>
            <input
              type="number"
              name="num_tickets"
              value={bookingData.num_tickets}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Booking..." : "Book Event"}
          </button>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddBookingPage;

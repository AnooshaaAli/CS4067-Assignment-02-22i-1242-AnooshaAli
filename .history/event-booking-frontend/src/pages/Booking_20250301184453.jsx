import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Booking.css"; // Import styles

const BookingPage = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    event_id: "",
    tickets: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        alert("Booking successful!");
        setMessage("Booking confirmed.");
      } else {
        alert(`Failed to book event: ${result.detail}`);
      }
    } catch (error) {
      console.error("Error booking event:", error);
      alert("An error occurred while booking.");
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
            <label>Event ID</label>
            <input
              type="number"
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
              name="tickets"
              value={bookingData.tickets}
              onChange={handleChange}
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

export default BookingPage;

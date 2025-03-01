import { useState, useEffect } from "react";
import "../styles/Bookings.css";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/bookings/");
      const data = await response.json();

      if (response.ok) {
        setBookings(data);
      } else {
        setError("Failed to fetch bookings.");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("An error occurred while fetching bookings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bookings-container">
      <h2 className="bookings-title">My Bookings</h2>
      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <p><strong>Booking ID:</strong> {booking.id}</p>
              <p><strong>User ID:</strong> {booking.user_id}</p>
              <p><strong>Event ID:</strong> {booking.event_id}</p>
              <p><strong>Tickets:</strong> {booking.num_tickets}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;

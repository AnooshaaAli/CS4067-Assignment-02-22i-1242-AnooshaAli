import { useState, useEffect } from "react";
import "../styles/Booking.css";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  // Retrieve the current user ID from local storage (or another authentication method)
  const currentUserId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/bookings/");
      const data = await response.json();

      if (response.ok) {
        console.log("Sample booking:", data[0]); // Debugging output
        // Filter bookings for the current user
        const userBookings = data.filter(booking => booking.user_id.toString() === currentUserId);
        setBookings(userBookings);
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
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found for your account.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <p>Booking ID: {booking.id}</p>
            <p>Event ID: {booking.event_id}</p>
            <p>Status: {booking.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default BookingsPage;

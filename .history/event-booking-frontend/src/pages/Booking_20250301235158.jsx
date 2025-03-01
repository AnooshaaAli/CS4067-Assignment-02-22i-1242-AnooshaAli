import { useState, useEffect } from "react";
import "../styles/Booking.css";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const currentUserId 
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/bookings/");
      const data = await response.json();

      if (response.ok) {
        console.log("Sample booking:", data[0]); // For debugging
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const sortedAndFilteredBookings = [...bookings]
    .filter((booking) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        booking.id.toString().includes(searchTerm) ||
        booking.user_id.toString().includes(searchTerm) ||
        booking.event_id.toString().includes(searchTerm) ||
        (booking.status && booking.status.toLowerCase().includes(searchTerm))
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      if (a[sortField] > b[sortField]) {
        comparison = 1;
      } else if (a[sortField] < b[sortField]) {
        comparison = -1;
      }
      return sortDirection === "desc" ? comparison * -1 : comparison;
    });

  const refreshBookings = () => {
    fetchBookings();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  return (
    <div className="bookings-container">
      <h2 className="bookings-title">My Bookings</h2>
      
      <div className="bookings-actions">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <button onClick={refreshBookings} className="refresh-button">
          Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading bookings...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={refreshBookings} className="retry-button">
            Retry
          </button>
        </div>
      ) : sortedAndFilteredBookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p className="empty-text">
            {searchQuery ? "No matching bookings found." : "No bookings found."}
          </p>
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="clear-search-button">
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("id")} className="sortable-header">
                  Booking ID {sortField === "id" && <span className="sort-indicator">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th onClick={() => handleSort("user_id")} className="sortable-header">
                  User ID {sortField === "user_id" && <span className="sort-indicator">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th onClick={() => handleSort("event_id")} className="sortable-header">
                  Event ID {sortField === "event_id" && <span className="sort-indicator">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th onClick={() => handleSort("tickets")} className="sortable-header">
                  Tickets {sortField === "tickets" && <span className="sort-indicator">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th onClick={() => handleSort("status")} className="sortable-header">
                  Status {sortField === "status" && <span className="sort-indicator">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredBookings.map((booking) => (
                <tr key={booking.id} className="booking-row">
                  <td>{booking.id}</td>
                  <td>{booking.user_id}</td>
                  <td>{booking.event_id}</td>
                  <td>{booking.tickets}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(booking.status)}`}>
                      {booking.status || "N/A"}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="view-details-button">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="bookings-summary">
        <p>Total bookings: {sortedAndFilteredBookings.length}</p>
        <p>Total tickets: {sortedAndFilteredBookings.reduce((sum, booking) => sum + parseInt(booking.tickets || 0), 0)}</p>
      </div>
    </div>
  );
};

export default BookingsPage;
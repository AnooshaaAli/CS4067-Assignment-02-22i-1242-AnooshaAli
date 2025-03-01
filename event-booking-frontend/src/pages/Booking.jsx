import { useState, useEffect } from "react";
import "../styles/Booking.css";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingPayment, setProcessingPayment] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState({ text: "", type: "" });

  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    setCurrentUserId(localStorage.getItem("user_id"));
  }, []);  // Runs once when the component mounts
  
  useEffect(() => {
    if (currentUserId) {
      fetchBookings();
    }
  }, [currentUserId]);  // Runs when currentUserId updates  

  useEffect(() => {
    console.log("Updated bookings state:", bookings);
  }, [bookings]);  // Runs every time `bookings` changes

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/bookings/");
      const data = await response.json();
  
      if (response.ok) {
        console.log("Fetched bookings:", data);
        console.log("Current User ID:", currentUserId);
  
        // Ensure user_id comparison is consistent in type
        const userBookings = data.filter(booking => booking.user_id == currentUserId);
  
        console.log("Filtered Bookings:", userBookings);
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

  const handlePayment = async (booking) => {
    // Only allow payment for pending or confirmed bookings
    if (booking.status?.toLowerCase() === "completed") {
      setPaymentMessage({
        text: "This booking is already paid for.",
        type: "info"
      });
      setTimeout(() => setPaymentMessage({ text: "", type: "" }), 3000);
      return;
    }

    try {
      setProcessingPayment(booking.id);
      // Calculate payment amount (in a real app, this would come from the booking details)
      const amount = booking.tickets * 10; // Example: $10 per ticket

      // Call the payment gateway API
      const paymentResponse = await fetch("http://127.0.0.1:8000/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUserId,
          amount: amount,
          booking_id: booking.id
        }),
      });

      if (paymentResponse.ok) {
        // If payment is successful, update the booking status locally
        const updatedBookings = bookings.map((b) => {
          if (b.id === booking.id) {
            return { ...b, status: "completed" };
          }
          return b;
        });
        setBookings(updatedBookings);

        // Update the booking status on the server
        await fetch(`http://127.0.0.1:8000/bookings/${booking.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "completed" }),
        });

        setPaymentMessage({
          text: "Payment successful! Booking status updated to completed.",
          type: "success"
        });
      } else {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.message || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentMessage({
        text: `Payment failed: ${error.message}`,
        type: "error"
      });
    } finally {
      setProcessingPayment(null);
      // Clear the payment message after 5 seconds
      setTimeout(() => setPaymentMessage({ text: "", type: "" }), 5000);
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
    // Clear any payment messages when refreshing
    setPaymentMessage({ text: "", type: "" });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "status-confirmed";
      case "pending":
        return "status-pending";
      case "cancelled":
        return "status-cancelled";
      case "completed":
        return "status-completed";
      default:
        return "";
    }
  };

  const shouldShowPayButton = (status) => {
    // Only show Pay button for pending or confirmed bookings
    return status?.toLowerCase() === "pending" || status?.toLowerCase() === "confirmed";
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
      
      {paymentMessage.text && (
        <div className={`payment-message ${paymentMessage.type}`}>
          {paymentMessage.text}
        </div>
      )}
      
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
            {searchQuery ? "No matching bookings found." : "You have no bookings yet."}
          </p>
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="clear-search-button">
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="bookings-table-container" key={bookings.length}>
          <table className="bookings-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("id")} className="sortable-header">
                  Booking ID {sortField === "id" && <span className="sort-indicator">{sortDirection === "asc" ? "↑" : "↓"}</span>}
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
                  <td>{booking.event_id}</td>
                  <td>{booking.tickets}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(booking.status)}`}>
                      {booking.status || "N/A"}
                    </span>
                  </td>
                  <td className="actions-cell">
                    {shouldShowPayButton(booking.status) ? (
                      <button 
                        className={`view-details-button ${processingPayment === booking.id ? 'processing' : ''}`}
                        onClick={() => handlePayment(booking)}
                        disabled={processingPayment !== null}
                      >
                        {processingPayment === booking.id ? (
                          <>
                            <span className="button-spinner"></span>
                            Processing...
                          </>
                        ) : (
                          'Pay'
                        )}
                      </button>
                    ) : booking.status?.toLowerCase() === "completed" ? (
                      <span className="payment-complete">Paid</span>
                    ) : (
                      <span className="payment-unavailable">Unavailable</span>
                    )}
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
        <p>Completed payments: {sortedAndFilteredBookings.filter(booking => booking.status?.toLowerCase() === "completed").length}</p>
      </div>
    </div>
  );
};

export default BookingsPage;

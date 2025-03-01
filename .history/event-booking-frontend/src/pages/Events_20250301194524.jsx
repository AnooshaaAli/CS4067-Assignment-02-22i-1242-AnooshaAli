import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Events.css";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      setLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleBooking = async (eventId, eventTitle, eventPrice) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

§

    const ticketCount = document.getElementById("ticketCount").value;
  
    if (!userId) {
      setBookingError("User ID is missing. Please log in again.");
      return;
    }
  
    if (!ticketCount || isNaN(ticketCount) || ticketCount <= 0) {
      setBookingError("Please enter a valid number of tickets.");
      return;
    }
  
    setBookingInProgress(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/bookings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          user_id: parseInt(userId, 10),  // ✅ Include user_id
          event_id: parseInt(eventId, 10), 
          tickets: parseInt(ticketCount, 10)
        }),
      });
  
      const result = await response.json();
      console.log("Full API Response:", result); // ✅ Log full response
  
      if (!response.ok) {
        throw new Error(JSON.stringify(result)); // Show detailed error
      }
  
      setShowSuccessMessage(true);
      setTimeout(() => navigate("/bookings"), 2000);
    } catch (error) {
      console.error("Error booking event:", error);
      setBookingError(error.message);
    } finally {
      setBookingInProgress(false);
    }
  };  

  // Filter events based on search term and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // States for booking modal
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const openBookingModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
    setBookingError("");
  };

  const closeBookingModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setBookingError("");
    setShowSuccessMessage(false);
  };

  // Get available categories from events
  const categories = ["all", ...new Set(events.map(event => event.category || "uncategorized"))];

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Discover Events</h1>
        <p>Find and book your next experience</p>
      </div>

      <div className="events-filter-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <i className="search-icon">🔍</i>
        </div>
        
        <div className="category-filter">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="no-events-message">
          <p>No events match your search criteria.</p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-image-container">
                {event.imageUrl ? (
                  <img src={event.imageUrl} alt={event.title} className="event-image" />
                ) : (
                  <div className="event-image-placeholder">
                    <span>{event.title.charAt(0)}</span>
                  </div>
                )}
                {event.category && (
                  <span className="event-category-tag">{event.category}</span>
                )}
              </div>

              <div className="event-details">
                <h2 className="event-title">{event.title}</h2>
                <p className="event-description">{event.description}</p>
                
                <div className="event-info">
                  <div className="event-location">
                    <i className="location-icon">📍</i>
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="event-date">
                    <i className="date-icon">📅</i>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="event-price">
                    <i className="price-icon">💲</i>
                    <span>{event.price}</span>
                  </div>
                </div>
                
                <button 
                  className="book-button"
                  onClick={() => openBookingModal(event)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showModal && selectedEvent && (
        <div className="booking-modal-overlay" onClick={closeBookingModal}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeBookingModal}>×</button>
            <h2>Book Event: {selectedEvent.title}</h2>
            
            <div className="booking-details">
              <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {selectedEvent.location}</p>
              <p><strong>Price per ticket:</strong> ${selectedEvent.price}</p>
            </div>
            
            <div className="ticket-selection">
              <label htmlFor="ticketCount">Number of tickets:</label>
              <input 
                type="number" 
                id="ticketCount" 
                min="1" 
                max="10" 
                defaultValue="1"
                className="ticket-input"
              />
            </div>
            
            {bookingError && <p className="booking-error">{bookingError}</p>}
            
            {showSuccessMessage ? (
              <div className="booking-success">
                <i className="success-icon">✓</i>
                <p>Booking successful! Redirecting to your bookings...</p>
              </div>
            ) : (
              <button 
                className="confirm-booking-button"
                onClick={() => handleBooking(selectedEvent._id, selectedEvent.title, selectedEvent.price)}
                disabled={bookingInProgress}
              >
                {bookingInProgress ? "Processing..." : "Confirm Booking"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;

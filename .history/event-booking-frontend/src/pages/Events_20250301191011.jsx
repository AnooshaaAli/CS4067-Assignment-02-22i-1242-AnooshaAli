import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Events.css";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://127.0.0.1:8000/events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleBooking = async (eventId) => {
    const token = localStorage.getItem("token");
    const numberOfTickets = prompt("Enter the number of tickets:");

    if (!numberOfTickets || isNaN(numberOfTickets) || numberOfTickets <= 0) {
      alert("Please enter a valid number of tickets.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/bookings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: eventId, tickets: parseInt(numberOfTickets, 10) }),
      });

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      const result = await response.json();
      alert("Booking successful!");

      // Redirect to bookings page
      navigate("/bookings");
    } catch (error) {
      console.error("Error booking event:", error);
      alert("Failed to book the event.");
    }
  };

  return (
    <div className="events-container">
      <h2 className="events-title">Available Events</h2>
      <ul className="events-list">
        {events.map((event) => (
          <li key={event._id} className="event-card">
            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">{event.description}</p>
            <p className="event-location">📍 {event.location}</p>
            <p className="event-price">💲 {event.price}</p>
            <button className="book-button" onClick={() => handleBooking(event._id)}>
              Book
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsPage;

import "./styles/AddEvent.css";
import { useState } from "react";

const AddEvent = () => {
  const [event, setEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    price: "",
  });

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5002/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      if (response.ok) {
        alert("Event added successfully!");
        setEvent({ title: "", description: "", date: "", location: "", price: "" });
      } else {
        alert("Failed to add event");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="add-event-form">
      <h2>Add Event</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={event.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={event.description} onChange={handleChange} required />
        <input type="date" name="date" value={event.date} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={event.location} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={event.price} onChange={handleChange} required />
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default AddEvent;

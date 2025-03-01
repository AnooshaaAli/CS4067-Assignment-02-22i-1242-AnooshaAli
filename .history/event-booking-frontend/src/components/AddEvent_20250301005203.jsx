import { useState } from "react";

const AddEvent = () => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    price: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (response.ok) {
      setMessage("Event added successfully!");
      setEventData({
        title: "",
        description: "",
        date: "",
        location: "",
        price: "",
      });
    } else {
      setMessage("Failed to add event.");
    }
  };

  return (
    <div>
      <h2>Add New Event</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={eventData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={eventData.description} onChange={handleChange} required />
        <input type="date" name="date" value={eventData.date} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={eventData.location} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={eventData.price} onChange={handleChange} required />
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default AddEvent;

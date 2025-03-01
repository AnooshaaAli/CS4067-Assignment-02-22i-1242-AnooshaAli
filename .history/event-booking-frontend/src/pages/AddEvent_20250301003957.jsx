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

    // Handle input changes
    const handleChange = (e) => {
        setEventData({
            ...eventData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages

        try {
            const response = await fetch("http://localhost:5002/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventData),
            });

            if (response.ok) {
                setMessage("Event added successfully! ✅");
                setEventData({ title: "", description: "", date: "", location: "", price: "" });
            } else {
                setMessage("Failed to add event ❌");
            }
        } catch (error) {
            setMessage("Error connecting to server ❌");
            console.error("Error:", error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-bold text-gray-700">Add New Event</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    value={eventData.title}
                    onChange={handleChange}
                    placeholder="Event Title"
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                />
                <textarea
                    name="description"
                    value={eventData.description}
                    onChange={handleChange}
                    placeholder="Event Description"
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                />
                <input
                    type="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                />
                <input
                    type="text"
                    name="location"
                    value={eventData.location}
                    onChange={handleChange}
                    placeholder="Event Location"
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                />
                <input
                    type="number"
                    name="price"
                    value={eventData.price}
                    onChange={handleChange}
                    placeholder="Event Price"
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Add Event
                </button>
            </form>

            {message && <p className="text-center font-medium">{message}</p>}
        </div>
    );
};

export default AddEvent;

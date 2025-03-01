const API_URL = "http://127.0.0.1:8000";

export const addEvent = async (eventData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/add-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error("Failed to add event");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

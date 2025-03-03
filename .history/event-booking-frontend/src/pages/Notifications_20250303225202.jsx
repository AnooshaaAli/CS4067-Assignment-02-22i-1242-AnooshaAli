import { useEffect, useState } from "react";

function Notifications({ userId }) {
  const [notifications, setNotifications] = useState(null); // Start with null
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("User ID is missing.");
      return;
    }

    fetch(`http://localhost:5005/notifications/${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }
        setNotifications(data);
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications.");
      });
  }, [userId]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (notifications === null) return <p>Loading...</p>;

  return (
    <div>
      <h2>📩 Your Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        notifications.map((notif) => (
          <div key={notif._id} style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
            <p>{notif.message}</p>
            <small>{new Date(notif.created_at).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;

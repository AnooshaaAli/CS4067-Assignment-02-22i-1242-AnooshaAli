import { useEffect, useState } from "react";

function Notifications({ userId }) {
    const [notifications, setNotifications] = useState([]);
  
    useEffect(() => {
      console.log("User ID in Notifications Component:", userId); // Debugging
      if (!userId) {
        console.error("⚠️ Missing userId, skipping fetch");
        return;
      }
  
      fetch(`http://localhost:5005/notifications/${userId}`)
        .then((res) => res.json())
        .then((data) => setNotifications(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Failed to fetch notifications:", err));
    }, [userId]);
  
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

import { useEffect, useState } from "react";

function Notifications({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5005/notifications/${userId}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error(err));
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

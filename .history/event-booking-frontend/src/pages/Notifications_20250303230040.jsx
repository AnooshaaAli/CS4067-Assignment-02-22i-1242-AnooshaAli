import { useEffect } from "react";

const Notifications = ({ userId }) => {
    console.log("Received userId in Notifications:", userId);
  
    if (!userId) {
      return <p>Loading...</p>; // Handle undefined userId gracefully
    }
  
    return <div>Notifications for User {userId}</div>;
  };
  

export default Notifications;
